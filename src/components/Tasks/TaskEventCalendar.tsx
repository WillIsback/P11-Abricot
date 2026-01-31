import { PencilLine, Trash2 } from "lucide-react";
import { mapStatusColor, mapStatusLabel } from "@/lib/client.lib";
import Tags from "../ui/Tags";

interface TaskEventCalendarProps {
	title: string;
	date: Date;
	description?: string;
	color?: "red" | "green" | "blue" | "yellow" | "purple";
	status?: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
}

export default function TaskEventCalendar({
	title,
	description,
	status,
}: TaskEventCalendarProps) {
	console.log(status);
	return (
		<div className="flex flex-col py-6.25 px-10 bg-white rounded-[10px] gap-7.75 border border-gray-200">
			<div className="flex justify-between">
				<div className="flex flex-col gap-1.75">
					<h5>{title}</h5>
					<p className="body-s text-gray-600">{description}</p>
				</div>
				{status && (
					<Tags label={mapStatusLabel[status]} color={mapStatusColor[status]} />
				)}
			</div>
			<div className="flex flex-row gap-3.75 items-center">
				<div className="flex gap-2 flex-nowrap items-center">
					<Trash2 size={14} stroke="#6B7280" />
					<span className="text-gray-600 body-xs">Supprimer</span>
				</div>
				<span className="text-gray-400 text-[11px]">|</span>
				<div className="flex gap-2  flex-nowrap items-center">
					<PencilLine size={14} stroke="#6B7280" />
					<span className="text-gray-600 body-xs">Modifier</span>
				</div>
			</div>
		</div>
	);
}
