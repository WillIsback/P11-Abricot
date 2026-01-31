import * as z from "zod";
import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { Comment } from "@/schemas/backend.schemas";
import { CreateCommentSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const CommentResponseSchema = z.object({
	comment: Comment,
});
const DeleteCommentResponse = z.unknown().optional();

/**
 * Service de gestion des commentaires pour communiquer avec l'API backend.
 *
 * @remarks
 * Toutes les méthodes incluent rate limiting (1 requête/500ms) et timeout de 3 secondes.
 */
export const CommentService = {
	/**
	 * Crée un nouveau commentaire sur une tâche via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param taskId - L'identifiant unique de la tâche.
	 * @param payload - Les données du commentaire à créer.
	 * @returns Un objet {@link ApiResult} contenant le commentaire créé ou les erreurs.
	 */
	postComment: async (
		token: string,
		projectId: string,
		taskId: string,
		payload: z.infer<typeof CreateCommentSchema>,
	): Promise<ApiResult<z.infer<typeof CommentResponseSchema>>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}
		const validated = CreateCommentSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, CommentResponseSchema);
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
	 * Met à jour un commentaire existant via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param taskId - L'identifiant unique de la tâche.
	 * @param commentId - L'identifiant unique du commentaire à modifier.
	 * @param payload - Les données modifiées du commentaire.
	 * @returns Un objet {@link ApiResult} contenant le commentaire mis à jour ou les erreurs.
	 */
	updateComment: async (
		token: string,
		projectId: string,
		taskId: string,
		commentId: string,
		payload: z.infer<typeof CreateCommentSchema>,
	): Promise<ApiResult<z.infer<typeof CommentResponseSchema>>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}
		const validated = CreateCommentSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(
					`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(payload),
					},
				),
				3000,
			);
			return await handleFetch(res, CommentResponseSchema);
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
	 * Supprime un commentaire via l'API.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @param taskId - L'identifiant unique de la tâche.
	 * @param commentId - L'identifiant unique du commentaire à supprimer.
	 * @returns Un objet {@link ApiResult} avec le statut de suppression.
	 */
	deleteComment: async (
		token: string,
		projectId: string,
		taskId: string,
		commentId: string,
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
				fetch(
					`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				),
				3000,
			);
			return await handleFetch(res, DeleteCommentResponse);
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
