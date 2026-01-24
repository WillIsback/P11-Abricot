import * as z from "zod";

const User = z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    createdAt: z.iso.datetime({local : true}),
    updatedAt: z.iso.datetime({local : true}),
})

const ProjectMember = z.object({
    id: z.string(),
    role: z.enum(['OWNER', 'ADMIN', 'CONTRIBUTOR']),
    user: User,
    joinedAt: z.iso.datetime({local : true}),
})

const Project = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    ownerId: z.string(),
    owner: User,
    member: ProjectMember,
    createdAt: z.iso.datetime({local : true}),
    updatedAt: z.iso.datetime({local : true}),
})

const TaskAssignee = z.object({
    id: z.string(),
    userId: z.string(),
    taskId: z.string(),
    user: User,
    assignedAt: z.iso.datetime({local: true}),
})

const Comment = z.object({
    id: z.string(),
    content: z.string(),
    taskId: z.string(),
    authorId: z.string(),
    author: User,
    createdAt: z.iso.datetime({local : true}),
    updatedAt: z.iso.datetime({local : true}),
})

const Task = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED']),
    priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']),
    dueDate: z.iso.datetime({local: true}),
    projectId: z.string(),
    creatorId: z.string(),
    assignees: TaskAssignee,
    comments: Comment,
    createdAt: z.iso.datetime({local : true}),
    updatedAt: z.iso.datetime({local : true}),
})

const Details = z.object({
    field: z.string(),
    message: z.string(),
})

const Error = z.object({
    success: z.boolean(),
    message: z.string(),
    error: z.string(),
    details: z.array(Details),
})

const Success = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.unknown(),
})

export { User, Project, ProjectMember, Task, TaskAssignee, Comment, Error, Success }