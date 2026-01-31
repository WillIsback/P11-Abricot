// src/components/Projects/Modal/UpdateProject.tsx
"use client";

import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { updateProject } from "@/action/project.action";
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
import { useFormValidation, useProject } from "@/hooks/CustomHooks";
import { UpdateProjectSchema } from "@/schemas/frontend.schemas";

interface UpdateProjectProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	onProjectUpdated?: (project: unknown) => void;
}

export default function UpdateProject({
	open,
	onOpenChange,
	projectId,
	onProjectUpdated,
}: UpdateProjectProps) {
	const boundUpdateProject = updateProject.bind(null, projectId);
	const [state, action, pending] = useActionState(
		boundUpdateProject,
		undefined,
	);
	const formRef = useRef<HTMLFormElement>(null);
	const { members } = useProject();
	
	// Transformer les membres existants au format attendu par ComboboxContributor
	const existingContributors = members.map((member) => ({
		id: member.user.id,
		email: member.user.email,
		name: member.user.name,
	}));
	
	const [
		isFormValid,
		resetForm,
		handleFormChange,
		handleCustomFieldChange,
		getFieldError,
	] = useFormValidation(formRef, UpdateProjectSchema, ["contributors"]);

	useEffect(() => {
		if (state?.ok && state?.shouldClose) {
			onProjectUpdated?.(state.data);
			onOpenChange(false);
		}
		if (state?.formValidationError || state?.apiValidationError) {
			console.error("Erreurs de validation:", state?.message);
		}
	}, [
		state?.shouldClose,
		state?.data,
		onProjectUpdated,
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
					<DialogTitle>Modifier un Projet</DialogTitle>
					<DialogDescription className="sr-only">
						Formulaire pour modifier un projet existant
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
						label="Titre"
						type="text"
						inputID="name"
						error={getFieldError("name")}
					/>
					{/* Description */}
					<CustomInput
						label="Description"
						type="text"
						inputID="description"
						error={getFieldError("description")}
					/>
					{/* Contributeurs */}
					<CustomInput
						label="Contributeurs"
						type="Contributor"
						inputID="contributors"
						onValueChange={handleCustomFieldChange("contributors")}
						error={getFieldError("contributors")}
						defaultValue={existingContributors}
					/>
					<DialogFooter className="gap-2 w-61 flex justify-start">
						<CustomButton
							label="Ajouter un projet"
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
