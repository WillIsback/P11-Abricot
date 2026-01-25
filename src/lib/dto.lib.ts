"use server";

import { getAllProjects } from '@/action/project.action';


export async function getProjectNameByID( projectId: string): Promise<string> {

  // 1. fetch the data
  const allProjects = await getAllProjects();
  // 2. verify and log errors
  if(!allProjects.ok){
    console.log(allProjects.message)
  }
  // 3. Match ProjectID & ProjectName
  const project = allProjects.data?.projects.find((p) => p.id === projectId)

  // 4. return projectName
  if(project?.name)
  {
    return project.name
  } else {
    return ''
  }
}