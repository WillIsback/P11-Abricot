"use client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FolderOpen, LoaderCircle, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import type * as z from "zod";
import SVGCalendar from "@/assets/icons/calendar.svg";
import { useProjectName } from "@/hooks/CustomHooks";
import { mapStatusColor, mapStatusLabel } from "@/lib/client.lib";
import type { Task } from "@/schemas/backend.schemas";
import CustomButton from "../ui/CustomButton";
import Tags from "../ui/Tags";

type PropType = z.infer<typeof Task>;

export default function TaskThumbnail(props: PropType) {
	const router = useRouter();
	const [isPending, projectName] = useProjectName(props.projectId);
	const formattedDate = format(new Date(props.dueDate), "d MMMM", {
		locale: fr,
	});
	const href = `/projects/${props.projectId}?chips=task&status=${props.status}&search=${props.title}`;
	return (
		<article className="flex justify-between items-center flex-1 rounded-2.5  bg-white py-6.25 px-10 rounded-[10px] border border-gray-200 ">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-1.75">
					<h3>{props.title}</h3>
					<p className="body-s text-gray-600">{props.description}</p>
				</div>
				<div className="flex flex-row gap-3.75 items-center">
					<div className="flex gap-2 min-w-26.75 flex-nowrap items-center">
						<FolderOpen className="fill-gray-400 stroke-white" />
						<span className="text-gray-600 body-xs">
							{isPending ? <LoaderCircle /> : projectName}
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
						<span className="text-gray-600 body-xs">
							{props.comments.length}
						</span>
					</div>
				</div>
			</div>

			{/*PARTIE DROITE*/}
			<div className="flex flex-col items-end w-30.25 gap gap-9.25">
				<Tags
					label={mapStatusLabel[props.status]}
					color={mapStatusColor[props.status]}
				/>
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
