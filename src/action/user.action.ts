"use server";

import { verifySession } from '@/lib/dal.lib';
import { UpdateProfileSchema, UpdatePasswordSchema } from "@/schemas/frontend.schemas";
import { apiErrorToState, validationErrorToState, FormActionState } from "@/lib/server.lib";
import { revalidatePath } from 'next/cache';
import { formDataToObject, sanitizeString } from "@/lib/utils";
import { userService } from "@/service/user.service";

export async function updateProfile(
  state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }
  const formObject = formDataToObject(formData);

  const validatedFields = UpdateProfileSchema.safeParse(formObject);
  if (!validatedFields.success) {
    return validationErrorToState(validatedFields);

  }
  const name = `${sanitizeString(validatedFields.data.firstName)} ${sanitizeString(validatedFields.data.lastName)}`;
  const payload = {
    name: name,
    email: sanitizeString(validatedFields.data.email),
  }
  const response = await userService.updateProfile(session.token as string, payload)

  if(response.ok){
    revalidatePath('/account')
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data,
    };
  }
  return apiErrorToState(response);
}


export async function updatePassword(
  state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }
  const formObject = formDataToObject(formData);
  const validatedFields = UpdatePasswordSchema.safeParse(formObject);
  if (!validatedFields.success) {
    return validationErrorToState(validatedFields);
  }
  const response = await userService.updatePassword(session.token as string, validatedFields.data)
  if(response.ok){
    revalidatePath('/account')
    return {
      ok: true,
      shouldClose: true,
      message: response.message,
      data: response.data,
    };
  }
  return apiErrorToState(response);
}