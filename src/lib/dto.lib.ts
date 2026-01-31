"use server";

import { getAllProjects } from "@/action/project.action";
import { isProjects } from "./utils";

/**
 * Récupère les détails d'un projet spécifique par son ID.
 *
 * @remarks
 * Cette fonction récupère tous les projets puis filtre pour trouver
 * celui correspondant à l'ID fourni. Utilisée comme Data Transfer Object (DTO).
 *
 * @param projectId - L'identifiant unique du projet recherché.
 * @returns Le projet trouvé ou null si non trouvé ou erreur.
 */
export async function getProjectDetail(projectId: string) {
	// 1. fetch the data
	const allProjects = await getAllProjects();
	// 2. verify and log errors
	if (!allProjects.ok || !isProjects(allProjects.data)) {
		return null;
	}

	// 3. Match ProjectID
	const project = allProjects.data?.projects.find((p) => p.id === projectId);

	// 4. return projectName
	if (!project) {
		return null;
	} else {
		return project;
	}
}
