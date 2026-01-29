'use client';;
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

import { AlertCircle} from 'lucide-react';
import { useActionState, useRef } from 'react'
import { UpdateProfileSchema, UpdatePasswordSchema } from "@/schemas/frontend.schemas";
import { useFormValidation } from "@/hooks/CustomHooks";
import { updateProfile, updatePassword } from "@/action/user.action";


export default function AccountForm({userName}:{userName: string}){

  return (
      <div className="flex flex-col gap-7.5  justify-center items-center">

        <h1 className="text-brand-dark">Mon Compte</h1>
        <p>{userName}</p>
        <div className="flex flex-row gap-10">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
  )
}


const ProfileForm = () => {
  const [state, action, pending] = useActionState(updateProfile, undefined)
  const profileFormRef = useRef<HTMLFormElement>(null);
  const [isFormValid, , handleFormChange, , getFieldError] = useFormValidation(profileFormRef,UpdateProfileSchema)
  return (
    <>
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
          className="flex flex-col gap-7.25 items-center border-r border-gray-400 rounded-[10px] px-4 py-4 shadow-md"
          onChange={handleFormChange}
          ref={profileFormRef}
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
          </div>
          <div className="flex w-249/282">
            <CustomButton
              label="Modifier les informations"
              pending={pending}
              disabled={!isFormValid}
              buttonType= "submit"
            />
          </div>
        </form>
    </>
  )
}

const PasswordForm = () => {
  const [state, action, pending] = useActionState(updatePassword, undefined)
  const passFromRef = useRef<HTMLFormElement>(null);
  const [isFormValid, , handleFormChange, , getFieldError] = useFormValidation(passFromRef,UpdatePasswordSchema)
  return (
    <>
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
          className="flex flex-col gap-7.25 items-center border-l border-gray-400 rounded-[10px] px-4 py-4 justify-between shadow-md"
          onChange={handleFormChange}
          ref={passFromRef}
        >
          <div className="flex flex-col gap-7.25">
            <CustomInput
              label="Mot de passe actuel"
              type="password"
              inputID="actualPassword"
              error={getFieldError('actualPassword')}
            />

            <CustomInput
              label="Nouveau mot de passe"
              type="password"
              inputID="newPassword"
              error={getFieldError('newPassword')}
            />
          </div>
          <div className="flex w-249/282">
            <CustomButton
              label="Mettre à jour le mot de passe"
              pending={pending}
              disabled={!isFormValid}
              buttonType= "submit"
            />
          </div>
        </form>
    </>
  )
}