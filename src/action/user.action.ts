"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { formDataToObject, generateName, sanitizeString } from "@/lib/utils";
import {
	UpdatePasswordSchema,
	UpdateProfileSchema,
} from "@/schemas/frontend.schemas";
import { userService } from "@/service/user.service";

/**
 * Met à jour le profil de l'utilisateur connecté via le formulaire.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, génère le nom complet
 * à partir des prénom/nom, appelle le service utilisateur et revalide le cache.
 *
 * @param userName - Le nom actuel de l'utilisateur (pour gérer les modifications partielles).
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant les informations modifiées.
 * @returns Un objet {@link FormActionState} contenant le profil mis à jour ou les erreurs.
 */
export async function updateProfile(
	userName: string,
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
	console.log("formObject", formObject);
	const validatedFields = UpdateProfileSchema.safeParse(formObject);
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	const name = generateName(
		userName,
		validatedFields.data.firstName,
		validatedFields.data.lastName,
	);
	const payload = {
		name: name,
		email: validatedFields.data.email
			? sanitizeString(validatedFields.data.email)
			: undefined,
	};
	console.log("payload", payload);
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

/**
 * Met à jour le mot de passe de l'utilisateur connecté via le formulaire.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire,
 * appelle le service utilisateur et revalide le cache.
 *
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant l'ancien et le nouveau mot de passe.
 * @returns Un objet {@link FormActionState} contenant le statut de l'opération ou les erreurs.
 */
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
