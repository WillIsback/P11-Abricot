import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { CreateCommentSchema } from "@/schemas/frontend.schemas";
import { Comment } from "@/schemas/backend.schemas";
import * as z from 'zod';

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const CommentResponseSchema = z.object({
  comment: Comment
})
const DeleteCommentResponse = z.unknown().optional();

export const CommentService = {
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
				fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
					method: "PUT",
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
				fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}),
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
}