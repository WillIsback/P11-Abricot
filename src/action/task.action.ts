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
