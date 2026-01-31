import { type ClassValue, clsx } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { Project, Task, User } from "@/schemas/backend.schemas";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// ============================================
// UTILITAIRES DE SANITIZATION
// ============================================

/**
 * Nettoie et valide une chaîne de texte
 * - Supprime les espaces inutiles
 * - Nettoie les caractères HTML dangereux
 */
export const sanitizeString = (value: string | undefined): string => {
	if (typeof value !== "string") return "";
	return DOMPurify.sanitize(value);
};

/**
 * Nettoie et sécurise un prompt utilisateur pour l'envoi à un LLM.
 */
export const sanitizeUserPrompt = (
	value: string,
	maxLength: number = 4000,
): string => {
	if (typeof value !== "string") return "";
	// 1. Suppression totale du HTML
	// On utilise DOMPurify pour retirer toutes les balises et ne garder que le texte brut.
	let clean = DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [], // Aucune balise autorisée
		ALLOWED_ATTR: [], // Aucun attribut
		KEEP_CONTENT: true, // On garde le texte à l'intérieur des balises
	});
	const injectionPatterns =
		/(\[INST\]|\[\/INST\]|<<SYS>>|<\/s>|### Instruction|### User)/gi;
	clean = clean.replace(injectionPatterns, "");
	clean = clean.replace(/\s+/g, " ").trim();
	if (clean.length > maxLength) {
		clean = clean.substring(0, maxLength);
	}
	return clean;
};

// ============================================
// LOGGER CENTRALISÉ (usage simple)
// ============================================
// Utilise console.* mais centralise pour pouvoir plugger un provider plus tard.

type LogLevel = "debug" | "info" | "warn" | "error";

const logFn: Record<LogLevel, (...args: unknown[]) => void> = {
	debug: (...args) => console.debug("[DEBUG]", ...args),
	info: (...args) => console.info("[INFO]", ...args),
	warn: (...args) => console.warn("[WARN]", ...args),
	error: (...args) => console.error("[ERROR]", ...args),
};

export const logger = {
	debug: (...args: unknown[]) => logFn.debug(...args),
	info: (...args: unknown[]) => logFn.info(...args),
	warn: (...args: unknown[]) => logFn.warn(...args),
	error: (...args: unknown[]) => logFn.error(...args),
};

export const formDataToObject = (
	formData: FormData,
	arrayFields?: string[],
) => {
	const result: Record<string, unknown> = {};
	const keys = Array.from(formData.keys());

	for (const key of keys) {
		const values = formData.getAll(key);
		let value = values.length === 1 ? values[0] : values;

		// Si c'est un champ à transformer en array (toujours, pas juste avec virgules)
		if (arrayFields?.includes(key) && typeof value === "string") {
			// Split par virgule, trim les items, et filter les strings vides
			value = value
				.split(",")
				.map((item) => item.trim())
				.filter((item) => item.length > 0);
		}
		if (typeof value === "string" && value.trim() === "") {
			result[key] = undefined;
		} else {
			result[key] = value;
		}
	}
	return result;
};

interface UserType {
	user: z.infer<typeof User>;
}
const UserSchema = z.object({
	user: User,
});
export const isUser = (user: unknown): user is UserType => {
	return UserSchema.safeParse(user).success;
};

type TasksType = z.infer<typeof TasksSchema>;
const TasksSchema = z.object({
	tasks: z.array(Task),
});
export const isTasks = (tasks: unknown): tasks is TasksType => {
	return TasksSchema.safeParse(tasks).success;
};

type ProjectsType = z.infer<typeof ProjectSchema>;
const ProjectSchema = z.object({
	projects: z.array(Project),
});
export const isProjects = (projects: unknown): projects is ProjectsType => {
	return ProjectSchema.safeParse(projects).success;
};



/**
 * Génère un nom complet à partir du nom actuel et des modifications partielles.
 * Gère les noms composés (ex: "Jean Pierre Dupont" → prénom: "Jean", nom: "Pierre Dupont")
 */
export const generateName = (
	currentName: string,
	firstName: string | undefined,
	lastName: string | undefined,
): string => {
	// Normalise les espaces multiples et trim
	const parts = currentName.trim().split(/\s+/);
	const currentFirstName = parts[0] || "";
	// Tout sauf le premier mot = nom de famille (gère les noms composés)
	const currentLastName = parts.slice(1).join(" ") || "";

	const newFirstName = firstName?.trim() || currentFirstName;
	const newLastName = lastName?.trim() || currentLastName;

	return `${newFirstName} ${newLastName}`.trim();
}