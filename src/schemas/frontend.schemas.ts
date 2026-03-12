import * as z from "zod";

/**
 * Schéma de validation pour le formulaire d'inscription.
 *
 * @remarks
 * Valide le prénom, le nom, l'email et le mot de passe.
 * Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.
 */
const SignupFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { error: "firstName must be at least 2 characters long." })
		.trim(),
	lastName: z
		.string()
		.min(2, { error: "lastName must be at least 2 characters long." })
		.trim(),
	email: z.email({ error: "Please enter a valid email." }).trim(),
	password: z
		.string()
		.min(8, { error: "Be at least 8 characters long" })
		.regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
		.regex(/[0-9]/, { error: "Contain at least one number." })
		.trim(),
});

/**
 * Schéma de validation pour le formulaire de connexion.
 */
const LoginFormSchema = z.object({
	email: z.email({ error: "Please enter a valid email." }).trim(),
	password: z.string().trim(),
});

/**
 * Schéma de validation pour la création d'une tâche.
 *
 * @remarks
 * Le statut par défaut est `TODO` et la priorité par défaut est `MEDIUM` si non précisés.
 */
const CreateTaskSchema = z.object({
	title: z
		.string()
		.min(2, { error: "title must be at least 2 characters long." }),
	description: z
		.string()
		.min(2, { error: "description must be at least 2 characters long." }),
	dueDate: z.iso.datetime(),
	assigneeIds: z.array(z.string()).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
	status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
});

/**
 * Schéma de validation pour la mise à jour d'une tâche.
 *
 * @remarks
 * Tous les champs sont optionnels pour permettre des mises à jour partielles.
 */
const UpdateTaskSchema = z.object({
	title: z
		.string()
		.min(2, { error: "title must be at least 2 characters long." })
		.optional(),
	description: z
		.string()
		.min(2, { error: "description must be at least 2 characters long." })
		.optional(),
	dueDate: z.iso.datetime().optional(),
	assigneeIds: z.array(z.string()).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
	status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
});

/**
 * Schéma de validation pour la mise à jour du profil utilisateur.
 *
 * @remarks
 * Tous les champs sont optionnels pour permettre des mises à jour partielles.
 * Ne permet pas la mise à jour du mot de passe (utiliser `UpdatePasswordSchema`).
 */
const UpdateProfileSchema = z.object({
	firstName: z
		.string()
		.min(2, { error: "firstName must be at least 2 characters long." })
		.trim()
		.optional(),
	lastName: z
		.string()
		.min(2, { error: "lastName must be at least 2 characters long." })
		.trim()
		.optional(),
	email: z.email({ error: "Please enter a valid email." }).trim().optional(),
});

/**
 * Schéma de validation pour la mise à jour du mot de passe.
 *
 * @remarks
 * Le nouveau mot de passe doit contenir au moins 8 caractères,
 * une minuscule, une majuscule et un chiffre.
 */
const UpdatePasswordSchema = z.object({
	currentPassword: z.string().trim(),
	newPassword: z
		.string()
		.min(8, { error: "Be at least 8 characters long" })
		.regex(/[a-z]/, { error: "Contain at least one lowercase letter." })
		.regex(/[A-Z]/, { error: "Contain at least one uppercase letter." })
		.regex(/[0-9]/, { error: "Contain at least one number." })
		.trim(),
});

/**
 * Schéma de validation pour la création d'un projet.
 */
const CreateProjectSchema = z.object({
	name: z
		.string()
		.min(2, { error: "Project name must be at least 2 characters long." }),
	description: z
		.string()
		.min(2, { error: "description name must be at least 2 characters long." }),
	contributors: z.array(z.email()).optional(), // Array d'emails des contributeurs
});

/**
 * Schéma de validation pour la mise à jour d'un projet.
 *
 * @remarks
 * Tous les champs sont optionnels pour permettre des mises à jour partielles.
 */
const UpdateProjectSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	contributors: z.array(z.email()).optional(),
});

/**
 * Schéma de validation pour l'ajout d'un contributeur à un projet.
 */
const AddContributorSchema = z.object({
	email: z.email({ error: "Please enter a valid email." }).trim(),
	role: z.enum(["ADMIN", "CONTRIBUTOR"]).optional(),
});

/**
 * Schéma de validation pour la suppression d'un contributeur d'un projet.
 */
const RemoveContributorSchema = z.object({
	userId: z.string(),
});

/**
 * Schéma de validation pour la création d'un commentaire.
 */
const CreateCommentSchema = z.object({
	content: z.string(),
});

/**
 * Schéma de validation pour la mise à jour d'un commentaire.
 */
const UpdateCommentSchema = z.object({
	content: z.string(),
});

/**
 * Schéma de validation pour la recherche d'utilisateurs.
 *
 * @remarks
 * La requête doit contenir au moins 2 caractères.
 */
const UserSearchQuerySchema = z.string().min(2);

export {
	SignupFormSchema,
	LoginFormSchema,
	CreateTaskSchema,
	UpdateTaskSchema,
	UpdateProfileSchema,
	UpdatePasswordSchema,
	CreateProjectSchema,
	UpdateProjectSchema,
	AddContributorSchema,
	RemoveContributorSchema,
	CreateCommentSchema,
	UpdateCommentSchema,
	UserSearchQuerySchema,
};
