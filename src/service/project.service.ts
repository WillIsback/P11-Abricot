import { cache } from "react";
import * as z from "zod";
import {
	type ApiResult,
	checkRateLimit,
	handleFetch,
	withTimeout,
} from "@/lib/server.lib";
import { Project, Task } from "@/schemas/backend.schemas";
import {
	CreateProjectSchema,
	UpdateProjectSchema,
} from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const Projects = z.object({
	projects: z.array(Project),
});

const Tasks = z.object({
	tasks: z.array(Task),
});

const Projectobj = z.object({
	project: Project,
});
type ProjectResponse = z.infer<typeof Projectobj>;
type ProjectsResponse = z.infer<typeof Projects>;
type TaksResponse = z.infer<typeof Tasks>;

/**
 * Service de gestion des projets pour communiquer avec l'API backend.
 *
 * @remarks
 * Toutes les méthodes de mutation incluent rate limiting et timeout.
 * Les méthodes de lecture sont mises en cache avec React `cache()`.
 */
export const ProjectService = {
	/**
	 * Crée un nouveau projet via l'API.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param payload - Les données du projet à créer.
	 * @returns Un objet {@link ApiResult} contenant le projet créé ou les erreurs.
	 */
	createProject: async (
		token: string,
		payload: z.infer<typeof CreateProjectSchema>,
	): Promise<ApiResult<ProjectResponse>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = CreateProjectSchema.safeParse(payload);
		if (!validated.success) {
			return {
				ok: false,
				status: 400,
				message: "Invalid payload",
				validationError: validated.error,
			};
		}

		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, Projectobj);
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
	 * Met à jour un projet existant via l'API.
	 *
	 * @remarks
	 * Inclut rate limiting (1 requête/500ms) et timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet à modifier.
	 * @param payload - Les données modifiées du projet.
	 * @returns Un objet {@link ApiResult} contenant le projet mis à jour ou les erreurs.
	 */
	updateProject: async (
		token: string,
		projectId: string,
		payload: z.infer<typeof UpdateProjectSchema>,
	): Promise<ApiResult<ProjectResponse>> => {
		// 1. Vérifier rate limit (utiliser token comme identifiant unique)
		if (!checkRateLimit(token, 500, 1)) {
			return {
				ok: false,
				status: 429,
				message: "Trop de demandes, patiente 500ms avant de réessayer",
			};
		}

		const validated = UpdateProjectSchema.safeParse(payload);
		if (!validated.success) {
			return {
				ok: false,
				status: 400,
				message: "Invalid payload",
				validationError: validated.error,
			};
		}

		try {
			// 2. Ajouter timeout de 3s
			const res = await withTimeout(
				fetch(`${BASE_URL}/projects/${projectId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				}),
				3000,
			);
			return await handleFetch(res, Projectobj);
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
	 * Récupère tous les projets de l'utilisateur.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()` et utilise
	 * le tag "projects" pour l'invalidation. Timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @returns Un objet {@link ApiResult} contenant la liste des projets ou les erreurs.
	 */
	getProjects: cache(
		async (token: string): Promise<ApiResult<ProjectsResponse>> => {
			try {
				const res = await withTimeout(
					fetch(`${BASE_URL}/projects`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						next: { tags: ["projects"] },
					}),
					3000,
				);
				return await handleFetch(res, Projects);
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
	 * Récupère toutes les tâches d'un projet spécifique.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()` et utilise
	 * le tag "projects" pour l'invalidation. Timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @param projectId - L'identifiant unique du projet.
	 * @returns Un objet {@link ApiResult} contenant la liste des tâches ou les erreurs.
	 */
	getProjectTask: cache(
		async (
			token: string,
			projectId: string,
		): Promise<ApiResult<TaksResponse>> => {
			try {
				const res = await withTimeout(
					fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						next: { tags: ["projects"] },
					}),
					3000,
				);
				return await handleFetch(res, Tasks);
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
};
