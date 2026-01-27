import { createContext } from 'react';
import { Project } from '@/schemas/backend.schemas';
import * as z from "zod";

export type ProjectContextType = z.infer<typeof Project>

export const ProjectContext = createContext<ProjectContextType | null>(null)

