import SearchBar from "../SearchBar/SearchBar"
import TaskThumbnail from "../Tasks/TaskThumbnail"

type Task = React.ComponentProps<typeof TaskThumbnail>

interface PropsType {
    tasks: Task[]
}

export default function DashBoardTasks ({ tasks }: PropsType){
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
                        <li key={crypto.randomUUID()}>
                            <TaskThumbnail
                                name={task.name}
                                description={task.description}
                                projectName={task.description}
                                dueDate={task.dueDate}
                                comments={task.comments}
                                tag={task.tag}
                            />
                        </li>
                    )
                })}
            </ul>

        </section>
    )
}