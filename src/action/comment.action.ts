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
