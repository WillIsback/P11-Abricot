import { cache } from "react";
import * as z from "zod";
import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { User } from "@/schemas/backend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const Register = z.object({
	email: z.email(),
	password: z.string(),
	name: z.string(),
});

const Login = z.object({
	email: z.email(),
	password: z.string(),
});

const PostResponseData = z.object({
	user: User,
	token: z.string(),
});

const ProfileResponseData = z.object({
	user: User,
});

type PostResponse = z.infer<typeof PostResponseData>;
type UserResponse = z.infer<typeof ProfileResponseData>;

/**
 * Service d'authentification pour communiquer avec l'API backend.
 *
 * @remarks
 * Toutes les méthodes incluent rate limiting et timeout pour la protection contre les abus.
 */
export const AuthService = {
	/**
	 * Inscrit un nouvel utilisateur via l'API.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param payload - Les données d'inscription (email, password, name).
	 * @param userId - L'identifiant pour le rate limiting (email).
	 * @returns Un objet {@link ApiResult} contenant l'utilisateur et le token ou les erreurs.
	 */
	register: async (
		payload: z.infer<typeof Register>,
		userId: string,
	): Promise<ApiResult<PostResponse>> => {
		// 1. Vérifier rate limit
		if (!checkRateLimit(userId, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = Register.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}

		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/auth/register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, PostResponseData);
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

	/**
	 * Authentifie un utilisateur existant via l'API.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param payload - Les identifiants de connexion (email, password).
	 * @param userId - L'identifiant pour le rate limiting (email).
	 * @returns Un objet {@link ApiResult} contenant l'utilisateur et le token ou les erreurs.
	 */
	login: async (
		payload: z.infer<typeof Login>,
		userId: string,
	): Promise<ApiResult<PostResponse>> => {
		// 1. Vérifier rate limit
		if (!checkRateLimit(userId, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = Login.safeParse(payload);
		if (!validated.success) {
			return { ok: false, status: 400, message: validated.error.message };
		}

		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, PostResponseData);
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

	/**
	 * Récupère le profil de l'utilisateur connecté.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()` pour éviter
	 * les appels multiples dans un même cycle de rendu. Timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @returns Un objet {@link ApiResult} contenant les données du profil ou les erreurs.
	 */
	profile: cache(async (token: string): Promise<ApiResult<UserResponse>> => {
		try {
			const res = await withTimeout(
				fetch(`${BASE_URL}/auth/profile`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}),
				3000,
			);
			return await handleFetch(res, ProfileResponseData);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("pris trop de temps")
			) {
				return { ok: false, status: 408, message: error.message };
			}
			throw error;
		}
	}),
};
