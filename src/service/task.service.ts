import * as z from "zod";
import { cache } from "react";
import { User, TaskAssignee, Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export const CreateTaskPayload = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.string(),
  dueDate: z.iso.datetime(),
  assignees: z.array(TaskAssignee),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']),
})


type PostResponse = z.infer<typeof Task>;


export const TaskService = {
    createTask: cache(async (token: string, projectId: string, payload: z.infer<typeof CreateTaskPayload>): Promise<ApiResult<PostResponse>> => {
        const validated = CreateTaskPayload.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: validated.error.message};
        }
        const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Task);
    }),

};