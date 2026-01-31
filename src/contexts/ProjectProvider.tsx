"use client";

import { useMemo } from "react";
import { ProjectContext, type ProjectContextType } from "./ProjectContext";

/**
 * Provider React pour le contexte du projet.
 *
 * @remarks
 * Enveloppe les composants enfants pour leur donner accès aux données
 * du projet via le hook `useProject()`. Utilise `useMemo` pour optimiser
 * les re-rendus.
 *
 * @param children - Les composants enfants qui auront accès au contexte.
 * @param data - Les données du projet à partager.
 * @returns Le provider avec les données du projet.
 *
 * @example
 * ```tsx
 * <ProjectProvider data={projectData}>
 *   <ProjectDetails />
 * </ProjectProvider>
 * ```
 */
export function ProjectProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: ProjectContextType;
}) {
	const value = useMemo(() => data, [data]);

	return (
		<ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
	);
}
