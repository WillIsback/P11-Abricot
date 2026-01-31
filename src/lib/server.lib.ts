import "server-only";

import * as z from "zod";

import { ErrorSchema, Success } from "@/schemas/backend.schemas";

/**
 * Type représentant une réponse API réussie.
 *
 * @typeParam T - Le type des données retournées.
 */
type ApiSuccess<T> = {
	ok: true;
	status: number;
	message?: string;
	data: T;
};

/**
 * Type représentant une réponse API échouée.
 */
type ApiFailure = {
	ok: false;
	status: number;
	message: string;
	backendError?: string;
	details?: z.infer<typeof ErrorSchema>["details"];
	validationError?: z.ZodError;
};

/**
 * Type pour les états des actions avec formulaires (useActionState).
 *
 * @remarks
 * Contient les informations nécessaires pour la validation et la gestion du formulaire,
 * incluant les erreurs de validation côté client et API.
 *
 * @typeParam T - Le type des données retournées en cas de succès.
 */
type FormActionState<T = unknown> =
	| {
			ok: boolean;
			shouldClose?: boolean;
			message?: string;
			data?: T;
			status?: number;
			formValidationError?: unknown;
			apiValidationError?: z.ZodError;
	  }
	| undefined;

/**
 * Type pour les actions simples (fetch, sans formulaire).
 *
 * @remarks
 * Structure minimaliste et directe pour les résultats de fetch.
 *
 * @typeParam T - Le type des données retournées.
 */
type FetchResult<T = unknown> = {
	ok: boolean;
	data?: T;
	message?: string;
};

/**
 * Type union représentant le résultat d'une requête API.
 *
 * @typeParam T - Le type des données en cas de succès.
 */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/**
 * Valide les données d'une réponse HTTP avec un schéma Zod.
 *
 * @typeParam T - Le type attendu après validation.
 * @param res - La réponse HTTP à valider.
 * @param schema - Le schéma Zod pour la validation.
 * @returns Le résultat de la validation Zod (SafeParseReturnType).
 */
const validateResponse = async <T>(res: Response, schema: z.ZodType<T>) => {
	const responseData = await res.json();
	// console.log("responseData : ", responseData);
	return schema.safeParse(responseData);
};

/**
 * Gère une réponse HTTP et la transforme en ApiResult typé.
 *
 * @remarks
 * Cette fonction parse la réponse, valide les données avec le schéma fourni,
 * et retourne un objet standardisé avec le statut de succès ou d'échec.
 *
 * @typeParam T - Le type des données attendues en cas de succès.
 * @param res - La réponse HTTP à traiter.
 * @param schema - Le schéma Zod pour valider les données.
 * @returns Un objet {@link ApiResult} contenant les données ou les erreurs.
 */
const handleFetch = async <T>(
	res: Response,
	schema: z.ZodType<T>,
): Promise<ApiResult<T>> => {
	if (!res.ok) {
		const parsedError = await validateResponse(res, ErrorSchema);
		if (parsedError.success) {
			return {
				ok: false,
				status: res.status,
				message: parsedError.data.message,
				backendError: parsedError.data.error,
				details: parsedError.data.details,
			};
		}
		return {
			ok: false,
			status: res.status,
			message: z.prettifyError(parsedError.error),
			validationError: parsedError.error,
		};
	}

	const parsedSuccessEnvelope = await validateResponse(res, Success);
	if (!parsedSuccessEnvelope.success) {
		return {
			ok: false,
			status: res.status,
			message: z.prettifyError(parsedSuccessEnvelope.error),
			validationError: parsedSuccessEnvelope.error,
		};
	}

	const parsedData = schema.safeParse(parsedSuccessEnvelope.data.data);
	if (!parsedData.success) {
		return {
			ok: false,
			status: res.status,
			message: z.prettifyError(parsedData.error),
			validationError: parsedData.error,
		};
	}

	return {
		ok: true,
		status: res.status,
		message: parsedSuccessEnvelope.data.message,
		data: parsedData.data,
	};
};

// ===== HELPERS =====

/**
 * Convertit une erreur API en état de formulaire.
 *
 * @param response - L'objet ApiFailure contenant les détails de l'erreur.
 * @returns Un objet {@link FormActionState} formaté pour l'affichage des erreurs.
 */
const apiErrorToState = (response: ApiFailure): FormActionState => ({
	ok: false,
	status: response.status,
	message: response.message,
	apiValidationError: response.validationError,
});

/**
 * Convertit une erreur de validation Zod en état de formulaire.
 *
 * @param validatedFields - Le résultat d'échec de la validation Zod.
 * @returns Un objet {@link FormActionState} contenant les erreurs de validation.
 */
const validationErrorToState = (
	validatedFields: z.ZodSafeParseError<unknown>,
): FormActionState => ({
	ok: false,
	status: 430,
	message: validatedFields?.error.message,
	formValidationError: validatedFields?.error,
});

// ===== TIMEOUT & RATE LIMIT =====

/**
 * Wrapper pour ajouter un timeout à une Promise.
 *
 * @remarks
 * Utilise Promise.race pour faire échouer la requête si elle dépasse le délai spécifié.
 *
 * @typeParam T - Le type de retour de la Promise.
 * @param promise - La Promise à exécuter.
 * @param timeoutMs - Durée max en millisecondes (default: 3000ms).
 * @param message - Message d'erreur personnalisé.
 * @returns La valeur résolue de la Promise ou rejette avec une erreur de timeout.
 *
 * @throws Error si le timeout est atteint avant la résolution de la Promise.
 */
export async function withTimeout<T>(
	promise: Promise<T>,
	timeoutMs: number = 3000,
	message: string = "La requête a pris trop de temps, veuillez réessayer",
): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(message)), timeoutMs),
		),
	]);
}

// Map pour tracker les tentatives par userId: userId => [timestamp1, timestamp2, ...]
const rateLimitMap = new Map<string, number[]>();

/**
 * Vérifie le rate limit par userId avec une fenêtre glissante.
 *
 * @remarks
 * Utilise une Map en mémoire pour tracker les timestamps des requêtes.
 * Les timestamps expirés sont automatiquement nettoyés à chaque appel.
 *
 * @param userId - Identifiant unique de l'utilisateur (session.userId ou session.token).
 * @param windowMs - Fenêtre de temps en ms (default: 500ms).
 * @param maxRequests - Nombre max de requêtes dans la fenêtre (default: 1).
 * @returns `true` si la requête est autorisée, `false` si le rate limit est atteint.
 */
export function checkRateLimit(
	userId: string,
	windowMs: number = 500,
	maxRequests: number = 1,
): boolean {
	const now = Date.now();
	const userTimestamps = rateLimitMap.get(userId) || [];

	// Supprimer les timestamps expirés (hors de la fenêtre)
	const validTimestamps = userTimestamps.filter((ts) => now - ts < windowMs);

	// Vérifier si on a atteint la limite
	if (validTimestamps.length >= maxRequests) {
		return false;
	}

	// Ajouter le nouveau timestamp et mettre à jour la map
	validTimestamps.push(now);
	rateLimitMap.set(userId, validTimestamps);

	return true;
}

export {
	handleFetch,
	apiErrorToState,
	validationErrorToState,
	type FormActionState,
	type FetchResult,
};
