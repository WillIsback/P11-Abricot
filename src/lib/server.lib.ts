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

  console.log(parsedSuccessEnvelope.data.data)
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

export { handleFetch }