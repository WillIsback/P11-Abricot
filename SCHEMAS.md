# Architecture des Schémas

## 📁 Structure

```
src/schemas/
├── index.ts              # Barrel export (ré-exporte tout)
├── base.schema.ts        # Base schemas, utilities, generics
├── auth.schema.ts        # Authentication (login, register)
├── user.schema.ts        # User profile management
├── project.schema.ts     # Projects management
├── task.schema.ts        # Tasks management
└── comment.schema.ts     # Comments on tasks
```

## 🎯 Principes de conception

Chaque fichier de schéma suit ce pattern :

```
1. REQUÊTES (Validation des données envoyées au backend)
   - CreateProjectSchema
   - UpdateProjectSchema
   - AddContributorSchema
   - Types: CreateProject, UpdateProject, etc.

2. RÉPONSES (Typage des données du backend)
   - ProjectResponseSchema
   - CreateProjectResponseSchema
   - GetProjectsResponseSchema
   - Types: ProjectResponse, CreateProjectResponse, etc.
```

## 📝 Utilisation

### 1. Valider des données en entrée

```typescript
import { CreateTaskSchema, type CreateTask } from "@/schemas";

const handleSubmit = async (formData: CreateTask) => {
  try {
    // Valide + sanitize automatiquement
    const validated = CreateTaskSchema.parse(formData);
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(validated),
    });
  } catch (error) {
    // Erreurs de validation Zod
    console.error(error.errors);
  }
};
```

### 2. Typer et valider les réponses API

```typescript
import { CreateTaskResponseSchema, type CreateTaskResponse } from "@/schemas";

const createTask = async (data: CreateTask): Promise<CreateTaskResponse> => {
  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await response.json();

  // Valide ET type la réponse
  const result = CreateTaskResponseSchema.parse(json);

  return result;
};
```

### 3. Utiliser les types inférés de Zod

```typescript
import { CreateTaskSchema, type CreateTask } from "@/schemas";

// Type CreateTask = {
//   title: string;
//   description?: string;
//   priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
//   dueDate?: string;
//   assigneeIds?: string[];
// }

const task: CreateTask = {
  title: "My task",
  priority: "HIGH",
};
```

## 🔄 Endpoints et leurs schémas

### Auth

| Endpoint         | Method | Requête              | Réponse                      |
| ---------------- | ------ | -------------------- | ---------------------------- |
| `/auth/register` | POST   | RegisterSchema       | RegisterResponseSchema       |
| `/auth/login`    | POST   | LoginSchema          | LoginResponseSchema          |
| `/auth/profile`  | GET    | -                    | GetProfileResponseSchema     |
| `/auth/profile`  | PUT    | UpdateProfileSchema  | UpdateProfileResponseSchema  |
| `/auth/password` | PUT    | UpdatePasswordSchema | UpdatePasswordResponseSchema |
| `/users/search`  | GET    | query params         | SearchUsersResponseSchema    |

### Projects

| Endpoint                             | Method | Requête              | Réponse                         |
| ------------------------------------ | ------ | -------------------- | ------------------------------- |
| `/projects`                          | POST   | CreateProjectSchema  | CreateProjectResponseSchema     |
| `/projects`                          | GET    | -                    | GetProjectsResponseSchema       |
| `/projects/:id`                      | GET    | -                    | GetProjectResponseSchema        |
| `/projects/:id`                      | PUT    | UpdateProjectSchema  | UpdateProjectResponseSchema     |
| `/projects/:id`                      | DELETE | -                    | DeleteProjectResponseSchema     |
| `/projects/:id/contributors`         | POST   | AddContributorSchema | ContributorActionResponseSchema |
| `/projects/:id/contributors/:userId` | DELETE | -                    | ContributorActionResponseSchema |

### Tasks

| Endpoint                             | Method | Requête          | Réponse                  |
| ------------------------------------ | ------ | ---------------- | ------------------------ |
| `/projects/:projectId/tasks`         | POST   | CreateTaskSchema | CreateTaskResponseSchema |
| `/projects/:projectId/tasks`         | GET    | -                | GetTasksResponseSchema   |
| `/projects/:projectId/tasks/:taskId` | GET    | -                | GetTaskResponseSchema    |
| `/projects/:projectId/tasks/:taskId` | PUT    | UpdateTaskSchema | UpdateTaskResponseSchema |
| `/projects/:projectId/tasks/:taskId` | DELETE | -                | DeleteTaskResponseSchema |

### Comments

| Endpoint                                                 | Method | Requête             | Réponse                     |
| -------------------------------------------------------- | ------ | ------------------- | --------------------------- |
| `/projects/:projectId/tasks/:taskId/comments`            | POST   | CreateCommentSchema | CreateCommentResponseSchema |
| `/projects/:projectId/tasks/:taskId/comments/:commentId` | PUT    | UpdateCommentSchema | UpdateCommentResponseSchema |
| `/projects/:projectId/tasks/:taskId/comments/:commentId` | DELETE | -                   | DeleteCommentResponseSchema |

## 🛠️ Utilitaires

### Sanitization (from `src/lib/utils`)

```typescript
import { sanitizeString, sanitizeRichText } from "@/lib/utils";

const cleanText = sanitizeString("  <script>alert('xss')</script>hello  ");
// Result: "hello"

const richText = sanitizeRichText("<p><b>Bold</b> text with <img> bad tag</p>");
// Result: "<p><b>Bold</b> text with  bad tag</p>"
```

### Base schemas (from `src/schemas/base.schema`)

```typescript
import {
  emailSchema,
  passwordSchema,
  idSchema,
  createBackendResponse,
} from "@/schemas";

// Compose des schémas existants
const MySchema = z.object({
  email: emailSchema,
  userId: idSchema,
  newPassword: passwordSchema,
});

// Créer des réponses typées rapidement
const MyResponseSchema = createBackendResponse(
  z.object({ success: z.boolean() }),
);
```

## ✅ Best Practices

### ✔️ À faire

```typescript
// ✅ Valider les données du backend
const data = LoginResponseSchema.parse(apiResponse);

// ✅ Utiliser les types inférés
const task: CreateTask = { title: "...", priority: "HIGH" };

// ✅ Capturer les erreurs de validation
try {
  CreateTaskSchema.parse(userData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors);
  }
}

// ✅ Composer les schémas
const CompleteResponseSchema = createBackendResponse(TaskResponseSchema);
```

### ❌ À ne pas faire

```typescript
// ❌ Utiliser `any` ou `unknown` sans validation
const data: any = await response.json();

// ❌ Valider sans typer
CreateTaskSchema.parse(data);

// ❌ Ignorer les erreurs de validation
CreateTaskSchema.parse(userData); // Peut lever une exception
```

## 🔗 Références

- [Zod Documentation](https://zod.dev)
- [Backend Swagger API](http://localhost:8000/api-docs)
