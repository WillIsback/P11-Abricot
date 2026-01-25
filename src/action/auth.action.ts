"use server";

import { createSession, deleteSession } from '@/lib/session.lib'
import { AuthService } from '@/service/auth.service';
import { redirect } from 'next/navigation';
import { sanitizeString } from '@/lib/utils';
import { SignupFormSchema, LoginFormSchema } from '@/schemas/frontend.schemas';
import { verifySession } from '@/lib/dal.lib';

import * as z from 'zod'

export type State =
  | {
      ok : boolean,
      status?: number,
      message?: string,
      formValidationError?: unknown,
      apiValidationError?: unknown
    }
  | undefined


export async function logout() {
  await deleteSession()
  redirect('/login')
}

/**
 * Les composants clients appellent ces actions, pas directement les services.
 */

export async function signup(state: State, formData: FormData) {
  // 1. Validate form fields
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      ok: false,
      status: 430,
      message: validatedFields.error.message,
      formValidationError: z.treeifyError(validatedFields.error)
    }
  }

  // 2. Prepare data for insertion into database
  const name = `${sanitizeString(validatedFields.data.firstName)} ${sanitizeString(validatedFields.data.lastName)}`
  const payload = {
    name: name,
    email: sanitizeString(validatedFields.data.email),
    password: sanitizeString(validatedFields.data.password),
  }
  // 3. Insert the user into the database or call an Library API
  const result = await AuthService.register(payload)


  if(!result.ok){
    console.error("AuthService error : ",result.message)
    if(result.validationError)console.error("AuthService validation error : ", result.validationError)
    if(result.details)console.error("AuthService error details : ", result.details)
    return {
      ok: false,
      status: result.status,
      message: result.message,
      apiValidationError: result.validationError
    };
  }
  
  // 4. Create user session
  const session = await createSession(result.data.user.id, result.data.token)

  console.log(session)
  // 5. Redirect user
  redirect('/dashboard')
}



export async function login(state: State, formData: FormData) {
  // 1. Validate form fields
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      ok: false,
      status: 430,
      message: validatedFields.error.message,
      formValidationError: z.treeifyError(validatedFields.error)
    }
  }
  // 2. Prepare data for insertion into database
  const payload = {
    email: sanitizeString(validatedFields.data.email),
    password: sanitizeString(validatedFields.data.password),
  }
  // 3. Insert the user into the database or call an Library API
  const result = await AuthService.login(payload)

  if(!result.ok){
    console.error("AuthService error : ",result.message)
    if(result.validationError)console.error("AuthService validation error : ", result.validationError)
    if(result.details)console.error("AuthService error details : ", result.details)
    return {
      ok: false,
      status: result.status,
      message: result.message,
      apiValidationError: result.validationError
    };
  }
  // 4. Create user session
  const session = await createSession(result.data.user.id, result.data.token)
  console.log(session)
  // 5. Redirect user
  redirect('/dashboard')
}



export async function profile() {
  // 1. Verify session
  const session = await verifySession();
  if(!session.isAuth || !session.token){
    return {
      ok: false,
      message: "Session not verified",
    }
  }

  // 2. fetch the data
  const profile = await AuthService.profile(session.token as string)
  // 3. verify and log errors
  if(!profile.ok){
    console.log("Profile not ok :", profile.message)
    if(profile.details)console.log("Profile errors details :", profile.details)
    return {
        ok: false,
        message: profile.message
    }
  }

  // 4. return the data
  return {
      ok: true,
      message: profile.message,
      data: profile.data
  }
  
}