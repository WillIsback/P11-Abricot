// src/components/Tasks/Modal/CreateTask.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { createTask } from '@/action/task.action';
import { useActionState, useEffect } from 'react';
import DatePicker from '@/components/ui/DatePicker';

interface CreateTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTaskCreated?: (task: any) => void;
}

export default function CreateTask({
  open,
  onOpenChange,
  projectId,
  onTaskCreated,
}: CreateTaskProps) {
  const boundCreateTask = createTask.bind(null, projectId);
  const [state, action, pending] = useActionState(boundCreateTask, undefined);

  useEffect(() => {
    if (state?.ok && state?.shouldClose) {
      onTaskCreated?.(state.data);
      onOpenChange(false);
    }
  }, [state?.shouldClose, state?.data, onTaskCreated, onOpenChange]);

  if (state?.formValidationError || state?.apiValidationError) {
    console.error('Erreurs de validation:', state?.message);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          <DialogDescription>
            Ajoutez une tâche à votre projet. Remplissez au minimum le titre.
          </DialogDescription>
        </DialogHeader>


        {!state?.ok && !state?.formValidationError && state?.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}

        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />

          <div className="space-y-4">
            {/* Titre */}
            <div>
              <CustomInput
                label="Titre"
                type="text"
                inputID="title"
              />
            </div>
            <div>
              <CustomInput
                label="Description"
                type="text"
                inputID="description"
              />
            </div>
            {/* Date d'échéance */}
            <DatePicker />

            <input type="hidden" name="status" value="TODO" />
          </div>

          <DialogFooter className="gap-2">
            <CustomButton
              onClick={() => onOpenChange(false)}
              label="Annuler"
              pending={false}
              disabled={pending}
              buttonType="button"
            />
            <CustomButton
              label={pending ? 'Création...' : 'Créer la tâche'}
              pending={pending}
              disabled={pending}
              buttonType="submit"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}