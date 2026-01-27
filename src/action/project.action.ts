"use server";

import { ProjectService } from '@/service/project.service';
import { verifySession } from '@/lib/dal.lib';
import { Project } from '@/schemas/backend.schemas';
import { CreateProjectSchema, UpdateProjectSchema } from '@/schemas/frontend.schemas';

import * as z from "zod";

/***************************************************************
 * GET ACTIONS
 * @returns 
 ****************************************************************
 */
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

export async function getProjectTask(projectId: string){
  // 1. Verify session
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // 2. fetch the data
  const ProjectTask = await ProjectService.getProjectTask(session.token as string, projectId)
  // 3. verify and log errors
  if(!ProjectTask.ok){
    console.log(ProjectTask.message)
    if(ProjectTask.details)console.log(ProjectTask.details)
    return {
        ok: false,
        message: ProjectTask.message
    }
  }

  

  // 4. return the data
    return {
        ok: true,
        message: ProjectTask.message,
        data: ProjectTask.data
    }
}

/***************************************************************
 * POST ACTIONS
 * @returns 
 ****************************************************************
 */
export type ProjectActionState = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: z.infer<typeof Project>;
  status?: number;
  formValidationError?: unknown;
  apiValidationError?: unknown;
}

export type State = ProjectActionState | undefined;

export async function createProject(
  projectId: string,
  state: State,
  formData: FormData,
): Promise<State> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }
  // 1. Validate form fields
  const validatedFields = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    contributors: formData.get('contributors'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      ok: false,
      status: 430,
      message: validatedFields.error.message,
      formValidationError: z.treeifyError(validatedFields.error)
    }
  }

  // 2. Prepare data for insertion into database
  const payload = {
    name: validatedFields.data.name,
    description : validatedFields.data.description,
    contributors: validatedFields.data.contributors,

  } as z.infer<typeof CreateProjectSchema>
  // 3. Insert the user into the database or call an Library API
  const response = await ProjectService.createProject(session.token as string, payload)

  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data,  // ← les données de la tâche créée
    };
  }

  // Si erreur API
  return {
    ok: false,
    status: response.status,
    message: response.message,
    apiValidationError: response.validationError
  };
}



export async function updateProject(
  projectId: string,
  state: State,
  formData: FormData,
): Promise<State> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }
  // 1. Validate form fields
  const validatedFields = UpdateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      ok: false,
      status: 430,
      message: validatedFields.error.message,
      formValidationError: z.treeifyError(validatedFields.error)
    }
  }

  // 2. Prepare data for insertion into database
  const payload = {
    name: validatedFields.data.name,
    description : validatedFields.data.description,
  } as z.infer<typeof UpdateProjectSchema>
  // 3. Insert the user into the database or call an Library API
  const response = await ProjectService.updateProject(session.token as string,payload)

  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data,  // ← les données de la tâche créée
    };
  }

  // Si erreur API
  return {
    ok: false,
    status: response.status,
    message: response.message,
    apiValidationError: response.validationError
  };
}