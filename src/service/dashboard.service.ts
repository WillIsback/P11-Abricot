import * as z from "zod";
import { cache } from "react";
import { Task, ProjectWithTasks } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


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
        const res = await fetch(`${BASE_URL}/dashboard/assigned-tasks`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Tasks);  
    }),
    getProjectWithTasks: cache(async (token: string): Promise<ApiResult<ProjectsWithTasksResponse>> => {
        const res = await fetch(`${BASE_URL}/dashboard/projects-with-tasks`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, ProjectsWithTasks);  
    }),
};