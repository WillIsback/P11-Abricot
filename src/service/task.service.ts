import * as z from "zod";
import { cache } from "react";
import { Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export const CreateTaskPayload = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.iso.datetime(),
  assignees: z.array(z.string()),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']),
  priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']),
})

const CreateTaskResponse = z.object({
  task: Task
});

export const TaskService = {
    createTask: cache(async (token: string, projectId: string, payload: z.infer<typeof CreateTaskPayload>): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
        const validated = CreateTaskPayload.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: validated.error.message};
        }
        console.log('payload : ',payload)
        const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res, CreateTaskResponse);
    }),

};