import { cache } from "react";
import * as z from "zod";
import { type ApiResult, handleFetch, withTimeout } from "@/lib/server.lib";
import { ProjectWithTasks, Task } from "@/schemas/backend.schemas";

const BASE_URL = process.env.API_URL || "http://localhost:8000";

const Tasks = z.object({
	tasks: z.array(Task),
});

const ProjectsWithTasks = z.object({
	projects: z.array(ProjectWithTasks),
});

type TaksResponse = z.infer<typeof Tasks>;
type ProjectsWithTasksResponse = z.infer<typeof ProjectsWithTasks>;

/**
 * Service du dashboard pour communiquer avec l'API backend.
 *
 * @remarks
 * Toutes les méthodes sont mises en cache avec React `cache()` et incluent un timeout de 3 secondes.
 */
export const DashboardService = {
	/**
	 * Récupère toutes les tâches assignées à l'utilisateur connecté.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()`. Timeout de 3 secondes.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @returns Un objet {@link ApiResult} contenant la liste des tâches ou les erreurs.
	 */
	getAssignedTasks: cache(
		async (token: string): Promise<ApiResult<TaksResponse>> => {
			try {
				const res = await withTimeout(
					fetch(`${BASE_URL}/dashboard/assigned-tasks`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
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
	/**
	 * Récupère tous les projets avec leurs tâches.
	 *
	 * @remarks
	 * Cette méthode est mise en cache avec React `cache()`. Timeout de 3 secondes.
	 * Utilisée pour afficher la vue globale du dashboard.
	 *
	 * @param token - Le token JWT d'authentification.
	 * @returns Un objet {@link ApiResult} contenant les projets avec leurs tâches ou les erreurs.
	 */
	getProjectWithTasks: cache(
		async (token: string): Promise<ApiResult<ProjectsWithTasksResponse>> => {
			try {
				const res = await withTimeout(
					fetch(`${BASE_URL}/dashboard/projects-with-tasks`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}),
					3000,
				);
				return await handleFetch(res, ProjectsWithTasks);
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
