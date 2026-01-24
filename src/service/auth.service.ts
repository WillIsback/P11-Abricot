import * as z from "zod";
import { cache } from "react";
import { User } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch } from "@/lib/server.lib";


const BASE_URL = process.env.API_URL || 'http://localhost:8000/api';

const Name = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

const Register = z.object({
  email: z.email(),
  password: z.string(),
  name: Name,
}).transform((data) => ({
  ...data,
  name: `${data.name.firstName} ${data.name.lastName}`,
}));

const Login = z.object({
  email: z.email(),
  password: z.string()
})

const PostResponseData = z.object({
  user: User,
  token: z.string()
})

type PostResponse = z.infer<typeof PostResponseData>;
type UserResponse = z.infer<typeof User>;

export const AuthService = {
    register: cache(async (payload: z.infer<typeof Register>): Promise<ApiResult<PostResponse>> => {
        const validated = Register.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: "Invalid payload", validationError: validated.error };
        }
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res, PostResponseData);
    }),

    login: cache(async (payload: z.infer<typeof Login>): Promise<ApiResult<PostResponse>> => {
      const validated = Login.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: "Invalid payload", validationError: validated.error };
        }
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res, PostResponseData);
    }),
    profile: cache(async (token: string): Promise<ApiResult<UserResponse>> => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        return await handleFetch(res, User);  
    }),
};