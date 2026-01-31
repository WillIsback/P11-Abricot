import type React from "react";
import {
	type DependencyList,
	use,
	useCallback,
	useEffect,
	useState,
	useTransition,
} from "react";
import type * as z from "zod";
import { getAllTasks } from "@/action/dashboard.action";
import { ProjectContext } from "@/contexts/ProjectContext";
import { getProjectDetail } from "@/lib/dto.lib";
import { formDataToObject } from "@/lib/utils";

/**
 * Hook générique pour les requêtes asynchrones.
 *
 * @remarks
 * Gère automatiquement l'état de chargement et les erreurs.
 * Utilise `useTransition` pour une expérience utilisateur fluide.
 *
 * @typeParam T - Le type des données retournées par la fonction fetch.
 * @param fetchFn - La fonction asynchrone à exécuter.
 * @param dependencies - Le tableau de dépendances pour le re-fetch.
 * @returns Un tuple `[isPending, data]` avec l'état de chargement et les données.
 */
function useFetch<T>(
	fetchFn: () => Promise<T | null>,
	dependencies: DependencyList,
): [boolean, T | null] {
	const [isPending, startTransition] = useTransition();
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {
		startTransition(async () => {
			try {
				const result = await fetchFn();
				setData(result ?? null);
			} catch (err) {
				console.error(err);
				setData(null);
			}
		});
		// biome-ignore lint/correctness/useExhaustiveDependencies: generic hook with dynamic dependency list by design
	}, dependencies);

	return [isPending, data];
}

/**
 * Hook pour récupérer le nom d'un projet par son ID.
 *
 * @param projectId - L'identifiant unique du projet.
 * @returns Un tuple `[isPending, projectName]` avec l'état de chargement et le nom.
 */
export function useProjectName(projectId: string) {
	const [isPending, project] = useFetch(
		() => getProjectDetail(projectId),
		[projectId],
	);
	return [isPending, project?.name ?? ""] as const;
}

/**
 * Hook pour récupérer les membres d'un projet par son ID.
 *
 * @param projectId - L'identifiant unique du projet.
 * @returns Un tuple `[isPending, members]` avec l'état de chargement et les membres.
 */
export function useProjectMembers(projectId: string) {
	const [isPending, project] = useFetch(
		() => getProjectDetail(projectId),
		[projectId],
	);
	return [isPending, project?.members ?? null] as const;
}

/**
 * Hook pour récupérer toutes les tâches assignées à l'utilisateur.
 *
 * @returns Un tuple `[isPending, tasks]` avec l'état de chargement et les tâches.
 */
export function useTasks() {
	const [isPending, tasks] = useFetch(() => getAllTasks(), []);
	return [isPending, tasks ?? null] as const;
}

/**
 * Hook pour accéder au contexte du projet courant.
 *
 * @remarks
 * Doit être utilisé à l'intérieur d'un `ProjectProvider`.
 *
 * @returns Le contexte du projet contenant toutes ses informations.
 *
 * @throws Error si utilisé en dehors d'un `ProjectProvider`.
 */
export function useProject() {
	const context = use(ProjectContext);
	if (!context) {
		throw new Error("useProject must be used within ProjectProvider");
	}
	return context;
}

/**
 * Hook de validation de formulaire avec Zod.
 *
 * @remarks
 * Gère la validation en temps réel des champs, les messages d'erreur
 * et le suivi des champs touchés. Compatible avec les champs custom (DatePicker, Combobox).
 *
 * @param formRef - La référence vers l'élément formulaire.
 * @param formSchema - Le schéma Zod pour la validation.
 * @param arrayFields - Liste des champs à transformer en tableaux (optionnel).
 * @returns Un tuple contenant :
 * - `isFormValid` - Booléen indiquant si le formulaire est valide.
 * - `resetForm` - Fonction pour réinitialiser le formulaire.
 * - `handleFormChange` - Handler pour l'événement onChange du formulaire.
 * - `handleCustomFieldChange` - Fonction pour valider les champs custom.
 * - `getFieldError` - Fonction pour récupérer l'erreur d'un champ.
 *
 * @throws Error si `formRef` est null.
 */
export function useFormValidation(
	formRef: React.RefObject<HTMLFormElement | null> | null,
	formSchema: z.ZodType,
	arrayFields?: string[],
) {
	const [isFormValid, setIsFormValid] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

	if (!formRef) throw Error("le formRef est null");
	// Fonction de réinitialisation du formulaire (stable grâce à useCallback)
	const resetForm = useCallback(() => {
		setFieldErrors({});
		setTouchedFields(new Set());
		setIsFormValid(false);
		formRef.current?.reset();
	}, [formRef]);

	const validateForm = (fieldName?: string) => {
		// Marquer le champ comme touché
		if (fieldName) {
			setTouchedFields((prev) => new Set(prev).add(fieldName));
		}

		if (!formRef.current) return;
		const formData = new FormData(formRef.current);
		const formObject = formDataToObject(formData, arrayFields);
		const result = formSchema.safeParse(formObject);
		if (!result.success) {
			// Transformer les erreurs Zod en objet { champ: message }
			const errors: Record<string, string> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as string;
				if (!errors[field]) {
					errors[field] = issue.message;
				}
			});
			setFieldErrors(errors);
		} else {
			setFieldErrors({}); // Pas d'erreurs
		}
		setIsFormValid(result.success);
	};

	// Handler pour onChange du formulaire - détecte le champ modifié
	const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
		const target = e.target as HTMLInputElement;
		const fieldName = target.name;
		const value = target.value;

		if (fieldName) {
			// Si le champ est vidé, on efface l'erreur et on retire des touchedFields
			if (!value || value === "") {
				setFieldErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[fieldName];
					return newErrors;
				});
				setTouchedFields((prev) => {
					const newTouched = new Set(prev);
					newTouched.delete(fieldName);
					return newTouched;
				});
			} else {
				validateForm(fieldName);
			}
		}
	};

	// Handler pour les composants custom (DatePicker, Combobox)
	const handleCustomFieldChange = (fieldName: string) => () => {
		setTimeout(() => validateForm(fieldName), 0);
	};

	// Helper pour n'afficher l'erreur que si le champ a été touché
	const getFieldError = (fieldName: string) => {
		return touchedFields.has(fieldName) ? fieldErrors[fieldName] : undefined;
	};
	return [
		isFormValid,
		resetForm,
		handleFormChange,
		handleCustomFieldChange,
		getFieldError,
	] as const;
}
