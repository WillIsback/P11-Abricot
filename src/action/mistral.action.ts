"use server";

import { revalidatePath } from "next/cache";
import type * as z from "zod";
import { verifySession } from "@/lib/dal.lib";
import type { Task } from "@/schemas/backend.schemas";
import { CreateTaskSchema } from "@/schemas/frontend.schemas";
import { MistralService } from "@/service/mistral.service";
import { TaskService } from "@/service/task.service";

type TasksType = z.infer<typeof Task>[];

/**
 * Génère des suggestions de tâches via l'IA Mistral.
 *
 * @remarks
 * Cette Server Action utilise le service Mistral avec RAG (Retrieval-Augmented Generation)
 * pour générer des tâches pertinentes basées sur les tâches existantes et le prompt utilisateur.
 *
 * @param tasks - La liste des tâches existantes du projet (utilisée pour le contexte RAG).
 * @param _prevState - L'état précédent (requis par useActionState).
 * @param formData - Les données du formulaire contenant le prompt utilisateur.
 * @returns Un objet contenant les tâches générées ou un message d'erreur.
 */
export async function generateAiTask(
	tasks: TasksType,
	_prevState: unknown,
	formData: FormData,
) {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	const query = formData.get("prompt");
	if (!(typeof query === "string"))
		return {
			ok: false,
			message: "Session not verified",
		};

	const response = await MistralService.generateTasks(
		tasks,
		query,
		session.token as string,
	);
	console.log("response", response);
	if (response.ok)
		return {
			ok: true,
			message: "echec de la reponse du service dans l'action",
			data: response.data,
		};
	return {
		ok: false,
		message: "echec de l'action",
	};
}

/**
 * Crée une tâche générée par l'IA dans un projet.
 *
 * @remarks
 * Cette Server Action prend les données d'une tâche générée par Mistral
 * et la crée dans le projet via le service tâche. Revalide le cache du projet après création.
 *
 * @param projectId - L'identifiant unique du projet où créer la tâche.
 * @param title - Le titre de la tâche générée.
 * @param description - La description de la tâche générée.
 * @param dueDate - La date d'échéance de la tâche (format ISO).
 * @returns Un objet contenant la tâche créée ou un message d'erreur.
 */
export async function createAiTask(
	projectId: string,
	title: string,
	description: string,
	dueDate: string,
) {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}
	const task = {
		title: title,
		description: description,
		dueDate: dueDate,
		priority: "MEDIUM",
		assigneeIds: [],
	};
	const validatedFields = CreateTaskSchema.safeParse(task);
	// If any form fields are invalid, return early
	if (!validatedFields.success)
		return {
			ok: false,
			message: validatedFields.error.message,
		};
	const response = await TaskService.createMultipleTask(
		session.token as string,
		projectId,
		validatedFields.data,
	);
	if (response.ok) {
		revalidatePath(`/projects/${projectId}`);
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data.task,
		};
	}
	return {
		ok: false,
		message: `eche de l'action : ${response.message}`,
	};
}
