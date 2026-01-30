import * as z from "zod";
import { Task } from "@/schemas/backend.schemas";
import { ApiResult, handleFetch, withTimeout, checkRateLimit } from "@/lib/server.lib";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/frontend.schemas";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

const CreateTaskResponse = z.object({
  task: Task
});

// For DELETE, backend may return no payload under `data`.
// Accept undefined or any shape without failing validation.
const DeleteTaskResponse = z.unknown().optional();


export const TaskService = {
    createTask: async (token: string, projectId: string, payload: z.infer<typeof CreateTaskSchema>): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
        // 1. Vérifier rate limit (utiliser token comme identifiant unique)
        if (!checkRateLimit(token, 500, 1)) {
          return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
        }
        const validated = CreateTaskSchema.safeParse(payload);
        if (!validated.success) {
          return { ok: false, status: 400, message: validated.error.message};
        }
        try {
          // 2. Ajouter timeout de 3s
          const res = await withTimeout(
            fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            }),
            3000
          );
          return await handleFetch(res, CreateTaskResponse);
        } catch (error) {
          // Capturer les erreurs de timeout
          if (error instanceof Error && error.message.includes("pris trop de temps")) {
            return { ok: false, status: 408, message: error.message };
          }
          return { ok: false, status: 500, message: "Une erreur inattendue est survenue" };
        }
    },

    updateTask: async (token: string, projectId: string, taskId: string ,payload: z.infer<typeof UpdateTaskSchema>):
     Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
      // 1. Vérifier rate limit (utiliser token comme identifiant unique)
      if (!checkRateLimit(token, 500, 1)) {
        return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
      }

      const validated = UpdateTaskSchema.safeParse(payload);
      if (!validated.success) {
        return { ok: false, status: 400, message: validated.error.message};
      }
      try {
        // 2. Ajouter timeout de 3s
        const res = await withTimeout(
          fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
              method: 'PUT',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(payload),
          }),
          3000
        );
        return await handleFetch(res, CreateTaskResponse);
      } catch (error) {
        // Capturer les erreurs de timeout
        if (error instanceof Error && error.message.includes("pris trop de temps")) {
          return { ok: false, status: 408, message: error.message };
        }
        return { ok: false, status: 500, message: "Une erreur inattendue est survenue" };
      }
  },

  deleteTask: async (token: string, projectId: string, taskId: string): Promise<ApiResult<unknown>> => {
    // 1. Vérifier rate limit (utiliser token comme identifiant unique)
    if (!checkRateLimit(token, 500, 1)) {
      return { ok: false, status: 429, message: "Trop de demandes, patiente 500ms avant de réessayer" };
    }

    try {
      // 2. Ajouter timeout de 3s
      const res = await withTimeout(
        fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        }),
        3000
      );
      return await handleFetch(res, DeleteTaskResponse);
    } catch (error) {
      // Capturer les erreurs de timeout
      if (error instanceof Error && error.message.includes("pris trop de temps")) {
        return { ok: false, status: 408, message: error.message };
      }
      return { ok: false, status: 500, message: "Une erreur inattendue est survenue" };
    }
  },
  createMultipleTask: async (token: string, projectId: string, payload: z.infer<typeof CreateTaskSchema>): Promise<ApiResult<z.infer<typeof CreateTaskResponse>>> => {
      const validated = CreateTaskSchema.safeParse(payload);
      if (!validated.success) {
        return { ok: false, status: 400, message: validated.error.message};
      }
      try {
        // 2. Ajouter timeout de 3s
        const res = await withTimeout(
          fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(payload),
          }),
          3000
        );
        console.log(res.status)
        console.log(res.body)
        return await handleFetch(res, CreateTaskResponse);
      } catch (error) {
        // Capturer les erreurs de timeout
        if (error instanceof Error && error.message.includes("pris trop de temps")) {
          return { ok: false, status: 408, message: error.message };
        }
        return { ok: false, status: 500, message: "Une erreur inattendue est survenue" };
      }
  },
};