import * as z from "zod";
import { cache } from "react";
import { Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const CreateTaskResponse = z.object({
  task: Task
});

export const TaskService = {
    createTask: cache(async (token: string, projectId: string, payload: z.infer<typeof CreateTaskSchema>): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
        const validated = CreateTaskSchema.safeParse(payload);
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
    updateTask: cache(async (token: string, projectId: string, payload: z.infer<typeof UpdateTaskSchema>): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
      const validated = UpdateTaskSchema.safeParse(payload);
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