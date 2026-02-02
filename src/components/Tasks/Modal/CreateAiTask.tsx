// src/components/Tasks/Modal/CreateAiTask.tsx
"use client";

import { AlertCircle, LoaderPinwheel, Sparkle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import type * as z from "zod";
import { createAiTask, generateAiTask } from "@/action/mistral.action";
import CustomButton from "@/components/ui/CustomButton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import IAButton from "@/components/ui/IAButton";
import type { Task } from "@/schemas/backend.schemas";
import TaskAI from "../TaskAi";

type TasksType = z.infer<typeof Task>[];

interface CreateAiTaskProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	tasks: TasksType;
	onTaskCreated?: (task: unknown) => void;
}

interface AiTask {
	id: string;
	title: string;
	description: string;
	dueDate: string;
}

// Normalise une date en format ISO complet
// "2026-02-15" → "2026-02-15T00:00:00.000Z"
// "2026-02-15T00:00:00.000Z" → "2026-02-15T00:00:00.000Z" (inchangé)
const normalizeToISODate = (dateString: string): string => {
	// Si déjà au format ISO complet, retourne tel quel
	if (dateString.includes("T")) {
		return dateString;
	}
	// Sinon, complète avec l'heure
	return `${dateString}T00:00:00.000Z`;
};

export default function CreateAiTask({
	open,
	onOpenChange,
	projectId,
	tasks,
}: CreateAiTaskProps) {
	const boundGenerateAiTask = generateAiTask.bind(null, tasks);
	const [state, formAction, isPending] = useActionState(
		boundGenerateAiTask,
		undefined,
	);

	const [isAddingTasks, startTransition] = useTransition();
	const [message, setMessage] = useState("");
	const [ok, setOk] = useState(true);
	const [tasksList, setTasksList] = useState<AiTask[]>([]);

	// ?test=true → utilise mockData, sinon API Mistral
	const searchParams = useSearchParams();
	const isTestMode = searchParams.get("test") === "true";

	useEffect(() => {
		if (isTestMode) {
			const tasksWithIds = mockData.tasks.map((task) => ({
				...task,
				id: crypto.randomUUID(),
			}));
			const handleMockData = () => {
				if (tasksWithIds) {
					setTasksList(tasksWithIds);
				}
			};
			handleMockData();
		} else if (state?.data?.tasks) {
			const tasksWithIds = state.data.tasks.map((task: Omit<AiTask, "id">) => ({
				...task,
				id: crypto.randomUUID(),
			}));
			const handleMistralData = (tasksWithIds: AiTask[]) => {
				setTasksList(tasksWithIds);
			};
			handleMistralData(tasksWithIds);
		}
	}, [isTestMode, state?.data?.tasks]);

	const handleClickAddTasks = (tasks: AiTask[]) => {
		tasks.forEach((task) => {
			startTransition(async () => {
				const isoDate = normalizeToISODate(task.dueDate);
				const response = await createAiTask(
					projectId,
					task.title,
					task.description,
					isoDate,
				);
				// Gérer la réponse ici sans la retourner
				if (!response.ok) {
					console.error(response.message);
					setMessage(response?.message || "erreur");
					setOk(false);
				} else {
					setMessage(`Tâche créée: ${response.data}`);
					setOk(true);
				}
			});
		});
		onOpenChange(!ok);
	};

	// Nettoyer quand le modal se ferme
	const handleOpenChange = (isOpen: boolean) => {
		onOpenChange(isOpen);
	};

	const handleDeleteTask = (taskId: string) => {
		const nouvelleListe = tasksList.filter((task) => task.id !== taskId);
		setTasksList(nouvelleListe);
	};

	const handleEditTask = (taskId: string, formData: FormData) => {
		const newTitle = formData.get("title") as string | null;
		const newDesc = formData.get("description") as string | null;
		const newDueDate = formData.get("dueDate") as string | null;

		const nouvelleListe = tasksList.map((task) => {
			if (task.id !== taskId) return task;

			// Spread : garde l'ancien, écrase seulement si nouvelle valeur existe
			return {
				...task,
				...(newTitle && { title: newTitle }),
				...(newDesc && { description: newDesc }),
				...(newDueDate && { dueDate: newDueDate }),
			};
		});
		setTasksList(nouvelleListe);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className="
        px-13 pt-19.75 pb-19.75 h-fit
        flex flex-col justify-between
        bg-white rounded-[10px] items-center gap-14
        [&_[data-slot=dialog-close]_svg]:stroke-gray-600
        **:data-[slot=dialog-close]:top-6
        **:data-[slot=dialog-close]:right-6
        min-w-5/12
        "
			>
				<div className="flex flex-col w-full gap-10">
					<DialogHeader className="flex gap-2">
						<div className="flex gap-2 items-center">
							<Sparkle className="fill-brand-dark stroke-0" />
							<DialogTitle>
								{tasksList.length === 0 ? "Créer une tâche" : "Vos tâches..."}
							</DialogTitle>
						</div>
						<DialogDescription className="sr-only">
							Générer des tâches avec l&apos;intelligence artificielle
						</DialogDescription>
					</DialogHeader>
					{isAddingTasks && <LoaderPinwheel />}
					{!ok ||
						(!state?.ok && state?.message && (
							<div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
								<AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
								<div className="flex flex-col gap-1">
									<p className="text-red-700 font-medium text-sm">Erreur</p>
									<p className="text-red-600 text-sm">
										{message || state?.message}
									</p>
								</div>
							</div>
						))}
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-6 min-h-115 max-h-117 w-full overflow-auto">
							{isPending ? (
								// Skeleton de chargement
								<div className="animate-pulse space-y-4">
									<div className="h-6 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
							) : (
								tasksList?.map((task) => (
									<TaskAI
										key={task.id}
										taskId={task.id}
										title={task.title}
										description={task.description}
										dueDate={task.dueDate}
										handleDeleteTask={handleDeleteTask}
										handleEditTask={handleEditTask}
									/>
								))
							)}
						</div>
						{tasksList.length > 0 && (
							<div className="flex w-45.25 place-self-center">
								<CustomButton
									label="+ Ajouter les tâches"
									pending={isAddingTasks}
									disabled={false}
									buttonType="button"
									onClick={() => handleClickAddTasks(tasksList)}
									className="whitespace-nowrap"
								/>
							</div>
						)}
					</div>

					<form action={formAction} className="flex flex-col gap-6 flex-1">
						{tasksList.length > 0 && (
							<hr className="-mx-18.25 w-[calc(100%+8)]" />
						)}
						<div className="flex flex-1 gap-3.5 px-8 py-4.5 rounded-[80px] bg-gray-50 justify-between">
							<label htmlFor="prompt" className="sr-only">
								Décrivez les tâches à générer par IA
							</label>
							<input
								type="text"
								name="prompt"
								id="prompt"
								placeholder="Décrivez les tâches que vous souhaitez ajouter..."
								className="flex-1 focus:outline-0 placeholder:text-black body-2xs"
							/>
							<IAButton />
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

const mockData = {
	tasks: [
		{
			title: "Analyse des données RAG pour le projet",
			description:
				"Analyse des données pour déterminer le niveau de risque, d'achèvement et de gestion du projet en utilisant le modèle RAG.",
			dueDate: "2026-02-15",
		},
		{
			title: "Établir les objectifs RAG pour le projet",
			description:
				"Établir les objectifs RAG pour chaque phase du projet en fonction des données collectées.",
			dueDate: "2026-02-20",
		},
		{
			title: "Évaluer les risques RAG pour le projet",
			description:
				"Évaluer les risques associés au projet en utilisant le modèle RAG et proposer des solutions pour les réduire.",
			dueDate: "2026-03-05",
		},
		{
			title: "Mise en place de la stratégie RAG pour le projet",
			description:
				"Mettre en place une stratégie RAG pour le projet en fonction des objectifs et des risques identifiés.",
			dueDate: "2026-03-15",
		},
		{
			title: "Suivi du projet RAG",
			description:
				"Suivre le projet en utilisant le modèle RAG pour s'assurer que les objectifs sont atteints et que les risques sont maîtrisés.",
			dueDate: "2026-04-01",
		},
	],
};
