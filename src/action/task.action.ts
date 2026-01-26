"use server";

import { TaskService, CreateTaskPayload } from "@/service/task.service";
import { verifySession } from '@/lib/dal.lib';
import { CreateTaskSchema } from "@/schemas/frontend.schemas";
import { Task } from "@/schemas/backend.schemas";



import * as z from 'zod';


export type TaskActionState = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: z.infer<typeof Task>;
  status?: number;
  formValidationError?: unknown;
  apiValidationError?: unknown;
}

export type State = TaskActionState | undefined;


export async function createTask(
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
  const validatedFields = CreateTaskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    assignees: formData.get('assignees'),
    status: formData.get('status')
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
    title: validatedFields.data.title,
    description : validatedFields.data.description,
    dueDate: validatedFields.data.dueDate,
    assignees: validatedFields.data.assignees,
    status: validatedFields.data.status

  } as z.infer<typeof CreateTaskPayload>
  // 3. Insert the user into the database or call an Library API
  const response = await TaskService.createTask(session.token as string,projectId,payload)

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