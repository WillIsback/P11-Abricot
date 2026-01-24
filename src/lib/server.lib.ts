import * as z from "zod";

import { Error, Success } from "@/schemas/backend.schemas";

const validateResponse = async (res : Response, schema: z.ZodType) => {
  const responseData = await res.json();
  return schema.safeParse(responseData);
}

const validateData = <T>(data: unknown, schema: z.ZodType<T>) => {
  const parsed = schema.safeParse(data);
  return parsed.success ? { success: true, data: parsed.data } : { success: false, error: parsed.error };
};

const handleFetch = async (res: Response) => {
    if (!res.ok) {
      const error = await validateResponse(res, Error);
      if(!error.success){
        console.warn('Fail to validate error response from auth service fetch', error.error)
      } else {
        console.warn(error.data)
      }
      return error
    } else {
      const success = await validateResponse(res, Success);
      if(!success.success){
        console.warn('Fail to validate success response from auth service fetch', success.error)
      } else {
        console.log(success.success)
      }
      return success
    }
}


export { validateResponse, validateData, handleFetch }