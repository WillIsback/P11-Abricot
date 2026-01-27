import * as z from "zod";
import { cache } from "react";
import { Task, ProjectWithTasks } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch, withTimeout } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const Tasks = z.object({
    tasks: z.array(Task),
})

const ProjectsWithTasks = z.object({
    projects: z.array(ProjectWithTasks),
});

type TaksResponse = z.infer<typeof Tasks>;
type ProjectsWithTasksResponse = z.infer<typeof ProjectsWithTasks>;


export const DashboardService = {
    getAssignedTasks: cache(async (token: string): Promise<ApiResult<TaksResponse>> => {
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/dashboard/assigned-tasks`, {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
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
    getProjectWithTasks: cache(async (token: string): Promise<ApiResult<ProjectsWithTasksResponse>> => {
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/dashboard/projects-with-tasks`, {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
            }),
            3000
          );
          return await handleFetch(res, ProjectsWithTasks);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    }),
};