import * as z from "zod";
import { cache } from "react";
import { Project, Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const ProjectRequest = z.object({
  name: z.string(),
  description: z.string(),
  contributors: z.array(z.email())
});

const Projects = z.object({
    projects: z.array(Project)
})

const Tasks = z.object({
    tasks: z.array(Task),
})


type PostResponse = z.infer<typeof Project>;
type ProjectsResponse = z.infer<typeof Projects>;
type TaksResponse = z.infer<typeof Tasks>;

export const ProjectService = {
    postProjects: cache(async (token: string, payload: z.infer<typeof ProjectRequest>): Promise<ApiResult<PostResponse>> => {
        const validated = ProjectRequest.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: "Invalid payload", validationError: validated.error };
        }
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res, Project);
    }),

    getProjects: cache(async (token: string): Promise<ApiResult<ProjectsResponse>> => {
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Projects);  
    }),

    getProjectTask: cache(async (token: string, id: string): Promise<ApiResult<TaksResponse>> => {
        const res = await fetch(`${BASE_URL}/projects/${id}/tasks`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Tasks);  
    }),
};