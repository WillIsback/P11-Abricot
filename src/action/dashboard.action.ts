"use server";

import { verifySession } from "@/lib/dal.lib";
import type { FetchResult } from "@/lib/server.lib";
import { DashboardService } from "@/service/dashboard.service";

/**
 * Data Access Layer (DAL) - Server Actions
 * Fetch simples, pas de formulaires
 */

/**
 * Récupère toutes les tâches assignées à l'utilisateur connecté.
 *
 * @remarks
 * Cette Server Action vérifie la session, puis appelle le service dashboard
 * pour obtenir la liste des tâches assignées à l'utilisateur.
 *
 * @returns Un objet {@link FetchResult} contenant la liste des tâches ou un message d'erreur.
 */
export async function getAllTasks(): Promise<FetchResult> {
	// 1. Verify session
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 2. fetch the data
	const allTasks = await DashboardService.getAssignedTasks(
		session.token as string,
	);
	// 3. verify and log errors
	if (!allTasks.ok) {
		return {
			ok: false,
			message: allTasks.message,
		};
	}

	// 4. return the data
	return {
		ok: true,
		message: allTasks.message,
		data: allTasks.data,
	};
}

/**
 * Récupère tous les projets avec leurs tâches pour le dashboard.
 *
 * @remarks
 * Cette Server Action vérifie la session, puis appelle le service dashboard
 * pour obtenir tous les projets incluant leurs tâches respectives.
 *
 * @returns Un objet {@link FetchResult} contenant les projets avec leurs tâches ou un message d'erreur.
 */
export async function getAllTasksAllProjects(): Promise<FetchResult> {
	// 1. Verify session
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 2. fetch the data
	const projectsWithTasks = await DashboardService.getProjectWithTasks(
		session.token as string,
	);
	// 3. verify and log errors
	if (!projectsWithTasks.ok) {
		return {
			ok: false,
			message: projectsWithTasks.message,
		};
	}

	// 4. return the data
	return {
		ok: true,
		message: projectsWithTasks.message,
		data: projectsWithTasks.data,
	};
}
