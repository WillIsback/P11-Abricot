"use server";

import { getAllProjects } from '@/action/project.action';

export async function getProjectDetail( projectId: string){

  // 1. fetch the data
  const allProjects = await getAllProjects();
  // 2. verify and log errors
  if(!allProjects.ok){
    console.log(allProjects.message)
  }
  // 3. Match ProjectID & ProjectName
  const project = allProjects.data?.projects.find((p) => p.id === projectId)

  // 4. return projectName
  if(!project)
  {
    console.log("Erreur dans la récupération des détails du projet")
    return null
  } else {
    return project
  }
}