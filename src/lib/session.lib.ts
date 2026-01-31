import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import * as z from "zod";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const SchemaSessionPayload = z.object({
	userId: z.string(),
	token: z.string(),
	role: z.enum(["ADMIN", "USER"]).default("USER"),
	expiresAt: z.date().optional(),
});

type SessionPayload = z.infer<typeof SchemaSessionPayload>;

type SessionSuccess = { ok: true; token: string; expiresAt: Date };
type SessionFailure = {
	ok: false;
	status: number;
	message: string;
	validationError: z.ZodError;
};

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
		console.log("Failed to verify session", error);
		return null;
	}
}

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

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}
