"use server";

import { userService } from "@/service/user.service";
import { verifySession } from '@/lib/dal.lib';
import { UserSearchQuerySchema } from "@/schemas/frontend.schemas";

import * as z from 'zod';

interface User {
  id: string;
  email: string;
  name: string;
}

type ActionState<User> = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: User;
  status?: number;
  formValidationError?: z.ZodSafeParseError<string>;
  apiValidationError?: z.ZodError;
} | undefined;

export async function searchUser(
  query: string,
): Promise<ActionState<User[]>> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // 1. Validate form fields
  const validatedFields = UserSearchQuerySchema.safeParse(query)

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      ok: false,
      message: validatedFields.error.message,
    }
  }
  // 3. Insert the user into the database or call an Library API
  const response = await userService.getUsersSearch(session.token as string, query)
  // 4. verify and log errors
  // Si succès : ajouter shouldClose et data
  if(response.ok){
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      status: response.status, 
      data: response.data.users,
    };
  }

  // Si erreur API
    return {
      ok: false,
      message: response.message,
    };
}
