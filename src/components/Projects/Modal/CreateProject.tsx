// src/components/Projects/Modal/CreateProject.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { createProject } from '@/action/project.action';
import { useActionState, useEffect, useState, useRef } from 'react';
import { CreateProjectSchema } from "@/schemas/frontend.schemas";
import { AlertCircle } from 'lucide-react';

interface CreateProjectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: unknown) => void;
}

export default function CreateProject({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectProps) {
  const [state, action, pending] = useActionState(createProject, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Fonction de réinitialisation du formulaire
  const resetForm = () => {
    setFieldErrors({});
    setTouchedFields(new Set());
    setIsFormValid(false);
    formRef.current?.reset();
  };

  useEffect(() => {
    if (state?.ok && state?.shouldClose) {
      onProjectCreated?.(state.data);
      onOpenChange(false);
    }
    if (state?.formValidationError || state?.apiValidationError) {
      console.error('Erreurs de validation:', state?.message);
    }
  }, [state?.shouldClose, state?.data, onProjectCreated, onOpenChange, state?.ok, state?.formValidationError, state?.apiValidationError, state?.message]);

  // Nettoyer quand le modal se ferme
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const validateForm = (fieldName?: string) => {
    // Marquer le champ comme touché
    if (fieldName) {
      setTouchedFields(prev => new Set(prev).add(fieldName));
    }

    const formData = new FormData(formRef.current!);
    
    // Parser les contributeurs : split la string en array
    const contributorsString = formData.get('contributors') as string;
    const contributors = contributorsString && contributorsString.trim() 
      ? contributorsString.split(',').map(email => email.trim())
      : [];
    
    const result = CreateProjectSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      contributors: contributors,
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
          <DialogTitle>Créer un projet</DialogTitle>
        </DialogHeader>


        {!state?.ok && !state?.formValidationError && state?.message && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-red-700 font-medium text-sm">Erreur</p>
              <p className="text-red-600 text-sm">{state.message}</p>
            </div>
          </div>
        )}

        <form
          action={action}
          className="flex flex-col gap-6"
          onChange={handleFormChange}
          ref={formRef}
        >
          {/* Titre */}
          <CustomInput
            label="Titre*"
            type="text"
            inputID="name"
            required={true}
            error={getFieldError('name')}
          />
          {/* Description */}
          <CustomInput
            label="Description*"
            type="text"
            inputID="description"
            required={true}
            error={getFieldError('description')}
          />
          {/* Contributeurs */}
          <CustomInput
            label="Contributeurs"
            type="Contributor"
            inputID="contributors"
            onValueChange={handleCustomFieldChange('contributors')}
            error={getFieldError('contributors')}
          />
          <DialogFooter className="gap-2 w-61 flex justify-start">
            <CustomButton
              label='Ajouter un projet'
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