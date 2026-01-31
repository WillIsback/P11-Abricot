import { type ClassValue, clsx } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { Project, Task, User } from "@/schemas/backend.schemas";

/**
 * Combine et fusionne des classes CSS avec Tailwind CSS.
 *
 * @remarks
 * Utilise `clsx` pour la logique conditionnelle et `tailwind-merge`
 * pour résoudre les conflits de classes Tailwind.
 *
 * @param inputs - Les valeurs de classes CSS à combiner.
 * @returns Une chaîne de classes CSS fusionnées.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// ============================================
// UTILITAIRES DE SANITIZATION
// ============================================

/**
 * Nettoie et valide une chaîne de texte.
 *
 * @remarks
 * Utilise DOMPurify pour supprimer les caractères HTML dangereux
 * et prévenir les attaques XSS.
 *
 * @param value - La chaîne à nettoyer (peut être undefined).
 * @returns La chaîne sanitizée ou une chaîne vide si undefined.
 */
export const sanitizeString = (value: string | undefined): string => {
	if (typeof value !== "string") return "";
	return DOMPurify.sanitize(value);
};

/**
 * Nettoie et sécurise un prompt utilisateur pour l'envoi à un LLM.
 *
 * @remarks
 * Effectue plusieurs opérations de nettoyage :
 * - Suppression totale des balises HTML
 * - Filtrage des patterns d'injection (INST, SYS, etc.)
 * - Normalisation des espaces
 * - Troncature à la longueur maximale
 *
 * @param value - Le prompt utilisateur brut.
 * @param maxLength - La longueur maximale autorisée (default: 4000).
 * @returns Le prompt sanitizé et sécurisé.
 */
export const sanitizeUserPrompt = (
	value: string,
	maxLength: number = 4000,
): string => {
	if (typeof value !== "string") return "";
	// 1. Suppression totale du HTML
	// On utilise DOMPurify pour retirer toutes les balises et ne garder que le texte brut.
	let clean = DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [], // Aucune balise autorisée
		ALLOWED_ATTR: [], // Aucun attribut
		KEEP_CONTENT: true, // On garde le texte à l'intérieur des balises
	});
	const injectionPatterns =
		/(\[INST\]|\[\/INST\]|<<SYS>>|<\/s>|### Instruction|### User)/gi;
	clean = clean.replace(injectionPatterns, "");
	clean = clean.replace(/\s+/g, " ").trim();
	if (clean.length > maxLength) {
		clean = clean.substring(0, maxLength);
	}
	return clean;
};

// ============================================
// LOGGER CENTRALISÉ (usage simple)
// ============================================

/**
 * Niveaux de log supportés par le logger centralisé.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Fonctions de log mappées par niveau.
 * @internal
 */
const logFn: Record<LogLevel, (...args: unknown[]) => void> = {
	debug: (...args) => console.debug("[DEBUG]", ...args),
	info: (...args) => console.info("[INFO]", ...args),
	warn: (...args) => console.warn("[WARN]", ...args),
	error: (...args) => console.error("[ERROR]", ...args),
};

/**
 * Logger centralisé pour l'application.
 *
 * @remarks
 * Utilise console.* mais centralise les appels pour pouvoir
 * facilement intégrer un provider externe plus tard (Sentry, etc.).
 *
 * @example
 * ```ts
 * logger.info("User logged in", { userId: "123" });
 * logger.error("Failed to fetch", error);
 * ```
 */
export const logger = {
	debug: (...args: unknown[]) => logFn.debug(...args),
	info: (...args: unknown[]) => logFn.info(...args),
	warn: (...args: unknown[]) => logFn.warn(...args),
	error: (...args: unknown[]) => logFn.error(...args),
};

/**
 * Convertit un objet FormData en objet JavaScript standard.
 *
 * @remarks
 * Gère les champs multiples, les champs vides et les champs
 * qui doivent être transformés en tableaux (split par virgule).
 *
 * @param formData - L'objet FormData à convertir.
 * @param arrayFields - Liste des noms de champs à transformer en tableaux.
 * @returns Un objet Record avec les valeurs converties.
 */
export const formDataToObject = (
	formData: FormData,
	arrayFields?: string[],
) => {
	const result: Record<string, unknown> = {};
	const keys = Array.from(formData.keys());

	for (const key of keys) {
		const values = formData.getAll(key);
		let value = values.length === 1 ? values[0] : values;

		// Si c'est un champ à transformer en array (toujours, pas juste avec virgules)
		if (arrayFields?.includes(key) && typeof value === "string") {
			// Split par virgule, trim les items, et filter les strings vides
			value = value
				.split(",")
				.map((item) => item.trim())
				.filter((item) => item.length > 0);
		}
		if (typeof value === "string" && value.trim() === "") {
			result[key] = undefined;
		} else {
			result[key] = value;
		}
	}
	return result;
};

interface UserType {
	user: z.infer<typeof User>;
}
const UserSchema = z.object({
	user: User,
});

/**
 * Type guard pour vérifier si un objet est un utilisateur valide.
 *
 * @param user - L'objet à vérifier.
 * @returns `true` si l'objet correspond au schéma User.
 */
export const isUser = (user: unknown): user is UserType => {
	return UserSchema.safeParse(user).success;
};

type TasksType = z.infer<typeof TasksSchema>;
const TasksSchema = z.object({
	tasks: z.array(Task),
});

/**
 * Type guard pour vérifier si un objet contient un tableau de tâches valides.
 *
 * @param tasks - L'objet à vérifier.
 * @returns `true` si l'objet correspond au schéma Tasks.
 */
export const isTasks = (tasks: unknown): tasks is TasksType => {
	return TasksSchema.safeParse(tasks).success;
};

type ProjectsType = z.infer<typeof ProjectSchema>;
const ProjectSchema = z.object({
	projects: z.array(Project),
});

/**
 * Type guard pour vérifier si un objet contient un tableau de projets valides.
 *
 * @param projects - L'objet à vérifier.
 * @returns `true` si l'objet correspond au schéma Projects.
 */
export const isProjects = (projects: unknown): projects is ProjectsType => {
	return ProjectSchema.safeParse(projects).success;
};

/**
 * Génère un nom complet à partir du nom actuel et des modifications partielles.
 *
 * @remarks
 * Gère les noms composés correctement. Par exemple :
 * "Jean Pierre Dupont" → prénom: "Jean", nom: "Pierre Dupont"
 *
 * @param currentName - Le nom complet actuel de l'utilisateur.
 * @param firstName - Le nouveau prénom (optionnel, garde l'actuel si undefined).
 * @param lastName - Le nouveau nom de famille (optionnel, garde l'actuel si undefined).
 * @returns Le nom complet généré en combinant prénom et nom.
 */
export const generateName = (
	currentName: string,
	firstName: string | undefined,
	lastName: string | undefined,
): string => {
	// Normalise les espaces multiples et trim
	const parts = currentName.trim().split(/\s+/);
	const currentFirstName = parts[0] || "";
	// Tout sauf le premier mot = nom de famille (gère les noms composés)
	const currentLastName = parts.slice(1).join(" ") || "";

	const newFirstName = firstName?.trim() || currentFirstName;
	const newLastName = lastName?.trim() || currentLastName;

	return `${newFirstName} ${newLastName}`.trim();
};
