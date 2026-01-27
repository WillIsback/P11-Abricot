import 'server-only'

import * as z from "zod";

import { Error, Success } from "@/schemas/backend.schemas";

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
  details?: z.infer<typeof Error>["details"];
  validationError?: z.ZodError;
};

type ActionState<T = unknown> = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: T;
  status?: number;
  formValidationError?: unknown;
  apiValidationError?: unknown;
} | undefined;

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const validateResponse = async <T>(res: Response, schema: z.ZodType<T>) => {
  const responseData = await res.json();
  console.log("responseData : ",responseData)
  return schema.safeParse(responseData);
};

const handleFetch = async <T>(res: Response, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
  if (!res.ok) {
    const parsedError = await validateResponse(res, Error);
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
const apiErrorToState = <T>(response: ApiFailure): ActionState<T> => ({
  ok: false,
  status: response.status,
  message: response.message,
  apiValidationError: response.validationError
});

const validationErrorToState = <T>(validatedFields: z.ZodSafeParseError<T>): ActionState<T> => ({
      ok: false,
      status: 430,
      message: validatedFields?.error.message,
      formValidationError: z.treeifyError(validatedFields?.error)
});

export { handleFetch, apiErrorToState, validationErrorToState, type ActionState }