import type * as z from "zod";
import type { Task as TaskSchema } from "@/schemas/backend.schemas";
import TaskThumbnail from "../Tasks/TaskThumbnail";
import SearchBar from "../ui/SearchBar";

type Task = z.infer<typeof TaskSchema>;
interface PropsType {
	tasks: Task[];
}

export default function DashBoardTasks({ tasks }: PropsType) {
	return (
		<section className="flex flex-col mt-7.5 py-6 sm:py-10 px-4 sm:px-8 md:px-14.75 gap-6 sm:gap-10.25 bg-white rounded-[10px] w-full">
			<div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
				<div className="flex flex-col gap-2">
					<h2>Mes tâches assignées</h2>
					<p className="body-m text-gray-600">Par ordre de priorité</p>
				</div>
				<SearchBar />
			</div>
			<ul className="flex flex-col gap-4.25">
				{tasks.map((task) => {
					return (
						<li key={task.id}>
							<TaskThumbnail {...task} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
