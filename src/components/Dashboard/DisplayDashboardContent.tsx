"use client";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTasks } from "@/hooks/CustomHooks";
import { isTasks } from "@/lib/utils";
import Chips from "../ui/Chips";
import DashBoardKanban from "./DashboardKanban";
import DashBoardTasks from "./DashboardTasks";

const priorityOrder: Record<string, number> = {
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
	URGENT: 3,
};

export default function DisplayDashboardContent() {
	const searchParams = useSearchParams();
	const chips = searchParams.get("chips");
	const search = searchParams.get("search");
	const [isPending, state] = useTasks();

	if (isPending)
		return (
			<LoaderCircle
				aria-label="Chargement en cours"
				className="animate-spin"
				role="status"
			/>
		);
	if (!isTasks(state?.data)) return <p>error</p>;

	const sortedTasks = [...state.data.tasks].sort(
		(t1, t2) => priorityOrder[t2.priority] - priorityOrder[t1.priority],
	);
	const q = search?.toLowerCase() ?? "";
	const filteredTasks = sortedTasks.filter((t) => {
		const okSearch =
			!q ||
			t.title.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			t.comments.some((c) => c.content.toLowerCase().includes(q)) ||
			t.assignees.some((a) => a.user.name.toLowerCase().includes(q));
		return okSearch;
	});

	return (
		<div className="flex flex-col mt-15">
			<div className="flex gap-2.5">
				<Chips type="task" />
				<Chips type="kanban" />
			</div>
			{chips === "task" ? (
				<DashBoardTasks tasks={filteredTasks} />
			) : (
				<DashBoardKanban tasks={state?.data.tasks} />
			)}
			{isPending && (
				<LoaderCircle
					aria-label="Chargement en cours"
					className="animate-spin"
					role="status"
				/>
			)}
		</div>
	);
}
