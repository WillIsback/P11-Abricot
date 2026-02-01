// src/components/Projects/Modal/CreateProject.tsx
"use client";

import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { createProject } from "@/action/project.action";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useFormValidation } from "@/hooks/CustomHooks";
import { CreateProjectSchema } from "@/schemas/frontend.schemas";

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
	const [
		isFormValid,
		resetForm,
		handleFormChange,
		handleCustomFieldChange,
		getFieldError,
	] = useFormValidation(formRef, CreateProjectSchema, ["contributors"]);

	useEffect(() => {
		if (state?.ok && state?.shouldClose) {
			onProjectCreated?.(state.data);
			onOpenChange(false);
		}
		if (state?.formValidationError || state?.apiValidationError) {
			console.error("Erreurs de validation:", state?.message);
		}
	}, [
		state?.shouldClose,
		state?.data,
		onProjectCreated,
		onOpenChange,
		state?.ok,
		state?.formValidationError,
		state?.apiValidationError,
		state?.message,
	]);

	// Nettoyer quand le modal se ferme
	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			resetForm();
		}
		onOpenChange(isOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className="flex flex-col gap-10 sm:max-w-149.5 px-18.25 py-19.75
        [&_[data-slot=dialog-close]_svg]:stroke-gray-600
        **:data-[slot=dialog-close]:top-6    
        **:data-[slot=dialog-close]:right-6
        "
			>
				<DialogHeader>
					<DialogTitle>Créer un projet</DialogTitle>
					<DialogDescription className="sr-only">
						Formulaire pour créer un nouveau projet
					</DialogDescription>
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
						error={getFieldError("name")}
					/>
					{/* Description */}
					<CustomInput
						label="Description*"
						type="text"
						inputID="description"
						required={true}
						error={getFieldError("description")}
					/>
					{/* Contributeurs */}
					<CustomInput
						label="Contributeurs"
						type="Contributor"
						inputID="contributors"
						onValueChange={handleCustomFieldChange("contributors")}
						error={getFieldError("contributors")}
					/>
					<DialogFooter className="gap-2 w-45.25 flex justify-start">
						<CustomButton
							label="Ajouter un projet"
							pending={pending}
							disabled={!isFormValid}
							buttonType="submit"
							className="whitespace-nowrap"
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
