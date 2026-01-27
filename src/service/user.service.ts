import * as z from "zod";
import { cache } from "react";
import { User } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch, withTimeout } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const Users = z.object({
    users: z.array(User),
})


type UsersResponse = z.infer<typeof Users>;


export const DashboardService = {
    getUsersSearch: cache(async (token: string, query: string): Promise<ApiResult<UsersResponse>> => {
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/users/search?${query}`, {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
            }),
            3000
          );
          return await handleFetch(res, Users);
        } catch (error) {
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          throw error;
        }
    }),

};