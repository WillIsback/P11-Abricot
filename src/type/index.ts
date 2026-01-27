type ActionResult<T = unknown> = {
  ok: boolean;
  shouldClose?: boolean;
  message?: string;
  data?: T;
  status?: number;
  formValidationError?: unknown;
  apiValidationError?: unknown;
}

export type { ActionResult}