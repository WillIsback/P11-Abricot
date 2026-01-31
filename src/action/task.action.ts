"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { formDataToObject } from "@/lib/utils";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/frontend.schemas";
import { TaskService } from "@/service/task.service";

/**
 * Crée une nouvelle tâche dans un projet via le formulaire de création.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, appelle le service tâche
 * pour créer la tâche, et revalide le cache du projet concerné.
 *
 * @param projectId - L'identifiant unique du projet auquel la tâche sera associée.
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant les informations de la tâche.
 * @returns Un objet {@link FormActionState} contenant la tâche créée ou les erreurs de validation.
 */
export async function createTask(
	projectId: string,
	_state: FormActionState,
	formData: FormData,
): Promise<FormActionState> {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 1. Validate form fields
	const formObject = formDataToObject(formData, ["assigneeIds"]);
	const validatedFields = CreateTaskSchema.safeParse(formObject);
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await TaskService.createTask(
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
	return apiErrorToState(response);
}

/**
 * Met à jour une tâche existante via le formulaire de modification.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, appelle le service tâche
 * pour mettre à jour la tâche, et revalide le cache du projet concerné.
 *
 * @param projectId - L'identifiant unique du projet contenant la tâche.
 * @param taskId - L'identifiant unique de la tâche à modifier.
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant les informations modifiées.
 * @returns Un objet {@link FormActionState} contenant la tâche mise à jour ou les erreurs de validation.
 */
export async function updateTask(
	projectId: string,
	taskId: string,
	_state: FormActionState,
	formData: FormData,
): Promise<FormActionState> {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}
	const formObject = formDataToObject(formData, ["assigneeIds"]);
	const validatedFields = UpdateTaskSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await TaskService.updateTask(
		session.token as string,
		projectId,
		taskId,
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
	return apiErrorToState(response);
}

/**
 * Supprime une tâche d'un projet.
 *
 * @remarks
 * Cette Server Action vérifie la session, puis appelle le service tâche
 * pour supprimer la tâche du projet.
 *
 * @param projectId - L'identifiant unique du projet contenant la tâche.
 * @param taskId - L'identifiant unique de la tâche à supprimer.
 * @returns Un objet {@link FormActionState} contenant le statut de l'opération.
 */
export async function deleteTask(
	projectId: string,
	taskId: string,
): Promise<FormActionState> {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}
	const response = await TaskService.deleteTask(
		session.token as string,
		projectId,
		taskId,
	);
	if (response.ok) {
		return {
			ok: true,
			message: response.message,
			status: response.status,
		};
	}
	// Si erreur API
	return apiErrorToState(response);
}
