"use server";

import { revalidatePath } from "next/cache";
import type * as z from "zod";
import { verifySession } from "@/lib/dal.lib";
import type { Task } from "@/schemas/backend.schemas";
import { CreateTaskSchema } from "@/schemas/frontend.schemas";
import { MistralService } from "@/service/mistral.service";
import { TaskService } from "@/service/task.service";

type TasksType = z.infer<typeof Task>[];
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
