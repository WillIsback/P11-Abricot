import * as z from "zod";
import type { Task } from "@/schemas/backend.schemas";

/**
 * Extrait les initiales d'un nom complet.
 *
 * @remarks
 * Prend la première lettre du prénom et la première lettre du dernier mot (nom de famille).
 *
 * @param name - Le nom complet de la personne.
 * @returns Les initiales en majuscules (ex: "JD" pour "Jean Dupont").
 *
 * @example
 * ```ts
 * getInitialsFromName("Jean Dupont"); // "JD"
 * getInitialsFromName("Marie"); // "M"
 * ```
 */
const getInitialsFromName = (name: string): string => {
	const parts = name.trim().split(/\s+/);
	const firstNameInitial = parts[0].charAt(0).toUpperCase();
	const lastNameInitial =
		parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
	return firstNameInitial + lastNameInitial;
};

/**
 * Couleurs de tag disponibles pour l'affichage des statuts.
 */
type TagColor = "gray" | "orange" | "info" | "warning" | "error" | "success";

/**
 * Mapping des statuts de tâche vers leurs couleurs correspondantes.
 */
const mapStatusColor: Record<z.infer<typeof Task>["status"], TagColor> = {
	TODO: "error",
	IN_PROGRESS: "warning",
	DONE: "success",
	CANCELED: "gray",
};

/**
 * Mapping des statuts de tâche vers leurs labels affichés.
 */
const mapStatusLabel: Record<z.infer<typeof Task>["status"], string> = {
	TODO: "À faire",
	IN_PROGRESS: "En cours",
	DONE: "Terminée",
	CANCELED: "Abandonnée",
};

/**
 * Mapping complet des statuts incluant l'option "ALL" pour les filtres.
 */
const mapStatusString: Record<z.infer<typeof Task>["status"] | "ALL", string> =
	{
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
		CANCELED: "Abandonnée",
		ALL: "Tous",
	};

/**
 * Vérifie si l'utilisateur est le propriétaire d'une ressource.
 *
 * @param userId - L'identifiant de l'utilisateur à vérifier.
 * @param OwnerId - L'identifiant du propriétaire de la ressource.
 * @returns `true` si l'utilisateur est le propriétaire.
 */
const isUserOwner = (userId: string, OwnerId: string): boolean => {
	return userId === OwnerId;
};

/**
 * Vérifie si l'utilisateur peut éditer/supprimer un commentaire.
 *
 * @remarks
 * Un utilisateur peut modifier un commentaire s'il en est l'auteur
 * OU s'il est le propriétaire du projet.
 *
 * @param authorId - L'identifiant de l'auteur du commentaire.
 * @param projectOwnerId - L'identifiant du propriétaire du projet.
 * @param currentUserId - L'identifiant de l'utilisateur courant.
 * @returns `true` si l'utilisateur est l'auteur OU le propriétaire du projet.
 */
const canEditComment = (
	authorId: string,
	projectOwnerId: string,
	currentUserId: string,
): boolean => {
	return authorId === currentUserId || projectOwnerId === currentUserId;
};

/**
 * Vérifie si un champ d'un schéma Zod est requis (non optionnel).
 *
 * @remarks
 * Utile pour déterminer dynamiquement si un champ de formulaire
 * doit afficher un indicateur de champ obligatoire.
 *
 * @param schema - Le schéma Zod contenant le champ.
 * @param key - Le nom du champ à vérifier.
 * @returns `true` si le champ existe et n'est ni optionnel ni nullable.
 */
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
	canEditComment,
	isRequired,
};
