'use client';
import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import CustomLink from "@/components/ui/CustomLink";
import { AlertCircle} from 'lucide-react';
import { login } from "@/action/auth.action";
import { useActionState, useRef } from 'react'
import { LoginFormSchema } from "@/schemas/frontend.schemas";
import { useFormValidation } from "@/hooks/CustomHooks";


export default function Login() {
  const [state, action, pending] = useActionState(login, undefined)
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, , handleFormChange, , getFieldError] = useFormValidation(formRef,LoginFormSchema)


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
                  error={getFieldError('email')}
                />
                <CustomInput
                  label="Mot de passe"
                  type="password"
                  inputID="password"
                  error={getFieldError('password')}
                />
              </div>
              <div className="flex w-249/282">
                <CustomButton
                  label='Se connecter'
                  pending={pending}
                  disabled={!isFormValid}
                  buttonType= "submit"
                />
              </div>
            </form>
            <CustomLink
              label="Mot de passe oublié ?"
              href="#contact"
              type="Routeur"
            />
          </div>
          <div className="flex whitespace-nowrap gap-2.5 justify-center items-center">
            <p className="body-s">Pas encore de compte ?</p>
            <CustomLink
              label="Créer un compte"
              href="/signin"
              type="Routeur"
            />
          </div>
        </main>
      </div>
    </div>
  );
}