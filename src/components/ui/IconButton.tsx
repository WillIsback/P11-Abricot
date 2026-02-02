"use client";

import { Ellipsis, MoveLeft, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTask } from "@/action/task.action";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateTask from "../Tasks/Modal/UpdateTask";

type buttonType = "MoveLeft" | "Ellipsis";

interface IconButtonProps {
	type: buttonType;
	taskId?: string;
	projectId?: string;
}
export default function IconButton({
	type,
	projectId,
	taskId,
}: IconButtonProps) {
	const [, startTransition] = useTransition();
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const routeur = useRouter();

	const handleTrashClick = () => {
		startTransition(async () => {
			const res = await deleteTask(projectId || "", taskId || "");
			if (!res?.ok) {
				console.warn(res?.message);
			} else {
				routeur.refresh();
			}
		});
	};
	const handlePencilClick = () => {
		setIsCreateTaskOpen(true);
	};

	const handleBackButton = () => {
		routeur.push("/projects");
	};
	return (
		<>
			{type === "MoveLeft" ? (
				<RouterBackButton handleBackButton={handleBackButton} />
			) : (
				<DropdownMenuDestructive
					handleTrashClick={handleTrashClick}
					handlePencilClick={handlePencilClick}
				/>
			)}
			{/* Modal d'update de tâche */}
			<UpdateTask
				open={isCreateTaskOpen}
				onOpenChange={setIsCreateTaskOpen}
				projectId={projectId || ""}
				taskId={taskId || ""}
			/>
		</>
	);
}

function RouterBackButton({
	handleBackButton,
}: {
	handleBackButton: () => void;
}) {
	return (
		<button
			type="button"
			aria-label="Retour aux projets"
			className="
                w-14.25 h-14.25 rounded-[10px] group flex
                items-center justify-center border border-gray-200 bg-white
                hover:border-brand-dark focus:border-brand-dark"
			onClick={handleBackButton}
		>
			<MoveLeft className="w-3.75 stroke-black group-hover:stroke-brand-dark group-focus:stroke-brand-dark" />
		</button>
	);
}

function DropdownMenuDestructive({
	handleTrashClick,
	handlePencilClick,
}: {
	handleTrashClick: () => void;
	handlePencilClick: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					aria-label="Options de la tâche"
					className="w-14.25 h-14.25 rounded-[10px] group flex items-center justify-center
					 border border-gray-200 bg-white hover:border-brand-dark focus:border-brand-dark"
				>
					<Ellipsis className="w-3.75 stroke-gray-600 group-hover:stroke-brand-dark group-focus:stroke-brand-dark" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handlePencilClick}>
						<PencilIcon />
						Edit
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive" onClick={handleTrashClick}>
						<TrashIcon />
						Delete
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
