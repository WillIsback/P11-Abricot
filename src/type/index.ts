import { z } from "zod";

type ActionResult<T = unknown> = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: T;
  status?: number;
  formValidationError?: z.ZodError | z.ZodFormattedError<unknown>;
  apiValidationError?: z.ZodError;
}

export type { ActionResult}