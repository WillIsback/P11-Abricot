
import SearchBar from "../ui/SearchBar"
import TaskThumbnail from "../Tasks/TaskThumbnail"
import { Task as TaskSchema } from "@/schemas/backend.schemas";
import * as z from "zod";

type Task = z.infer<typeof TaskSchema>;
interface PropsType {
    tasks: Task[]
}

export default function DashBoardTasks ( { tasks } : PropsType){
    return (
        <section className="flex flex-col mt-7.5 py-10 px-14.75 gap-10.25 bg-white rounded-[10px] w-full">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h5>Mes tâches assignées</h5>
                    <p className="body-m text-gray-600">Par ordre de priorité</p>
                </div>
                <div>
                    <SearchBar />
                </div>
            </div>
            <ul className="flex flex-col gap-4.25">
                {tasks.map((task)=>{
                    return (
                        <li key={task.id}>
                            <TaskThumbnail {...task} />
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}