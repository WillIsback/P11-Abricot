"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { formDataToObject, sanitizeString } from "@/lib/utils";
import {
	UpdatePasswordSchema,
	UpdateProfileSchema,
} from "@/schemas/frontend.schemas";
import { userService } from "@/service/user.service";

export async function updateProfile(
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
	const formObject = formDataToObject(formData);

	const validatedFields = UpdateProfileSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const name = `${sanitizeString(validatedFields.data.firstName)} ${sanitizeString(validatedFields.data.lastName)}`;
	const payload = {
		name: name,
		email: sanitizeString(validatedFields.data.email),
	};
	const response = await userService.updateProfile(
		session.token as string,
		payload,
	);

	if (response.ok) {
		revalidatePath("/account");
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data,
		};
	}
	return apiErrorToState(response);
}

export async function updatePassword(
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
	const formObject = formDataToObject(formData);
	const validatedFields = UpdatePasswordSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const response = await userService.updatePassword(
		session.token as string,
		validatedFields.data,
	);
	if (response.ok) {
		revalidatePath("/account");
		return {
			ok: true,
			shouldClose: true,
			message: response.message,
			data: response.data,
		};
	}
	return apiErrorToState(response);
}
