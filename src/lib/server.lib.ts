import 'server-only'

import * as z from "zod";

import { Error as ErrorSchema, Success } from "@/schemas/backend.schemas";

type ApiSuccess<T> = {
  ok: true;
  status: number;
  message?: string;
  data: T;
};

type ApiFailure = {
  ok: false;
  status: number;
  message: string;
  backendError?: string;
  details?: z.infer<typeof ErrorSchema>["details"];
  validationError?: z.ZodError;
};

type ActionState<T = unknown> = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: T;
  status?: number;
  formValidationError?: unknown;
  apiValidationError?: z.ZodError;
} | undefined;

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const validateResponse = async <T>(res: Response, schema: z.ZodType<T>) => {
  const responseData = await res.json();
  return schema.safeParse(responseData);
};

const handleFetch = async <T>(res: Response, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  if (!res.ok) {
    const parsedError = await validateResponse(res, ErrorSchema);
    if (parsedError.success) {
      return {
        ok: false,
        status: res.status,
        message: parsedError.data.message,
        backendError: parsedError.data.error,
        details: parsedError.data.details,
      };
    }
    return {
      ok: false,
      status: res.status,
      message: z.prettifyError(parsedError.error),
      validationError: parsedError.error,
    };
  }

  const parsedSuccessEnvelope = await validateResponse(res, Success);
  if (!parsedSuccessEnvelope.success) {
    return {
      ok: false,
      status: res.status,
      message: z.prettifyError(parsedSuccessEnvelope.error),
      validationError: parsedSuccessEnvelope.error,
    };
  }


  const parsedData = schema.safeParse(parsedSuccessEnvelope.data.data);
  if (!parsedData.success) {
    return {
      ok: false,
      status: res.status,
      message: z.prettifyError(parsedData.error),
      validationError: parsedData.error,
    };
  }

  return {
    ok: true,
    status: res.status,
    message: parsedSuccessEnvelope.data.message,
    data: parsedData.data,
  };
};

// server.lib.ts
const apiErrorToState = (response: ApiFailure): ActionState => ({
  ok: false,
  status: response.status,
  message: response.message,
  apiValidationError: response.validationError
});

const validationErrorToState = (validatedFields: z.ZodSafeParseError<unknown>): ActionState => ({
  ok: false,
  status: 430,
  message: validatedFields?.error.message,
  formValidationError: validatedFields?.error
});

// ===== TIMEOUT & RATE LIMIT =====

/**
 * Wrapper pour ajouter un timeout à une Promise
 * @param promise La Promise à exécuter
 * @param timeoutMs Durée max en millisecondes (default: 3000ms)
 * @param message Message d'erreur personnalisé
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 3000,
  message: string = "La requête a pris trop de temps, veuillez réessayer"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(message)),
        timeoutMs
      )
    )
  ])
}

// Map pour tracker les tentatives par userId: userId => [timestamp1, timestamp2, ...]
const rateLimitMap = new Map<string, number[]>()

/**
 * Vérifie le rate limit par userId
 * @param userId Identifiant unique de l'utilisateur (session.userId ou session.token)
 * @param windowMs Fenêtre de temps en ms (default: 500ms)
 * @param maxRequests Nombre max de requêtes dans la fenêtre (default: 1)
 * @returns true si OK, false si rate limit atteint
 */
export function checkRateLimit(
  userId: string,
  windowMs: number = 500,
  maxRequests: number = 1
): boolean {
  const now = Date.now()
  const userTimestamps = rateLimitMap.get(userId) || []

  // Supprimer les timestamps expirés (hors de la fenêtre)
  const validTimestamps = userTimestamps.filter(ts => now - ts < windowMs)

  // Vérifier si on a atteint la limite
  if (validTimestamps.length >= maxRequests) {
    return false
  }

  // Ajouter le nouveau timestamp et mettre à jour la map
  validTimestamps.push(now)
  rateLimitMap.set(userId, validTimestamps)

  return true
}

export { handleFetch, apiErrorToState, validationErrorToState, type ActionState }