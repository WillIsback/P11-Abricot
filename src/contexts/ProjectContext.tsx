import { createContext } from "react";
import type * as z from "zod";
import type { Project } from "@/schemas/backend.schemas";

/**
 * Type du contexte projet dérivé du schéma Zod.
 */
export type ProjectContextType = z.infer<typeof Project>;

/**
 * Contexte React pour partager les données du projet courant.
 *
 * @remarks
 * Utilisé avec `ProjectProvider` pour fournir les données du projet
 * à tous les composants enfants. Accédé via le hook `useProject()`.
 */
export const ProjectContext = createContext<ProjectContextType | null>(null);
