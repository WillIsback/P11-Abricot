"use server";

import { verifySession } from "@/lib/dal.lib";
import { userService } from "@/service/user.service";

// Server Action simple (compatible avec useTransition)
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
