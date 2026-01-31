import * as z from "zod";
import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { Task } from "@/schemas/backend.schemas";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const CreateTaskResponse = z.object({
	task: Task,
});

// For DELETE, backend may return no payload under `data`.
// Accept undefined or any shape without failing validation.
const DeleteTaskResponse = z.unknown().optional();

/**
 * Service de gestion des tâches pour communiquer avec l'API backend.
 *
 * @remarks
 * Toutes les méthodes incluent rate limiting (1 requête/500ms) et timeout de 3 secondes.
 */
export const TaskService = {
	/**
	 * Crée une nouvelle tâche dans un projet via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param payload - Les données de la tâche à créer.
	 * @returns Un objet {@link ApiResult} contenant la tâche créée ou les erreurs.
	 */
	createTask: async (
		token: string,
		projectId: string,
		payload: z.infer<typeof CreateTaskSchema>,
	): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}
		const validated = CreateTaskSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, CreateTaskResponse);
		} catch (error) {
			// Capturer les erreurs de timeout
			if (
				error instanceof Error &&
				error.message.includes("pris trop de temps")
			) {
				return { ok: false, status: 408, message: error.message };
			}
			return {
				ok: false,
				status: 500,
				message: "Une erreur inattendue est survenue",
			};
		}
	},

	/**
	 * Met à jour une tâche existante via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param taskId - L'identifiant unique de la tâche à modifier.
	 * @param payload - Les données modifiées de la tâche.
	 * @returns Un objet {@link ApiResult} contenant la tâche mise à jour ou les erreurs.
	 */
	updateTask: async (
		token: string,
		projectId: string,
		taskId: string,
		payload: z.infer<typeof UpdateTaskSchema>,
	): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = UpdateTaskSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, CreateTaskResponse);
		} catch (error) {
			// Capturer les erreurs de timeout
			if (
				error instanceof Error &&
				error.message.includes("pris trop de temps")
			) {
				return { ok: false, status: 408, message: error.message };
			}
			return {
				ok: false,
				status: 500,
				message: "Une erreur inattendue est survenue",
			};
		}
	},

	/**
	 * Supprime une tâche via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param taskId - L'identifiant unique de la tâche à supprimer.
	 * @returns Un objet {@link ApiResult} avec le statut de suppression.
	 */
	deleteTask: async (
		token: string,
		projectId: string,
		taskId: string,
	): Promise<ApiResult<unknown>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}),
				3000,
			);
			return await handleFetch(res, DeleteTaskResponse);
		} catch (error) {
			// Capturer les erreurs de timeout
			if (
				error instanceof Error &&
				error.message.includes("pris trop de temps")
			) {
				return { ok: false, status: 408, message: error.message };
			}
			return {
				ok: false,
				status: 500,
				message: "Une erreur inattendue est survenue",
			};
		}
	},

	/**
	 * Crée une tâche sans rate limiting (pour création en lot par l'IA).
	 *
	 * @remarks
	 * Utilisée par le service Mistral pour créer plusieurs tâches générées par l'IA.
	 * Ne possède pas de rate limiting pour permettre la création en séquence rapide.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param payload - Les données de la tâche à créer.
	 * @returns Un objet {@link ApiResult} contenant la tâche créée ou les erreurs.
	 */
	createMultipleTask: async (
		token: string,
		projectId: string,
		payload: z.infer<typeof CreateTaskSchema>,
	): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
		const validated = CreateTaskSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, CreateTaskResponse);
		} catch (error) {
			// Capturer les erreurs de timeout
			if (
				error instanceof Error &&
				error.message.includes("pris trop de temps")
			) {
				return { ok: false, status: 408, message: error.message };
			}
			return {
				ok: false,
				status: 500,
				message: "Une erreur inattendue est survenue",
			};
		}
	},
};
