import * as z from "zod";
import { cache } from "react";
import { User } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch, withTimeout, checkRateLimit} from "@/lib/server.lib";
import { UserSearchQuerySchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const Users = z.object({
    users: z.array(User.omit({updatedAt: true, createdAt: true})),
})



type UsersResponse = z.infer<typeof Users>;


export const userService = {
    getUsersSearch: cache(async (token: string, query: string): Promise<ApiResult<UsersResponse>> => {
      // // 1. Vérifier rate limit (utiliser token comme identifiant unique)
      // if (!checkRateLimit(token, 500, 1)) {
      //   return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
      // }

      const validated = UserSearchQuerySchema.safeParse(query);
      if (!validated.success) {
        return { ok: false, status: 400, message: validated.error.message};
      }
        try {
          const res = await withTimeout(
            fetch(`${BASE_URL}/users/search?query=${query}`, {
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