"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal.lib";
import {
	apiErrorToState,
	type FetchResult,
	type FormActionState,
	validationErrorToState,
} from "@/lib/server.lib";
import { createSession, deleteSession } from "@/lib/session.lib";
import { sanitizeString } from "@/lib/utils";
import { LoginFormSchema, SignupFormSchema } from "@/schemas/frontend.schemas";
import { AuthService } from "@/service/auth.service";

/**
 * Déconnecte l'utilisateur en supprimant sa session et le redirige vers la page de connexion.
 *
 * @remarks
 * Cette fonction est une Server Action Next.js qui supprime le cookie de session
 * et effectue une redirection côté serveur.
 *
 * @throws Redirige automatiquement vers `/login` après suppression de la session.
 */
export async function logout() {
	await deleteSession();
	redirect("/login");
}

/**
 * Inscrit un nouvel utilisateur via le formulaire d'inscription.
 *
 * @remarks
 * Cette Server Action valide les champs du formulaire, sanitize les données,
 * appelle le service d'authentification, crée une session et redirige vers le dashboard.
 *
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant firstName, lastName, email et password.
 * @returns Un objet {@link FormActionState} contenant le statut de l'opération et les éventuelles erreurs.
 *
 * @throws Redirige automatiquement vers `/dashboard` en cas de succès.
 */
export async function signup(
	_state: FormActionState,
	formData: FormData,
): Promise<FormActionState> {
	// 1. Validate form fields
	const validatedFields = SignupFormSchema.safeParse({
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}

	// 2. Prepare data for insertion into database
	const name = `${sanitizeString(validatedFields.data.firstName)} ${sanitizeString(validatedFields.data.lastName)}`;
	const payload = {
		name: name,
		email: sanitizeString(validatedFields.data.email),
		password: sanitizeString(validatedFields.data.password),
	};
	// 3. Insert the user into the database or call an Library API

	const result = await AuthService.register(
		payload,
		sanitizeString(validatedFields.data.email),
	);

	if (!result.ok) {
		console.error("AuthService error : ", result.message);
		if (result.validationError)
			console.error("AuthService validation error : ", result.validationError);
		if (result.details)
			console.error("AuthService error details : ", result.details);
		return apiErrorToState(result);
	}

	// 4. Create user session
	const session = await createSession(result.data.user.id, result.data.token);

	console.log(session);
	// 5. Redirect user
	redirect("/dashboard");
}

/**
 * Authentifie un utilisateur via le formulaire de connexion.
 *
 * @remarks
 * Cette Server Action valide les identifiants, appelle le service d'authentification,
 * crée une session et redirige vers le dashboard.
 *
 * @param _state - L'état précédent du formulaire (requis par useActionState).
 * @param formData - Les données du formulaire contenant email et password.
 * @returns Un objet {@link FormActionState} contenant le statut de l'opération et les éventuelles erreurs.
 *
 * @throws Redirige automatiquement vers `/dashboard` en cas de succès.
 */
export async function login(
	_state: FormActionState,
	formData: FormData,
): Promise<FormActionState> {
	// 1. Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});
	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return validationErrorToState(validatedFields);
	}
	// 2. Prepare data for insertion into database
	const payload = {
		email: sanitizeString(validatedFields.data.email),
		password: sanitizeString(validatedFields.data.password),
	};
	// 3. Insert the user into the database or call an Library API

	const result = await AuthService.login(
		payload,
		sanitizeString(validatedFields.data.email),
	);

	if (!result.ok) {
		console.error("AuthService error : ", result.message);
		if (result.validationError)
			console.error("AuthService validation error : ", result.validationError);
		if (result.details)
			console.error("AuthService error details : ", result.details);
		return apiErrorToState(result);
	}
	// 4. Create user session
	const session = await createSession(result.data.user.id, result.data.token);
	console.log(session);
	// 5. Redirect user
	redirect("/dashboard");
}

/**
 * Récupère les informations du profil de l'utilisateur connecté.
 *
 * @remarks
 * Cette Server Action vérifie la session, puis récupère les données du profil
 * via le service d'authentification.
 *
 * @returns Un objet {@link FetchResult} contenant les données du profil utilisateur ou un message d'erreur.
 */
export async function profile(): Promise<FetchResult> {
	// 1. Verify session
	const session = await verifySession();
	if (!session.isAuth || !session.token) {
		return {
			ok: false,
			message: "Session not verified",
		};
	}

	// 2. fetch the data
	const profile = await AuthService.profile(session.token as string);
	// 3. verify and log errors
	if (!profile.ok) {
		return {
			ok: false,
			message: profile.message,
		};
	}

	// 4. return the data
	return {
		ok: true,
		message: profile.message,
		data: profile.data,
	};
}
