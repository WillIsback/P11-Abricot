"use client";

import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { updatePassword, updateProfile } from "@/action/user.action";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { useFormValidation } from "@/hooks/CustomHooks";
import {
	UpdatePasswordSchema,
	UpdateProfileSchema,
} from "@/schemas/frontend.schemas";

export default function AccountForm({ userName }: { userName: string }) {
	return (
		<div className="flex flex-col gap-7.5 ">
			<div className="flex flex-col gap-2">
				<h1>Mon Compte</h1>
				<p className="body-m text-gray-600">{userName}</p>
			</div>
			<div className="flex flex-col gap-2">
				<ProfileForm userName={userName} />
				<hr />
				<PasswordForm />
			</div>
		</div>
	);
}

const ProfileForm = ({ userName }: { userName: string }) => {
	const boundUpdateProfile = updateProfile.bind(null, userName);
	const [state, action, pending] = useActionState(
		boundUpdateProfile,
		undefined,
	);
	const formRef = useRef<HTMLFormElement>(null);
	const [isFormValid, resetForm, handleFormChange, , getFieldError] =
		useFormValidation(formRef, UpdateProfileSchema);

	// Reset le formulaire quand la soumission réussit
	useEffect(() => {
		if (state?.ok) {
			resetForm();
		}
	}, [state?.ok, resetForm]);

	return (
		<>
			{!state?.ok && !state?.formValidationError && state?.message && (
				<div
					role="alert"
					className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
				>
					<AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
					<div className="flex flex-col gap-1">
						<p className="text-red-700 font-medium text-sm">Erreur</p>
						<p className="text-red-600 text-sm">{state.message}</p>
					</div>
				</div>
			)}
			<form
				action={action}
				className="flex flex-col gap-7.25 px-4 py-4"
				onChange={handleFormChange}
				ref={formRef}
			>
				<div className="flex flex-col gap-7.25">
					<CustomInput
						label="Prénom"
						type="text"
						inputID="firstName"
						error={getFieldError("firstName")}
					/>

					<CustomInput
						label="Nom"
						type="text"
						inputID="lastName"
						error={getFieldError("lastName")}
					/>

					<CustomInput
						label="Email"
						type="email"
						inputID="email"
						error={getFieldError("email")}
					/>
				</div>
				<div className="flex w-fit">
					<CustomButton
						label="Modifier les informations"
						pending={pending}
						disabled={!isFormValid}
						buttonType="submit"
					/>
				</div>
			</form>
		</>
	);
};

const PasswordForm = () => {
	const [state, action, pending] = useActionState(updatePassword, undefined);
	const formRef = useRef<HTMLFormElement>(null);
	const [isFormValid, resetForm, handleFormChange, , getFieldError] =
		useFormValidation(formRef, UpdatePasswordSchema);

	// Reset le formulaire quand la soumission réussit
	useEffect(() => {
		if (state?.ok) {
			resetForm();
		}
	}, [state?.ok, resetForm]);

	return (
		<>
			{!state?.ok && !state?.formValidationError && state?.message && (
				<div
					role="alert"
					className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
				>
					<AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
					<div className="flex flex-col gap-1">
						<p className="text-red-700 font-medium text-sm">Erreur</p>
						<p className="text-red-600 text-sm">{state.message}</p>
					</div>
				</div>
			)}

			<form
				action={action}
				className="flex flex-col gap-7.25 px-4 py-4"
				onChange={handleFormChange}
				ref={formRef}
			>
				<div className="flex flex-col gap-7.25">
					<CustomInput
						label="Mot de passe actuel"
						type="password"
						inputID="currentPassword"
						error={getFieldError("currentPassword")}
					/>

					<CustomInput
						label="Nouveau mot de passe"
						type="password"
						inputID="newPassword"
						error={getFieldError("newPassword")}
					/>
				</div>
				<div className="flex w-fit">
					<CustomButton
						label="Mettre à jour le mot de passe"
						pending={pending}
						disabled={!isFormValid}
						buttonType="submit"
					/>
				</div>
			</form>
		</>
	);
};
