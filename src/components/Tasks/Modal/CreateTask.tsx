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
import { useActionState, useEffect, useState, useRef } from 'react';
import Tags from '@/components/ui/Tags';
import { mapStatusLabel, mapStatusColor } from '@/lib/client.lib';
import { CreateTaskSchema } from "@/schemas/frontend.schemas";

enum Status {
  'TODO'='TODO',
  'IN_PROGRESS'='IN_PROGRESS',
  'DONE'='DONE'
}


interface CreateTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onTaskCreated?: (task: unknown) => void;
}



export default function CreateTask({
  open,
  onOpenChange,
  projectId,
  onTaskCreated,
}: CreateTaskProps) {
  const boundCreateTask = createTask.bind(null, projectId);
  const [state, action, pending] = useActionState(boundCreateTask, undefined);
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.TODO)
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const status : Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE]

  // Fonction de réinitialisation du formulaire
  const resetForm = () => {
    setFieldErrors({});
    setTouchedFields(new Set());
    setIsFormValid(false);
    setSelectedStatus(Status.TODO);
    formRef.current?.reset();
  };

  useEffect(() => {
    if (state?.ok && state?.shouldClose) {
      onTaskCreated?.(state.data);
      onOpenChange(false);
    }
    if (state?.formValidationError || state?.apiValidationError) {
      console.error('Erreurs de validation:', state?.message);
    }
  }, [state?.shouldClose, state?.data, onTaskCreated, onOpenChange, state?.ok, state?.formValidationError, state?.apiValidationError, state?.message]);

  // Nettoyer quand le modal se ferme
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };



  const handleStatusSelection = (newStatus: Status) => {
    console.log("Bouton cliqué :", newStatus); 
    setSelectedStatus(newStatus);
  }

  const validateForm = (fieldName?: string) => {
    // Marquer le champ comme touché
    if (fieldName) {
      setTouchedFields(prev => new Set(prev).add(fieldName));
    }
    
    const formData = new FormData(formRef.current!);
    const result = CreateTaskSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      assignees: formData.get('assignees'),
      status: formData.get('status'),
      priority: formData.get('priority'),
    });
    
    if (!result.success) {
      // Transformer les erreurs Zod en objet { champ: message }
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
    } else {
      setFieldErrors({});  // Pas d'erreurs
    }
    
    setIsFormValid(result.success);
  };
  
  // Handler pour onChange du formulaire - détecte le champ modifié
  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const fieldName = target.name;
    const value = target.value;
    
    if (fieldName) {
      // Si le champ est vidé, on efface l'erreur et on retire des touchedFields
      if (!value || value === '') {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        setTouchedFields(prev => {
          const newTouched = new Set(prev);
          newTouched.delete(fieldName);
          return newTouched;
        });
      } else {
        validateForm(fieldName);
      }
    }
  };
  
  // Handler pour les composants custom (DatePicker, Combobox)
  const handleCustomFieldChange = (fieldName: string) => () => {
    setTimeout(() => validateForm(fieldName), 0);
  };
  
  // Helper pour n'afficher l'erreur que si le champ a été touché
  const getFieldError = (fieldName: string) => {
    return touchedFields.has(fieldName) ? fieldErrors[fieldName] : undefined;
  };


  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col gap-10 sm:max-w-149.5 px-18.25 py-19.75">
        <DialogHeader>
          <DialogTitle>Créer une tâche</DialogTitle>
          <DialogDescription>
            Ajoutez une tâche à votre projet. Remplissez au minimum le titre.
          </DialogDescription>
        </DialogHeader>


        {!state?.ok && !state?.formValidationError && state?.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}

        <form 
          action={action} 
          className="flex flex-col gap-6"
          onChange={handleFormChange}
          ref={formRef}
        >
          <input type="hidden" name="projectId" value={projectId} />
          {/* Titre */}
          <CustomInput
            label="Titre*"
            type="text"
            inputID="title"
            required={true}
            error={getFieldError('title')}
          />
          {/* Description */}
          <CustomInput
            label="Description*"
            type="text"
            inputID="description"
            required={true}
            error={getFieldError('description')}
          />
          {/* Date d'échéance */}
          <CustomInput
            label="Echéance*"
            type="DatePicker"
            inputID="dueDate"
            required={true}
            onValueChange={handleCustomFieldChange('dueDate')}
            error={getFieldError('dueDate')}
          />
          {/* Assignees */}
          <CustomInput
            label="Assigné à:"
            type="Assignee"
            inputID="assignees"
            onValueChange={handleCustomFieldChange('assignees')}
            error={getFieldError('assignees')}
          />
           {/* Priority */}
          <CustomInput
            label="Priorité :"
            type="Priority"
            inputID="priority"
            onValueChange={handleCustomFieldChange('priority')}
            error={getFieldError('priority')}
          />
          {/* Status */}
          <div className='flex flex-col gap-4'>
            <p className='body-s'>Statut :</p>
            <>
            <input 
              type="hidden" 
              name='status'
              value={selectedStatus}
            />
            <div className='flex gap-2'>
            {
              status.map((s)=>{
                const isSelected = selectedStatus === s;
                return (
                  <button
                    key={s}
                    type='button'
                    onClick={() => handleStatusSelection(s)}
                    className={`cursor-pointer rounded p-1 transition-all ${
                      isSelected ? 'ring-2 ring-offset-1 ring-blue-500 bg-gray-50 rounded-2xl' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Tags 
                      label={mapStatusLabel[s]}
                      color={mapStatusColor[s]}
                    />
                  </button>
                )
              })
            }
            </div>
            </>
          </div>

          <DialogFooter className="gap-2 w-61 flex justify-start">
            <CustomButton
              label='+ Ajouter une tâche'
              pending={pending}
              disabled={!isFormValid}
              buttonType="submit"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}