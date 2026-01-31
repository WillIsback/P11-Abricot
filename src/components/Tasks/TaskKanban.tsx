"use client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FolderOpen, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import SVGCalendar from "@/assets/icons/calendar.svg";
import CustomButton from "../ui/CustomButton";
import Tags from "../ui/Tags";

interface PropsType {
	id: string;
	title: string;
	description: string;
	status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	dueDate: string;
	projectId: string;
	creatorId: string;
	assignees: {
		id: string;
		userId: string;
		taskId: string;
		user: {
			id: string;
			email: string;
			name: string;
			createdAt: string;
			updatedAt: string;
		};
		assignedAt: string;
	}[];
	comments: {
		id: string;
		content: string;
		taskId: string;
		authorId: string;
		author: {
			id: string;
			email: string;
			name: string;
			createdAt: string;
			updatedAt: string;
		};
		createdAt: string;
		updatedAt: string;
	}[];
	createdAt: string;
	updatedAt: string;
}

type TagColor = "gray" | "orange" | "info" | "warning" | "error" | "success";

export default function TaskKanban(props: PropsType) {
	const router = useRouter();
	const formattedDate = format(new Date(props.dueDate), "d MMMM", {
		locale: fr,
	});
	const statusColor: Record<PropsType["status"], TagColor> = {
		TODO: "error",
		IN_PROGRESS: "warning",
		DONE: "success",
		CANCELED: "gray",
	};
	const statusLabel: Record<PropsType["status"], string> = {
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
		CANCELED: "Abandonnée",
	};
	const href = `/projects/${props.projectId}?chips=task&status=${props.status}&search=${props.title}`;
	return (
		<article className="flex flex-col rounded-[10px] bg-white px-10 py-6.25 gap-8 border border-gray-200">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between">
					<div className="flex flex-col gap-1.75">
						<h3>{props.title}</h3>
						<p className="body-s text-gray-600">{props.description}</p>
					</div>
					<Tags
						label={statusLabel[props.status]}
						color={statusColor[props.status]}
					/>
				</div>
				<div className="flex flex-row gap-3.75 items-center">
					<div className="flex gap-2 w-26.75 flex-nowrap items-center">
						<FolderOpen className="fill-gray-400 stroke-white" />
						<span className="text-gray-600 body-xs whitespace-nowrap">
							{"projectName"}
						</span>
					</div>
					<span className="text-gray-400 text-[11px]">|</span>
					<div className="flex gap-2 w-15.5 flex-nowrap items-center">
						<SVGCalendar />
						<span className="text-gray-600 body-xs whitespace-nowrap">
							{formattedDate}
						</span>
					</div>
					<span className="text-gray-400 text-[11px]">|</span>
					<div className="flex gap-2 w-15.5 flex-nowrap items-center">
						<MessageSquareText className="stroke-gray-600" width={15} />
						<span className="text-gray-600 body-xs whitespace-nowrap">
							{props.comments.length}
						</span>
					</div>
				</div>
			</div>
			<div className="w-30.25">
				<CustomButton
					label="Voir"
					pending={false}
					disabled={false}
					buttonType="button"
					onClick={() => router.push(href)}
				/>
			</div>
		</article>
	);
}
