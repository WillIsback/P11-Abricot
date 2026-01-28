import * as z from "zod";
import { cache } from "react";
import { Project, Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch, withTimeout, checkRateLimit } from "@/lib/server.lib";
import { UpdateProjectSchema, CreateProjectSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';


const Projects = z.object({
    projects: z.array(Project)
})

const Tasks = z.object({
    tasks: z.array(Task),
})

const Projectobj = z.object({
  project: Project
})
type ProjectResponse = z.infer<typeof Projectobj>;
type ProjectsResponse = z.infer<typeof Projects>;
type TaksResponse = z.infer<typeof Tasks>;

export const ProjectService = {
    createProject: async (token: string, payload: z.infer<typeof CreateProjectSchema>): Promise<ApiResult<ProjectResponse>> => {
        // 1. Vérifier rate limit (utiliser token comme identifiant unique)
        if (!checkRateLimit(token, 500, 1)) {
          return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
        }

        const validated = CreateProjectSchema.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: "Invalid payload", validationError: validated.error };
        }

        try {
          // 2. Ajouter timeout de 3s
          const res = await withTimeout(
            fetch(`${BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            }),
            3000
          );
          return await handleFetch(res, Projectobj);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    },

    updateProject: async (token: string, projectId: string, payload: z.infer<typeof UpdateProjectSchema>): Promise<ApiResult<ProjectResponse>> => {
        // 1. Vérifier rate limit (utiliser token comme identifiant unique)
        if (!checkRateLimit(token, 500, 1)) {
          return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
        }

        const validated = UpdateProjectSchema.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: "Invalid payload", validationError: validated.error };
        }

        try {
          // 2. Ajouter timeout de 3s
          const res = await withTimeout(
            fetch(`${BASE_URL}/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            }),
            3000
          );
          return await handleFetch(res, Projectobj);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    },

    getProjects: cache(async (token: string): Promise<ApiResult<ProjectsResponse>> => {
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/projects`, {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                next: { tags: ['projects'] }
            }),
            3000
          );
          return await handleFetch(res, Projects);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    }),

    getProjectTask: cache(async (token: string, projectId: string): Promise<ApiResult<TaksResponse>> => {
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                next: { tags: ['projects'] }
            }),
            3000
          );
          return await handleFetch(res, Tasks);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    }),
};