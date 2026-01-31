"use client";
import { AlertCircle } from "lucide-react";
import { useActionState, useRef } from "react";
import { login } from "@/action/auth.action";
import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomLink from "@/components/ui/CustomLink";
import { useFormValidation } from "@/hooks/CustomHooks";
import { LoginFormSchema } from "@/schemas/frontend.schemas";

export default function Login() {
	const [state, action, pending] = useActionState(login, undefined);
	const formRef = useRef<HTMLFormElement>(null);
	const [isFormValid, , handleFormChange, , getFieldError] = useFormValidation(
		formRef,
		LoginFormSchema,
	);

	return (
		<div className="flex min-h-screen">
			<div className="flex w-full bg-[url('/images/LogIn.png')] bg-cover bg-center">
				<main
					id="main-content"
					className="flex flex-col items-center justify-center
            relative z-10 bg-gray-50 px-35 py-13.75 gap-50.5"
				>
					<LogoBrandDark aria-hidden="true" />
					<div className="flex flex-col gap-7.5 w-full h-fit">
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
						<h1 className="text-brand-text text-center">Connexion</h1>
						<div className="flex flex-col gap-5.25 flex-1 h-fit">
							<form
								action={action}
								className="flex-1 h-fit flex flex-col gap-7.25"
								onChange={handleFormChange}
								ref={formRef}
							>
								<div className="flex flex-col gap-7.25">
									<CustomInput
										label="Email"
										type="email"
										inputID="email"
										error={getFieldError("email")}
									/>
									<CustomInput
										label="Mot de passe"
										type="password"
										inputID="password"
										error={getFieldError("password")}
									/>
								</div>
								<div className="flex w-fit place-self-center">
									<CustomButton
										label="Se connecter"
										pending={pending}
										disabled={!isFormValid}
										buttonType="submit"
									/>
								</div>
							</form>
							<CustomLink
								label="Mot de passe oublié ?"
								href="#contact"
								type="Routeur"
								className="place-self-center"
							/>
						</div>
					</div>
					<div className="flex whitespace-nowrap gap-2.5 justify-center items-center">
						<p className="body-s">Pas encore de compte ?</p>
						<CustomLink label="Créer un compte" href="/signin" type="Routeur" />
					</div>
				</main>
			</div>
		</div>
	);
}
