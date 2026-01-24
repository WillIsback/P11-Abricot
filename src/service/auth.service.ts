import * as z from "zod";
import { cache } from "react";
import { User } from "@/schemas/backend.schemas";
import { validateData, handleFetch } from "@/lib/server.lib";


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



export const AuthService = {
    register: cache(async (payload: z.infer<typeof Register>) => {
        const validated = Register.safeParse(payload);
        if (!validated.success) {
          return { success: false, error: validated.error };
        }
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res)
    }),

    login: cache(async (payload: z.infer<typeof Login>) => {
      const validated = Login.safeParse(payload);
        if (!validated.success) {
          return { success: false, error: validated.error };
        }
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return await handleFetch(res)
    }),
    profile: cache(async (token: string) => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });
        const result = await handleFetch(res);  
        if(result.success === true){
          return validateData(result.data, User)
        } else {
          return { success: false, error: result.error }
        }
    }),
}