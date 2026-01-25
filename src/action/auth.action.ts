"use server";

import { createSession, deleteSession } from '@/lib/session.lib'
import { AuthService } from '@/service/auth.service';
import { redirect } from 'next/navigation';
import { sanitizeString } from '@/lib/utils';
import { SignupFormSchema } from '@/schemas/frontend.schemas';

import * as z from 'zod'

export type signupState =
  | {
      ok : boolean,
      status?: number,
      message?: string,
      formValidationError?: unknown,
      apiValidationError?: unknown
    }
  | undefined

/**
 * Data Access Layer (DAL) - Server Actions
 * 
 * Ces actions utilisent automatiquement le bon service (mock ou backend)
 * selon la variable d'environnement USE_MOCK.
 * 
 * Les composants clients appellent ces actions, pas directement les services.
 */

export async function signup(state: signupState, formData: FormData) {
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

export async function logout() {
  await deleteSession()
  redirect('/login')
}