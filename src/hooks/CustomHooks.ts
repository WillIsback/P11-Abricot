import  React, { useEffect, useState, useTransition, use, DependencyList } from 'react'
import { getProjectDetail } from '@/lib/dto.lib';
import { ProjectContext } from '@/contexts/ProjectContext'
import { getAllTasks } from '@/action/dashboard.action';
import { formDataToObject } from '@/lib/utils';
import * as z from 'zod';



/**
 * Hook générique pour les requêtes async
 * Gère loading, data et erreur simplement
 */
function useFetch<T>(
  fetchFn: () => Promise<T | null>,
  dependencies: DependencyList
): [boolean, T | null] {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await fetchFn();
        setData(result ?? null);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return [isPending, data];
}

export function useProjectName(projectId: string) {
  const [isPending, project] = useFetch(
    () => getProjectDetail(projectId),
    [projectId]
  );
  return [isPending, project?.name ?? ''] as const;
}

export function useProjectMembers(projectId: string) {
  const [isPending, project] = useFetch(
    () => getProjectDetail(projectId),
    [projectId]
  );
  return [isPending, project?.members ?? null] as const;
}

export function useTasks() {
  const [isPending, tasks] = useFetch(
    () => getAllTasks(),
    []
  );
  return [isPending, tasks ?? null] as const;
}


export function useProject() {
  const context = use(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}


/*
** Form Validation Hook
**
*/
export function useFormValidation(
  formRef: React.RefObject<HTMLFormElement | null> | null,
  formSchema: z.ZodType,
  arrayFields?: string[],

) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  if(!formRef)throw Error("le formRef est null")
  // Fonction de réinitialisation du formulaire
  const resetForm = () => {
    setFieldErrors({});
    setTouchedFields(new Set());
    setIsFormValid(false);
    formRef.current?.reset();
  };


  const validateForm = (fieldName?: string) => {
    // Marquer le champ comme touché
    if (fieldName) {
      setTouchedFields(prev => new Set(prev).add(fieldName));
    }

    const formData = new FormData(formRef.current!);
    const formObject = formDataToObject(formData, arrayFields);
    const result = formSchema.safeParse(formObject);
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
  return [isFormValid, resetForm, handleFormChange, handleCustomFieldChange, getFieldError] as const
}