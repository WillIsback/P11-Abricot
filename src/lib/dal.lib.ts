import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { decrypt } from "@/lib/session.lib";

/**
 * Vérifie et valide la session de l'utilisateur courant.
 *
 * @remarks
 * Cette fonction est mise en cache avec React `cache()` pour éviter
 * les appels multiples dans un même cycle de rendu.
 * Redirige automatiquement vers `/login` si la session est invalide.
 *
 * @returns Un objet contenant `isAuth`, `userId` et `token` si la session est valide.
 *
 * @throws Redirige vers `/login` si la session est absente ou invalide.
 */
export const verifySession = cache(async () => {
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (!session?.userId) {
		redirect("/login");
	}
	return { isAuth: true, userId: session.userId, token: session.token };
});
