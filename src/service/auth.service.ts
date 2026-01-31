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

export const AuthService = {
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
