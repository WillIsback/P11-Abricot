'use client';
import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import CustomLink from "@/components/ui/CustomLink";
import { AlertCircle} from 'lucide-react';
import { login } from "@/action/auth.action";
import { useActionState, useRef, useState } from 'react'
import { LoginFormSchema } from "@/schemas/frontend.schemas";
import * as z from 'zod';


export default function Login() {
  const [state, action, pending] = useActionState(login, undefined)
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

    const result = LoginFormSchema.safeParse({
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
    <div className="flex h-screen">
      <div className="flex m-auto h-256 w-360 bg-[url('/images/LogIn.png')] bg-contain bg-center">
        <main className="flex items-center justify-center w-2/5 h-256 flex-col px-35 py-13.75 gap-50.5 relative z-10 bg-gray-50">
          <LogoBrandDark />
          <div className="flex flex-col gap-7.5  justify-center items-center">
            {!state?.ok && !state?.formValidationError && state?.message && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-red-700 font-medium text-sm">Erreur</p>
                  <p className="text-red-600 text-sm">{state.message}</p>
                </div>
              </div>
            )}
            <h1 className="text-brand-dark">Connexion</h1>
            <form
              action={action}
              className="flex flex-col gap-7.25 items-center"
              onChange={handleFormChange}
              ref={formRef}
            >
              <div className="flex flex-col gap-7.25">
                <CustomInput
                  label="Email"
                  type="email"
                  inputID="email"
                  error={getFieldError('name')}
                />
                <CustomInput
                  label="Mot de passe"
                  type="password"
                  inputID="password"
                  error={getFieldError('name')}
                />
              </div>
              <div className="flex w-249/282">
                <CustomButton
                  label='Se connecter'
                  pending={pending}
                  disabled={pending}
                  buttonType= "submit"
                />
              </div>
            </form>
            <CustomLink
              label="Mot de passe oublié ?"
              link="#contact"
            />
          </div>
          <div className="flex whitespace-nowrap gap-2.5 justify-center items-center">
            <p className="body-s">Pas encore de compte ?</p>
            <CustomLink
              label="Créer un compte"
              link="/signin"
            />
          </div>
        </main>
      </div>
    </div>
  );
}