// src/components/Tasks/Modal/UpdateTask.tsx
"use client";

import { AlertCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateTask } from "@/action/task.action";
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
import Tags from "@/components/ui/Tags";
import { useFormValidation } from "@/hooks/CustomHooks";
import { mapStatusColor, mapStatusLabel } from "@/lib/client.lib";
import { UpdateTaskSchema } from "@/schemas/frontend.schemas";

enum Status {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	DONE = "DONE",
}

interface UpdateTaskProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	taskId: string;
	onTaskUpdated?: (task: unknown) => void;
}

export default function UpdateTask({
	open,
	onOpenChange,
	projectId,
	taskId,
	onTaskUpdated,
}: UpdateTaskProps) {
	const boundUpdateTask = updateTask.bind(null, projectId, taskId);
	const [state, action, pending] = useActionState(boundUpdateTask, undefined);
	const [selectedStatus, setSelectedStatus] = useState<Status>(Status.TODO);
	const formRef = useRef<HTMLFormElement>(null);
	const [
		isFormValid,
		resetForm,
		handleFormChange,
		handleCustomFieldChange,
		getFieldError,
	] = useFormValidation(formRef, UpdateTaskSchema, ["assigneeIds"]);
	const status: Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE];
	useEffect(() => {
		if (state?.ok && state?.shouldClose) {
			onTaskUpdated?.(state.data);
			onOpenChange(false);
		}
		if (state?.formValidationError || state?.apiValidationError) {
			console.error("Erreurs de validation:", state?.message);
		}
	}, [
		state?.shouldClose,
		state?.data,
		onTaskUpdated,
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

	const handleStatusSelection = (newStatus: Status) => {
		setSelectedStatus(newStatus);
		// Déclencher la validation après le changement de statut
		handleCustomFieldChange("status")();
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
					<DialogTitle>Modifier</DialogTitle>
					<DialogDescription className="sr-only">
						Formulaire pour modifier une tâche existante
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
					<input type="hidden" name="projectId" value={projectId} />
					{/* Titre */}
					<CustomInput
						label="Titre*"
						type="text"
						inputID="title"
						error={getFieldError("title")}
					/>
					{/* Description */}
					<CustomInput
						label="Description*"
						type="text"
						inputID="description"
						error={getFieldError("description")}
					/>
					{/* Date d'échéance */}
					<CustomInput
						label="Echéance*"
						type="DatePicker"
						inputID="dueDate"
						onValueChange={handleCustomFieldChange("dueDate")}
						error={getFieldError("dueDate")}
					/>
					{/* Assignees */}
					<CustomInput
						label="Assigné à:"
						type="Assignee"
						inputID="assigneeIds"
						onValueChange={handleCustomFieldChange("assigneeIds")}
						error={getFieldError("assigneeIds")}
					/>
					{/* Priority */}
					<CustomInput
						label="Priorité :"
						type="Priority"
						inputID="priority"
						onValueChange={handleCustomFieldChange("priority")}
						error={getFieldError("priority")}
					/>
					{/* Status */}
					<fieldset className="flex flex-col gap-4">
						<legend className="body-s">Statut :</legend>

						<input type="hidden" name="status" value={selectedStatus} />
						<div className="flex gap-2" role="radiogroup">
							{status.map((s) => {
								const isSelected = selectedStatus === s;
								return (
									<button
										key={s}
										type="button"
										role="radio"
										aria-checked={isSelected}
										onClick={() => handleStatusSelection(s)}
										className={`cursor-pointer rounded p-1 transition-all ${
											isSelected
												? "ring-2 ring-offset-1 ring-blue-500 bg-gray-50 rounded-2xl"
												: "opacity-70 hover:opacity-100"
										}`}
									>
										<Tags label={mapStatusLabel[s]} color={mapStatusColor[s]} />
									</button>
								);
							})}
						</div>
					</fieldset>

					<DialogFooter className="gap-2 w-61 flex justify-start">
						<CustomButton
							label="Enregistrer"
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
