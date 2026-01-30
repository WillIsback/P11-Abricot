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
import { useActionState} from 'react';
import { Task } from '@/schemas/backend.schemas';
import { Sparkle, AlertCircle, LoaderPinwheel } from 'lucide-react';
import * as z from 'zod';
import IAButton from "@/components/ui/IAButton";
import TaskAI from '../TaskAi';
import CustomButton from '@/components/ui/CustomButton';

import { useTransition, useState } from 'react';
import { createAiTask } from '@/action/mistral.action';

const tasksZodSchema = z.array(Task)
type TasksType = z.infer<typeof tasksZodSchema>

interface CreateAiTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  tasks: TasksType,
  onTaskCreated?: (task: unknown) => void;
}

interface AiTask {
  title: string;
  description: string;
  dueDate: string;
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

  const [isAddingTasks, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(true)

  const handleClickAddTasks = (tasks : AiTask[]) => {
    tasks.forEach((task)=> {
        startTransition(async () => {
          // Convertir la date en ISO datetime avec millisecondes
          const isoDate = `${task.dueDate}T00:00:00.000Z`;

          const response = await createAiTask(
            projectId,
            task.title,
            task.description,
            isoDate,
          )
          // Gérer la réponse ici sans la retourner
          if(!response.ok) {
            console.error(response.message)
            setMessage(response?.message || 'erreur')
            setOk(false)
          } else {
            console.log('Tâche créée:', response.data)
            setMessage(`Tâche créée: ${response.data}`)
            setOk(true)

          }
        })
      })
    onOpenChange(!ok)
  }

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
          {isAddingTasks && <LoaderPinwheel/>}
            {!ok && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-red-700 font-medium text-sm">Erreur</p>
                  <p className="text-red-600 text-sm">{message}</p>
                </div>
              </div>
            )}
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
                {mockData && (
                  <CustomButton
                    label='+ Ajouter les tâches'
                    pending={isAddingTasks}
                    disabled={false}
                    buttonType='button'
                    onClick={() => handleClickAddTasks(mockData.tasks)}
                  />
                )}
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


const mockData = {
  "tasks": [
    {
      "title": "Analyse des données RAG pour le projet",
      "description": "Analyse des données pour déterminer le niveau de risque, d'achèvement et de gestion du projet en utilisant le modèle RAG.",
      "dueDate": "2026-02-15"
    },
    {
      "title": "Établir les objectifs RAG pour le projet",
      "description": "Établir les objectifs RAG pour chaque phase du projet en fonction des données collectées.",
      "dueDate": "2026-02-20"
    },
    {
      "title": "Évaluer les risques RAG pour le projet",
      "description": "Évaluer les risques associés au projet en utilisant le modèle RAG et proposer des solutions pour les réduire.",
      "dueDate": "2026-03-05"
    },
    {
      "title": "Mise en place de la stratégie RAG pour le projet",
      "description": "Mettre en place une stratégie RAG pour le projet en fonction des objectifs et des risques identifiés.",
      "dueDate": "2026-03-15"
    },
    {
      "title": "Suivi du projet RAG",
      "description": "Suivre le projet en utilisant le modèle RAG pour s'assurer que les objectifs sont atteints et que les risques sont maîtrisés.",
      "dueDate": "2026-04-01"
    }
  ]
}