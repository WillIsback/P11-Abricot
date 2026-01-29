"use server";

import { getAllProjects } from '@/action/project.action';
import { isProjects } from './utils';
export async function getProjectDetail( projectId: string){

  // 1. fetch the data
  const allProjects = await getAllProjects();
  // 2. verify and log errors
  if(!allProjects.ok || !isProjects(allProjects.data)){
    return null
  }

  // 3. Match ProjectID 
  const project = allProjects.data?.projects.find((p) => p.id === projectId)

  // 4. return projectName
  if(!project)
  {
    return null
  } else {
    return project
  }
}