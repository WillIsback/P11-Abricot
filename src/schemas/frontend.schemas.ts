import * as z from 'zod'


const SignupFormSchema = z.object({
    firstName: z
        .string()
        .min(2, { error: 'firstName must be at least 2 characters long.' })
        .trim(),
    lastName: z
        .string()
        .min(2, { error: 'lastName must be at least 2 characters long.' })
        .trim(),
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .trim(),
})

const LoginFormSchema = z.object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim(),
})


const CreateTaskSchema = z.object({
    title: z
        .string()
        .min(2, { error: 'title must be at least 2 characters long.' }),
    description: z
        .string()
        .min(2, { error: 'description must be at least 2 characters long.' }),
    dueDate: z.iso.datetime(),
    assigneeIds: z.array(z.string()).optional(),
    priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
})

const UpdateTaskSchema = z.object({
    title: z
        .string()
        .min(2, { error: 'title must be at least 2 characters long.' })
        .optional(),
    description: z
        .string()
        .min(2, { error: 'description must be at least 2 characters long.' })
        .optional(),
    dueDate: z.iso.datetime()
        .optional(),
    assigneeIds: z.array(z.string()).optional(),
    priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
})

const UpdateProfileSchema = z.object({
    firstName: z
        .string()
        .min(2, { error: 'firstName must be at least 2 characters long.' })
        .trim()
        .optional(),
    lastName: z
        .string()
        .min(2, { error: 'lastName must be at least 2 characters long.' })
        .trim()
        .optional(),
    email: z
        .email({ error: 'Please enter a valid email.' })
        .trim()
        .optional(),
})

const UpdatePasswordSchema = z.object({
    currentPassword: z.string().trim(),
    newPassword : z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .trim(),
})


const CreateProjectSchema = z.object({
    name: z.string()
            .min(2, { error: 'Project name must be at least 2 characters long.' }),
    description: z.string()
            .min(2, { error: 'description name must be at least 2 characters long.' }),
    contributors: z.array(z.email()).optional(), // Array d'emails des contributeurs
})

const UpdateProjectSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
})

const AddContributorSchema = z.object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    role: z.enum(["ADMIN", "CONTRIBUTOR"]).optional(),
})

const RemoveContributorSchema  = z.object({
    userId: z.string(),
})


const CreateCommentSchema  = z.object({
    userId: z.string(),
})

const UpdateCommentSchema  = z.object({
    userId: z.string(),
})

const UserSearchQuerySchema = z.string().min(2)



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
    UserSearchQuerySchema
}