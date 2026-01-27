'use client';

import { ProjectContext, ProjectContextType } from './ProjectContext'

export function ProjectProvider({
  children,
  data
}: {
  children: React.ReactNode
  data: ProjectContextType
}) {
  return (
    <ProjectContext.Provider value={data}>
      {children}
    </ProjectContext.Provider>
  )
}