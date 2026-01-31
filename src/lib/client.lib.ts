import * as z from "zod";
import type { Task } from "@/schemas/backend.schemas";

const getInitialsFromName = (name: string): string => {
	const parts = name.trim().split(/\s+/);
	const firstNameInitial = parts[0].charAt(0).toUpperCase();
	const lastNameInitial =
		parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
	return firstNameInitial + lastNameInitial;
};

type TagColor = "gray" | "orange" | "info" | "warning" | "error" | "success";

const mapStatusColor: Record<z.infer<typeof Task>["status"], TagColor> = {
	TODO: "error",
	IN_PROGRESS: "warning",
	DONE: "success",
	CANCELED: "gray",
};
const mapStatusLabel: Record<z.infer<typeof Task>["status"], string> = {
	TODO: "À faire",
	IN_PROGRESS: "En cours",
	DONE: "Terminée",
	CANCELED: "Abandonnée",
};

const mapStatusString: Record<z.infer<typeof Task>["status"] | "ALL", string> =
	{
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
		CANCELED: "Abandonnée",
		ALL: "Tous",
	};
const isUserOwner = (userId: string, OwnerId: string): boolean => {
	return userId === OwnerId;
};

const isRequired = (schema: z.ZodObject, key: string) => {
	const field = schema.shape[key];
	// Vérifie si le champ existe et s'il n'est PAS optionnel
	return (
		field &&
		!(field instanceof z.ZodOptional) &&
		!(field instanceof z.ZodNullable)
	);
};

export {
	getInitialsFromName,
	mapStatusColor,
	mapStatusLabel,
	mapStatusString,
	isUserOwner,
	isRequired,
};
