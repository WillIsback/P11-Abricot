import * as z from "zod";
import { cache } from "react";
import { Project, Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";
import { UpdateProjectSchema, CreateProjectSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';


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
    createProject: cache(async (token: string, payload: z.infer<typeof CreateProjectSchema>): Promise<ApiResult<PostResponse>> => {
        const validated = CreateProjectSchema.safeParse(payload);
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
    updateProject: cache(async (token: string, payload: z.infer<typeof UpdateProjectSchema>): Promise<ApiResult<PostResponse>> => {
        const validated = UpdateProjectSchema.safeParse(payload);
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

    getProjectTask: cache(async (token: string, projectId: string): Promise<ApiResult<TaksResponse>> => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Tasks);  
    }),
};