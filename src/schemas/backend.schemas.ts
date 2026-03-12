import * as z from "zod";

/**
 * Schéma de validation pour un utilisateur.
 *
 * @remarks
 * Représente la structure d'un utilisateur renvoyée par l'API backend.
 */
const User = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
	createdAt: z.iso.datetime({ local: true }),
	updatedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour un membre d'un projet.
 *
 * @remarks
 * Contient les informations de rôle (`OWNER`, `ADMIN`, `CONTRIBUTOR`)
 * et une référence à l'utilisateur associé.
 */
const ProjectMember = z.object({
	id: z.string(),
	role: z.enum(["OWNER", "ADMIN", "CONTRIBUTOR"]),
	user: User,
	joinedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour un projet.
 *
 * @remarks
 * Inclut les informations du propriétaire et la liste des membres du projet.
 */
const Project = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	ownerId: z.string(),
	owner: User,
	members: z.array(ProjectMember),
	createdAt: z.iso.datetime({ local: true }),
	updatedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour un assigné à une tâche.
 */
const TaskAssignee = z.object({
	id: z.string(),
	userId: z.string(),
	taskId: z.string(),
	user: User,
	assignedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour un commentaire de tâche.
 */
const Comment = z.object({
	id: z.string(),
	content: z.string(),
	taskId: z.string(),
	authorId: z.string(),
	author: User,
	createdAt: z.iso.datetime({ local: true }),
	updatedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour une tâche.
 *
 * @remarks
 * Le statut peut être `TODO`, `IN_PROGRESS`, `DONE` ou `CANCELED`.
 * La priorité peut être `LOW`, `MEDIUM`, `HIGH` ou `URGENT`.
 */
const Task = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	dueDate: z.iso.datetime({ local: true }),
	projectId: z.string(),
	creatorId: z.string(),
	assignees: z.array(TaskAssignee),
	comments: z.array(Comment),
	createdAt: z.iso.datetime({ local: true }),
	updatedAt: z.iso.datetime({ local: true }),
});

/**
 * Schéma de validation pour un projet avec ses tâches associées.
 *
 * @remarks
 * Étend le schéma `Project` en ajoutant un tableau de tâches.
 * Utilisé pour les vues détaillées d'un projet.
 */
const ProjectWithTasks = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	ownerId: z.string(),
	owner: User,
	members: z.array(ProjectMember),
	createdAt: z.iso.datetime({ local: true }),
	updatedAt: z.iso.datetime({ local: true }),
	tasks: z.array(Task),
});

/**
 * Schéma de validation pour le détail d'une erreur de validation.
 */
const Details = z.object({
	field: z.string(),
	message: z.string(),
});

/**
 * Schéma de validation pour une réponse d'erreur de l'API.
 */
const ErrorSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	error: z.optional(z.string()),
	details: z.optional(z.array(Details)),
});

/**
 * Schéma de validation pour une réponse de succès de l'API.
 */
const Success = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.unknown(),
});

export {
	User,
	Project,
	ProjectMember,
	Task,
	TaskAssignee,
	ProjectWithTasks,
	Comment,
	ErrorSchema,
	Success,
};
