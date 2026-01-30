"use server";

import { verifySession } from '@/lib/dal.lib';
import { MistralService } from "@/service/mistral.service";
import { Task } from '@/schemas/backend.schemas';
import * as z from 'zod';


type TasksType = z.infer<typeof Task>[]
export async function generateAiTask(
  tasks: TasksType,
  prevState: unknown,
  formData: FormData
){
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  const query = formData.get('prompt')
  if(!(typeof query === 'string')) return {
    ok: false,
    message: "Session not verified",
  }
  const response = await MistralService.generateTasks(tasks, query, session.token as string);
  if(response.ok)
  return {
    ok: true,
    message: "echec de la reponse du service dans l'action",
    data: response.data
  }
  return {
    ok: false,
    message: "echec de l'action",
  }

}
