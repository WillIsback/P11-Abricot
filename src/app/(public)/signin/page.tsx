'use client';
import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import CustomLink from "@/components/ui/CustomLink";
import { AlertCircle} from 'lucide-react';
import { signup } from "@/action/auth.action";
import { useActionState, useRef } from 'react'
import { SignupFormSchema } from "@/schemas/frontend.schemas";
import { useFormValidation } from "@/hooks/CustomHooks";


export default function SignIn() {
  const [state, action, pending] = useActionState(signup, undefined)
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, , handleFormChange, , getFieldError] = useFormValidation(formRef,SignupFormSchema)


  return (
    <div className="flex min-h-screen">
      <div className="flex w-full bg-[url('/images/SignIn.png')] bg-cover bg-center">
        <main
          className="flex flex-col items-center justify-center
            relative z-10 bg-gray-50 px-35 py-13.75 gap-30"
          >
          <LogoBrandDark />
          <div className="flex flex-col gap-7.5 w-full h-fit">
            {!state?.ok && !state?.formValidationError && state?.message && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-red-700 font-medium text-sm">Erreur</p>
                  <p className="text-red-600 text-sm">{state.message}</p>
                </div>
              </div>
            )}
            <h1 className="text-brand-dark text-center">Inscription</h1>
            <div className="flex flex-col gap-5.25 w-full h-fit">
              <form
                action={action}
                className="flex flex-col gap-7.25"
                onChange={handleFormChange}
                ref={formRef}
              >
                <div className="flex flex-col gap-7.25">
                  <CustomInput
                    label="Prénom"
                    type="text"
                    inputID="firstName"
                    error={getFieldError('firstName')}
                  />

                  <CustomInput
                    label="Nom"
                    type="text"
                    inputID="lastName"
                    error={getFieldError('lastName')}
                  />

                  <CustomInput
                    label="Email"
                    type="email"
                    inputID="email"
                    error={getFieldError('email')}
                  />

                  <CustomInput
                    label="Mot de passe"
                    type="password"
                    inputID="password"
                    error={getFieldError('password')}
                  />

                </div>
                <div className="flex w-fit place-self-center">
                  <CustomButton
                    label="S'inscrire"
                    pending={pending}
                    disabled={!isFormValid}
                    buttonType= "submit"
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="flex whitespace-nowrap gap-2.5 justify-center items-center">
            <p className="body-s">Déjà inscrit ?</p>
            <CustomLink
              type="Routeur"
              label="Se connecter"
              href="/login"
            />
          </div>
        </main>
      </div>
    </div>
  );
}