"use client";
import { useState } from "react";
import type * as z from "zod";
import type { Task } from "@/schemas/backend.schemas";
import UpdateProject from "../Projects/Modal/UpdateProject";
import CreateAiTask from "../Tasks/Modal/CreateAiTask";
import CreateTask from "../Tasks/Modal/CreateTask";
import CustomButton from "./CustomButton";
import CustomLink from "./CustomLink";
import IAButtonSquare from "./IAButtonSquare";
import IconButton from "./IconButton";

type TasksType = z.infer<typeof Task>[];

interface ProjectBannerProps {
	title: string;
	description: string;
	projectId: string;
	tasks: TasksType;
}

export default function ProjectBanner(props: ProjectBannerProps) {
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const [isUpdateProject, setIsUpdateTaskOpen] = useState(false);
	const [isCreateAiTaskOpen, setIsCreateAiTaskOpen] = useState(false);

	return (
		<section className="flex justify-between w-full" aria-label="Banniere">
			<div className="flex gap-4">
				<IconButton type="MoveLeft" />
				<div className="flex flex-col gap-3.5 justify-center">
					<div className="flex justify-between gap-4 w-57.75 items-center">
						<h1 className="whitespace-nowrap">{props.title}</h1>
						<CustomLink
							label="Modifier"
							type="Opener"
							onClickHandler={() => setIsUpdateTaskOpen(true)}
						/>
					</div>
					<p>{props.description}</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<CustomButton
					onClick={() => setIsCreateTaskOpen(true)}
					label="Créer une tâche"
					pending={false}
					disabled={false}
					buttonType="button"
				/>
				<IAButtonSquare onClick={() => setIsCreateAiTaskOpen(true)} />
			</div>
			{/* Modal de création de tâche */}
			{isCreateTaskOpen && (
				<CreateTask
					open={isCreateTaskOpen}
					onOpenChange={setIsCreateTaskOpen}
					projectId={props.projectId}
				/>
			)}
			{/* Modal de modification de projet */}
			{isUpdateProject && (
				<UpdateProject
					open={isUpdateProject}
					onOpenChange={setIsUpdateTaskOpen}
					projectId={props.projectId}
				/>
			)}
			{/* Modal de création de tâche assisté par IA*/}
			{isCreateAiTaskOpen && (
				<CreateAiTask
					open={isCreateAiTaskOpen}
					onOpenChange={setIsCreateAiTaskOpen}
					projectId={props.projectId}
					tasks={props.tasks}
				/>
			)}
		</section>
	);
}
