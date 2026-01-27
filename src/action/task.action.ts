"use server";

import { TaskService } from "@/service/task.service";
import { verifySession } from '@/lib/dal.lib';
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/frontend.schemas";
import { apiErrorToState, validationErrorToState, ActionState } from "@/lib/server.lib";
import { revalidatePath } from 'next/cache';

export async function createTask(
  projectId: string,
  state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // 1. Validate form fields
  const validatedFields = CreateTaskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    assignees: formData.getAll('assignees'),
    status: formData.get('status'),
    priority: formData.get('priority')
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return validationErrorToState(validatedFields);

  }

  // 2. Prepare data for insertion into database

  // 3. Insert the user into the database or call an Library API
  const response = await TaskService.createTask(session.token as string, projectId, validatedFields.data)
  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    revalidatePath(`/projects/${projectId}`);
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data.task,  // ← les données de la tâche créée
    };
  }

  // Si erreur API
  return apiErrorToState(response);
}


export async function updateTask(
  projectId: string,
  taskId: string,
  state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }
  // 1. Validate form fields
  const validatedFields = UpdateTaskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    assignees: formData.getAll('assignees'),
    status: formData.get('status'),
    priority: formData.get('priority')
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return validationErrorToState(validatedFields);

  }

  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API
  const response = await TaskService.updateTask(session.token as string, projectId, taskId, validatedFields.data)

  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data.task,  // ← les données de la tâche créée
    };
  }

  // Si erreur API
  return apiErrorToState(response);
}