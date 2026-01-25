"use server";

import { ProjectService } from '@/service/project.service';
import { verifySession } from '@/lib/dal.lib';

export async function getAllProjects(){
  // 1. Verify session
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // 2. fetch the data
  const allProjects = await ProjectService.getProjects(session.token as string)
  // 3. verify and log errors
  if(!allProjects.ok){
    console.log(allProjects.message)
    if(allProjects.details)console.log(allProjects.details)
    return {
        ok: false,
        message: allProjects.message
    }
  }

  

  // 4. return the data
    return {
        ok: true,
        message: allProjects.message,
        data: allProjects.data
    }
}