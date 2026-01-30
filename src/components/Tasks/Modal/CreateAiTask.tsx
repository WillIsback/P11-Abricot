// src/components/Tasks/Modal/CreateAiTask.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { generateAiTask } from '@/action/mistral.action';
import { useActionState, useEffect} from 'react';
import { Task } from '@/schemas/backend.schemas';
import { Sparkle } from 'lucide-react';
import * as z from 'zod';
import IAButton from "@/components/ui/IAButton";
import TaskAI from '../TaskAi';
const tasksZodSchema = z.array(Task)
type TasksType = z.infer<typeof tasksZodSchema>

interface CreateAiTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  tasks: TasksType,
  onTaskCreated?: (task: unknown) => void;
}



export default function CreateAiTask({
  open,
  onOpenChange,
  projectId,
  tasks,
  onTaskCreated,
}: CreateAiTaskProps) {
  const boundGenerateAiTask = generateAiTask.bind(null, tasks);
  const [state, formAction, isPending] = useActionState(boundGenerateAiTask, undefined);

  // Nettoyer quand le modal se ferme
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="m-auto flex flex-col justify-between
        bg-white rounded-[10px] items-center gap-14
        w-full mt-19.75
        "
      >
        <div className="flex flex-col flex-1 gap-10">
          <DialogHeader className="flex gap-2 items-center">
            <div className="flex gap-2 items-center">
              <Sparkle className="fill-brand-dark stroke-0"/>
              <DialogTitle>Créer une tâche</DialogTitle>
            </div>
          </DialogHeader>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6 min-h-130.75 w-full">
                  {isPending ? (
                      // Skeleton de chargement
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : state?.ok ? (
                        state?.data?.tasks.map((task, index) => (
                          <TaskAI
                            key={crypto.randomUUID()}
                            title={task.title}
                            description={task.description}
                          />
                        ))) : (
                          <p></p>
                        )
                  }
                </div>
              </div>
              <form
                action={formAction}
                className="flex w-full gap-3.5 px-8 py-4.5 rounded-[80px] bg-gray-50 justify-between"
              >
                  <input
                    type="text"
                    name='prompt'
                    id="prompt"
                    placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                    className="flex-1 focus:outline-0"
                  />
                  <IAButton />
              </form>
          </div>
      </DialogContent>
    </Dialog>
  );
}