import { createContext } from "react";
import type * as z from "zod";
import type { Project } from "@/schemas/backend.schemas";

export type ProjectContextType = z.infer<typeof Project>;

export const ProjectContext = createContext<ProjectContextType | null>(null);
