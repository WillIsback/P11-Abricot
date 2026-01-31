"use server";

import { revalidateTag } from "next/cache";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FetchResult,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { formDataToObject } from "@/lib/utils";
import {
	CreateProjectSchema,
	UpdateProjectSchema,
} from "@/schemas/frontend.schemas";
import { ProjectService } from "@/service/project.service";

/***************************************************************
 * GET ACTIONS (simples)
 ****************************************************************
 */
export async function getAllProjects(): Promise<FetchResult> {
	// 1. Verify session
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 2. fetch the data
	const allProjects = await ProjectService.getProjects(session.token as string);
	// 3. verify and log errors
	if (!allProjects.ok) {
		return {
			ok: false,
			message: allProjects.message,
		};
	}

	// 4. return the data
	return {
		ok: true,
		message: allProjects.message,
		data: allProjects.data,
	};
}

export async function getProjectTask(projectId: string): Promise<FetchResult> {
	// 1. Verify session
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 2. fetch the data
	const ProjectTask = await ProjectService.getProjectTask(
		session.token as string,
		projectId,
	);
	// 3. verify and log errors
	if (!ProjectTask.ok) {
		return {
			ok: false,
			message: ProjectTask.message,
		};
	}

	// 4. return the data
	return {
		ok: true,
		message: ProjectTask.message,
		data: ProjectTask.data,
	};
}

/***************************************************************
 * POST/PUT ACTIONS (avec formulaire)
 ****************************************************************
 */
export async function createProject(
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

	const formObject = formDataToObject(formData, ["contributors"]);
	const validatedFields = CreateProjectSchema.safeParse(formObject);
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	// 3. Insert the user into the database or call an Library API
	const response = await ProjectService.createProject(
		session.token as string,
		validatedFields.data,
	);
	// 4. verify and log errors
	// Si succès : ajouter shouldClose et data
	if (response.ok) {
		revalidateTag("projects", "max");
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data.project,
		};
	}

	// Si erreur API
	return apiErrorToState(response);
}

export async function updateProject(
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
	const formObject = formDataToObject(formData, ["contributors"]);
	const validatedFields = UpdateProjectSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await ProjectService.updateProject(
		session.token as string,
		projectId,
		validatedFields.data,
	);
	if (response.ok) {
		revalidateTag("projects", "max");
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data,
		};
	}
	return {
		ok: false,
		status: response.status,
		message: response.message,
		apiValidationError: response.validationError,
	};
}
