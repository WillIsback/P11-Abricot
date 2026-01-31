"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { formDataToObject } from "@/lib/utils";
import {
	CreateCommentSchema,
	UpdateCommentSchema,
} from "@/schemas/frontend.schemas";
import { CommentService } from "@/service/comment.service";

/**
 * Crée un nouveau commentaire sur une tâche via le formulaire.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, appelle le service commentaire
 * pour créer le commentaire, et revalide le cache du projet concerné.
 *
 * @param projectId - L'identifiant unique du projet contenant la tâche.
 * @param taskId - L'identifiant unique de la tâche à commenter.
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant le contenu du commentaire.
 * @returns Un objet {@link FormActionState} contenant le commentaire créé ou les erreurs.
 */
export async function createComment(
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

	// 1. Validate form fields
	const formObject = formDataToObject(formData);
	const validatedFields = CreateCommentSchema.safeParse(formObject);
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await CommentService.postComment(
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
			data: response.data,
		};
	}
	return apiErrorToState(response);
}

/**
 * Met à jour un commentaire existant via le formulaire de modification.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, appelle le service commentaire
 * pour mettre à jour le commentaire, et revalide le cache du projet concerné.
 *
 * @param projectId - L'identifiant unique du projet contenant la tâche.
 * @param taskId - L'identifiant unique de la tâche contenant le commentaire.
 * @param commentId - L'identifiant unique du commentaire à modifier.
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant le contenu modifié.
 * @returns Un objet {@link FormActionState} contenant le commentaire mis à jour ou les erreurs.
 */
export async function updateComment(
	projectId: string,
	taskId: string,
	commentId: string,
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
	const validatedFields = UpdateCommentSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await CommentService.updateComment(
		session.token as string,
		projectId,
		taskId,
		commentId,
		validatedFields.data,
	);

	if (response.ok) {
		revalidatePath(`/projects/${projectId}`);
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data,
		};
	}
	return apiErrorToState(response);
}

/**
 * Supprime un commentaire d'une tâche.
 *
 * @remarks
 * Cette Server Action vérifie la session, puis appelle le service commentaire
 * pour supprimer le commentaire et revalide le cache du projet.
 *
 * @param projectId - L'identifiant unique du projet contenant la tâche.
 * @param taskId - L'identifiant unique de la tâche contenant le commentaire.
 * @param commentId - L'identifiant unique du commentaire à supprimer.
 * @returns Un objet {@link FormActionState} contenant le statut de l'opération.
 */
export async function deleteComment(
	projectId: string,
	taskId: string,
	commentId: string,
): Promise<FormActionState> {
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}
	const response = await CommentService.deleteComment(
		session.token as string,
		projectId,
		taskId,
		commentId,
	);
	if (response.ok) {
		revalidatePath(`/projects/${projectId}`);
		return {
			ok: true,
			message: response.message,
			status: response.status,
		};
	}
	// Si erreur API
	return apiErrorToState(response);
}
