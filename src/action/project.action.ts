"use server";

import { ProjectService } from '@/service/project.service';
import { verifySession } from '@/lib/dal.lib';
import { CreateProjectSchema, UpdateProjectSchema } from '@/schemas/frontend.schemas';
import { FormActionState, FetchResult, apiErrorToState, validationErrorToState } from '@/lib/server.lib';
import { revalidateTag } from 'next/cache';
import * as z from "zod";


/***************************************************************
 * GET ACTIONS (simples)
 ****************************************************************
 */
export async function getAllProjects(): Promise<FetchResult> {
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

export async function getProjectTask(projectId: string): Promise<FetchResult> {
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
 * POST/PUT ACTIONS (avec formulaire)
 ****************************************************************
 */
export async function createProject(
  state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // Parser les contributeurs : split la string en array
  const contributorsString = formData.get('contributors') as string;
  const contributors = contributorsString && contributorsString.trim() 
    ? contributorsString.split(',').map(email => email.trim())
    : [];
  // 1. Validate form fields
  const validatedFields = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    contributors: contributors,
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return validationErrorToState(validatedFields);
  }

  // 2. Prepare data for insertion into database
  const payload = {
    name: validatedFields.data.name,
    description : validatedFields.data.description,
    contributors: validatedFields.data.contributors,

  } as z.infer<typeof CreateProjectSchema>
  // 3. Insert the user into the database or call an Library API
  const response = await ProjectService.createProject(session.token as string, payload)
  console.log('res : ', response)
  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    revalidateTag('projects', "max");
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data.project,  
    };
  }

  // Si erreur API
  return apiErrorToState(response);
}

export async function updateProject(
  projectId: string,
  state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
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
    return validationErrorToState(validatedFields);
  }

  // 2. Prepare data for insertion into database
  const payload = {
    name: validatedFields.data.name,
    description : validatedFields.data.description,
  } as z.infer<typeof UpdateProjectSchema>
  // 3. Insert the user into the database or call an Library API

  // 3. Insert the user into the database or call an Library API
  const response = await ProjectService.updateProject(session.token as string, payload)

  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    revalidateTag('projects', "max");
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