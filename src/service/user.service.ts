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

const UpdateProfilePayloadSchematic = z.object({
	name: z.string().optional(),
	email: z.email().optional,
});
const UpdatePasswordResponseSchema = z.object({
	ok: z.boolean(),
	status: z.number(),
	message: z.string().optional(),
});

type UpdatePasswordResponse = z.infer<typeof UpdatePasswordResponseSchema>;
type UsersResponse = z.infer<typeof Users>;
type UserResponse = z.infer<typeof User>;

export const userService = {
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

	updateProfile: async (
		token: string,
		payload: z.infer<typeof UpdateProfilePayloadSchematic>,
	): Promise<ApiResult<UserResponse>> => {
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
			return await handleFetch(res, User);
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
