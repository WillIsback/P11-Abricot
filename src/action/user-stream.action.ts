"use server";

import { verifySession } from "@/lib/dal.lib";
import { userService } from "@/service/user.service";

/**
 * Recherche des utilisateurs en temps réel pour l'autocomplétion.
 *
 * @remarks
 * Cette Server Action est optimisée pour être utilisée avec useTransition.
 * Elle effectue une recherche d'utilisateurs avec un minimum de 2 caractères.
 *
 * @param query - La chaîne de recherche (minimum 2 caractères).
 * @returns Un tableau d'utilisateurs correspondants ou null en cas d'erreur/session invalide.
 */
export async function searchUserStream(query: string) {
	const session = await verifySession();

	if (!session.isAuth || !session.token) {
		return null;
	}

	// Valider query minimum
	if (!query || query.trim().length < 2) {
		return null;
	}

	try {
		const response = await userService.getUsersSearch(
			session.token as string,
			query,
		);
		if (response.ok && response.data) {
			return response.data.users;
		}

		return null;
	} catch (error) {
		console.error("Error searching users:", error);
		return null;
	}
}
