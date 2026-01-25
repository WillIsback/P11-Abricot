import * as z from "zod";
import { cache } from "react";
import { User } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const Users = z.object({
    users: z.array(User),
})


type UsersResponse = z.infer<typeof Users>;


export const DashboardService = {
    getUsersSearch: cache(async (token: string, query: string): Promise<ApiResult<UsersResponse>> => {
        const res = await fetch(`${BASE_URL}/users/search?${query}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, Users);  
    }),

};