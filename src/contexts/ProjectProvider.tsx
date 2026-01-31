"use client";

import { useMemo } from "react";
import { ProjectContext, type ProjectContextType } from "./ProjectContext";

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
