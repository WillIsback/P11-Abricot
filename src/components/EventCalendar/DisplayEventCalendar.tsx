"use client";
import { useState } from "react";
import type * as z from "zod";
import EventCalendar, {
	type CalendarEvent,
} from "@/components/EventCalendar/EventCalendar";
import type { Task } from "@/schemas/backend.schemas";

type TaskType = z.infer<typeof Task>;

// Helper pour convertir la priorité en couleur
const priorityToColor = (
	priority: TaskType["priority"],
): CalendarEvent["color"] => {
	const colorMap = {
		LOW: "green",
		MEDIUM: "blue",
		HIGH: "yellow",
		URGENT: "red",
	} as const;
	return colorMap[priority];
};

// Fonction de transformation Task -> CalendarEvent
const mapTasksToEvents = (tasks: TaskType[]): CalendarEvent[] => {
	return tasks.map((task) => ({
		id: task.id,
		title: task.title,
		date: new Date(task.dueDate),
		description: task.description,
		color: priorityToColor(task.priority),
		status: task.status,
	}));
};

export default function DisplayEventCalendar({ tasks }: { tasks: TaskType[] }) {
	const [isEventTaskOpen, setIsEventTaskOpen] = useState(false);
	// Transformer les tâches en événements pour le calendrier
	const events = mapTasksToEvents(tasks || mockTasks);
	console.log("events", events);

	// Handlers
	const handleDayClick = (date: Date) => {
		console.log("Jour cliqué:", date.toLocaleDateString("fr-FR"));
		setIsEventTaskOpen(true);
	};

	return (
		<main className="p-8 bg-gray-50 rounded-[10px]">
			<h2 className="text-center body-xl">Calendrier</h2>
			<EventCalendar
				events={events}
				onDayClick={handleDayClick}
				open={isEventTaskOpen}
				setIsEventTaskOpen={setIsEventTaskOpen}
			/>
		</main>
	);
}

// Données mock pour tester
const mockTasks: TaskType[] = [
	{
		id: "1",
		title: "Faire la maquette",
		description: "Créer les wireframes du projet",
		status: "TODO",
		priority: "HIGH",
		dueDate: "2026-01-30T10:00:00.000Z",
		projectId: "p1",
		creatorId: "u1",
		assignees: [],
		comments: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
	{
		id: "2",
		title: "Review code PR #42",
		description: "Vérifier les modifications de la branche feature/calendar",
		status: "IN_PROGRESS",
		priority: "URGENT",
		dueDate: "2026-01-30T14:00:00.000Z",
		projectId: "p1",
		creatorId: "u1",
		assignees: [],
		comments: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
	{
		id: "3",
		title: "Réunion équipe",
		description: "Point hebdomadaire avec l'équipe",
		status: "TODO",
		priority: "MEDIUM",
		dueDate: "2026-02-03T09:00:00.000Z",
		projectId: "p1",
		creatorId: "u1",
		assignees: [],
		comments: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
	{
		id: "4",
		title: "Documenter l'API",
		description: "Écrire la documentation des endpoints",
		status: "TODO",
		priority: "LOW",
		dueDate: "2026-02-10T10:00:00.000Z",
		projectId: "p1",
		creatorId: "u1",
		assignees: [],
		comments: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
	{
		id: "5",
		title: "Tests unitaires",
		description: "Ajouter les tests pour le module auth",
		status: "TODO",
		priority: "HIGH",
		dueDate: "2026-02-05T10:00:00.000Z",
		projectId: "p1",
		creatorId: "u1",
		assignees: [],
		comments: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
];
