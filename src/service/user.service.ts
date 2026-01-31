import { cache } from "react";
import * as z from "zod";
import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { User } from "@/schemas/backend.schemas";
import {
	UpdatePasswordSchema,
	UserSearchQuerySchema,
} from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const Users = z.object({
	users: z.array(User.omit({ updatedAt: true, createdAt: true })),
});

const UpdateProfileResponse = z.object({
	user: User,
});

const UpdateProfilePayloadSchematic = z.object({
	name: z.string().optional(),
	email: z.email().optional(),
});
const UpdatePasswordResponseSchema = z.unknown().optional();

type UpdatePasswordResponse = z.infer<typeof UpdatePasswordResponseSchema>;
type UsersResponse = z.infer<typeof Users>;

/**
 * Service de gestion des utilisateurs pour communiquer avec l'API backend.
 *
 * @remarks
 * Les méthodes de lecture sont mises en cache avec React `cache()`.
 * Les méthodes de mutation incluent rate limiting.
 */
export const userService = {
	/**
	 * Recherche des utilisateurs par nom ou email.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()`. Timeout de 3 secondes.
	 * Utilisée pour l'autocomplétion dans les formulaires d'assignation.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param query - La chaîne de recherche (minimum 2 caractères).
	 * @returns Un objet {@link ApiResult} contenant la liste des utilisateurs ou les erreurs.
	 */
	getUsersSearch: cache(
		async (token: string, query: string): Promise<ApiResult<UsersResponse>> => {
			// // 1. Vérifier rate limit (utiliser token comme identifiant unique)
			// if (!checkRateLimit(token, 500, 1)) {
			//   return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
			// }

			const validated = UserSearchQuerySchema.safeParse(query);
			if (!validated.success) {
				return { ok: false, status: 400, message: validated.error.message };
			}
			try {
				const res = await withTimeout(
					fetch(`${BASE_URL}/users/search?query=${query}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}),
					3000,
				);
				return await handleFetch(res, Users);
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes("pris trop de temps")
				) {
					return { ok: false, status: 408, message: error.message };
				}
				throw error;
			}
		},
	),

	/**
	 * Met à jour le profil de l'utilisateur connecté.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param payload - Les données modifiées du profil (nom et/ou email).
	 * @returns Un objet {@link ApiResult} contenant le profil mis à jour ou les erreurs.
	 */
	updateProfile: async (
		token: string,
		payload: z.infer<typeof UpdateProfilePayloadSchematic>,
	): Promise<ApiResult<z.infer<typeof UpdateProfileResponse>>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = UpdateProfilePayloadSchematic.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/auth/profile`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, UpdateProfileResponse);
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
	 * Met à jour le mot de passe de l'utilisateur connecté.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param payload - L'ancien et le nouveau mot de passe.
	 * @returns Un objet {@link ApiResult} avec le statut de l'opération.
	 */
	updatePassword: async (
		token: string,
		payload: z.infer<typeof UpdatePasswordSchema>,
	): Promise<ApiResult<UpdatePasswordResponse>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = UpdatePasswordSchema.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}
		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/auth/password`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, UpdatePasswordResponseSchema);
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
