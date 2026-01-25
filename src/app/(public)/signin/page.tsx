'use client';
import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import CustomLink from "@/components/ui/CustomLink";

import { signup } from "@/action/auth.action";
import { useActionState } from 'react'



export default function SignIn() {
  const [state, action, pending] = useActionState(signup, undefined)
  if(state?.formValidationError){
    console.error(state.formValidationError?.errors)
  }
  return (
    <div className="flex h-screen">
      <div className="flex m-auto h-256 w-360 bg-[url('/images/SignIn.png')] bg-contain bg-center">
        <main className="flex items-center justify-center w-2/5 h-256 flex-col px-35 py-13.75 gap-50.5 relative z-10 bg-gray-50">
          <LogoBrandDark />
          <div className="flex flex-col gap-7.5  justify-center items-center">
            {(!state?.ok && !state?.formValidationError) && (
              <p className="text-red-500">{state?.message}</p>
            )}
            <h1 className="text-brand-dark">Inscription</h1>
            <form action={action} className="flex flex-col gap-7.25 items-center">
              <div className="flex flex-col gap-7.25">
                <CustomInput
                  label="Prénom"
                  type="text"
                  inputID="firstName"
                />
                {state?.formValidationError?.properties?.firstName && (
                  <p className="text-red-500">{state?.formValidationError?.properties?.firstName.errors}</p>
                )}
                <CustomInput
                  label="Nom"
                  type="text"
                  inputID="lastName"
                />
                {state?.formValidationError?.properties?.lastName && (
                  <p className="text-red-500">{state?.formValidationError?.properties?.lastName.errors}</p>
                )}
                <CustomInput
                  label="Email"
                  type="email"
                  inputID="email"
                />
                {state?.formValidationError?.properties?.email && (
                  <p className="text-red-500">{state?.formValidationError?.properties?.email.errors}</p>
                )}
                <CustomInput
                  label="Mot de passe"
                  type="password"
                  inputID="password"
                />
                {state?.formValidationError?.properties?.password && (
                  <p className="text-red-500">{state?.formValidationError?.properties?.password.errors}</p>
                )}           
              </div>
              <div className="flex w-249/282">
                <CustomButton
                  label="S'inscrire"
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
            <p className="body-s">Déjà inscrit ?</p>
            <CustomLink
              label="Se connecter"
              link="/login"
            />
          </div>
        </main>
      </div>
    </div>
  );
}