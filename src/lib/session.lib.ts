import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import * as z from "zod";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Schéma Zod pour la validation du payload de session.
 */
const SchemaSessionPayload = z.object({
	userId: z.string(),
	token: z.string(),
	role: z.enum(["ADMIN", "USER"]).default("USER"),
	expiresAt: z.date().optional(),
});

/**
 * Type représentant le payload d'une session utilisateur.
 */
type SessionPayload = z.infer<typeof SchemaSessionPayload>;

/**
 * Type représentant une création de session réussie.
 */
type SessionSuccess = { ok: true; token: string; expiresAt: Date };

/**
 * Type représentant un échec de création de session.
 */
type SessionFailure = {
	ok: false;
	status: number;
	message: string;
	validationError: z.ZodError;
};

/**
 * Chiffre un payload de session en JWT.
 *
 * @remarks
 * Utilise l'algorithme HS256 et jose pour la signature JWT.
 * Le token expire après 7 jours par défaut si aucune date n'est spécifiée.
 *
 * @param payload - Les données de session à chiffrer.
 * @returns Un objet {@link SessionSuccess} avec le token ou {@link SessionFailure} en cas d'erreur.
 */
export async function encrypt(
	payload: SessionPayload,
): Promise<SessionSuccess | SessionFailure> {
	const result = SchemaSessionPayload.safeParse(payload);
	if (!result.success) {
		return {
			ok: false,
			status: 400,
			message: "Invalid payload",
			validationError: result.error,
		};
	}

	const expiresAt =
		result.data.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const jwt = await new SignJWT({
		userId: result.data.userId,
		token: result.data.token,
		role: result.data.role,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
		.sign(encodedKey);

	return { ok: true, token: jwt, expiresAt };
}

/**
 * Déchiffre un token JWT de session.
 *
 * @remarks
 * Vérifie la signature et l'expiration du token.
 * Retourne null si le token est invalide ou expiré.
 *
 * @param session - Le token JWT à déchiffrer (optionnel).
 * @returns Le payload déchiffré ou null si invalide.
 */
export async function decrypt(session: string | undefined = "") {
	if (!session) {
		return null;
	}
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		console.error("Failed to verify session", error);
		return null;
	}
}

/**
 * Crée une nouvelle session utilisateur et stocke le cookie.
 *
 * @remarks
 * Génère un JWT, le stocke dans un cookie HTTP-only sécurisé
 * avec une expiration de 7 jours.
 *
 * @param userId - L'identifiant unique de l'utilisateur.
 * @param token - Le token d'authentification de l'API backend.
 * @param role - Le rôle de l'utilisateur (default: "USER").
 * @returns Un objet {@link SessionSuccess} ou {@link SessionFailure}.
 */
export async function createSession(
	userId: string,
	token: string,
	role: z.infer<typeof SchemaSessionPayload.shape.role> = "USER",
): Promise<SessionSuccess | SessionFailure> {
	const session = await encrypt({ userId, token, role });
	if (!session.ok) {
		console.error("Encryptage de la session not OK");
		return session;
	}

	const cookieStore = await cookies();

	cookieStore.set("session", session.token, {
		httpOnly: true,
		secure: true,
		expires: session.expiresAt,
		sameSite: "lax",
		path: "/",
	});

	return session;
}

/**
 * Met à jour la session existante avec une nouvelle date d'expiration.
 *
 * @remarks
 * Récupère le cookie de session existant, le déchiffre,
 * et prolonge l'expiration de 7 jours.
 *
 * @returns null si la session n'existe pas ou est invalide.
 */
export async function updateSession() {
	const session = (await cookies()).get("session")?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: "lax",
		path: "/",
	});
}

/**
 * Supprime la session utilisateur en effaçant le cookie.
 *
 * @remarks
 * Utilisée lors de la déconnexion pour invalider la session côté client.
 */
export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}
