"use server";

import { verifySession } from '@/lib/dal.lib';
import { DashboardService } from '@/service/dashboard.service';
/**
 * Data Access Layer (DAL) - Server Actions
 * 
 * Ces actions utilisent automatiquement le bon service (mock ou backend)
 * selon la variable d'environnement USE_MOCK.
 * 
 * Les composants clients appellent ces actions, pas directement les services.
 */

export async function getAllTasks() {
  // 1. Verify session
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }


  // 2. fetch the data
  const allTasks = await DashboardService.getAssignedTasks(session.token as string)
  // 3. verify and log errors
  if(!allTasks.ok){
    console.log(allTasks.message)
    if(allTasks.details)console.log(allTasks.details)
    return {
        ok: false,
        message: allTasks.message
    }
  }

  // 4. return the data
    return {
        ok: true,
        message: allTasks.message,
        data: allTasks.data
    }
  
}


export async function getAllTasksAllProjects() {
  // 1. Verify session
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }


  // 2. fetch the data
  const projectsWithTasks = await DashboardService.getProjectWithTasks(session.token as string)
  // 3. verify and log errors
  if(!projectsWithTasks.ok){
    console.log(projectsWithTasks.message)
    if(projectsWithTasks.details)console.log(projectsWithTasks.details)
    return {
        ok: false,
        message: projectsWithTasks.message
    }
  }

  // 4. return the data
    return {
        ok: true,
        message: projectsWithTasks.message,
        data: projectsWithTasks.data
    }
  
}