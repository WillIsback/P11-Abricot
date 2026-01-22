import TaskKanban from "../Tasks/TaskKanban"

type Task = React.ComponentProps<typeof TaskKanban>;

interface PropsType {
    tasks: Task[];
}

export default function DashBoardKanban ({ tasks }: PropsType){

    const todo = tasks.filter((t)=>t.tag.label === 'A faire')
    const nbTodo = todo.length;
    const inProgress = tasks.filter((t)=>t.tag.label === 'En cours')
    const nbInProgress = inProgress.length;
    const Done = tasks.filter((t)=>t.tag.label === 'Terminée')
    const nbDone = Done.length;

    return (
        <div className="flex row py-10 gap-x-5.5 w-full">
            <section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white">
                <div className="flex gap-2 items-center">
                    <h5>{'A faire'}</h5>
                    <span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">{nbTodo}</span>
                </div>
                <ul className="flex flex-col gap-4">
                    {todo.map((t)=>{
                        return (
                            <li key={crypto.randomUUID()}>
                                <TaskKanban 
                                    name={t.name}
                                    description={t.description}
                                    projectName={t.projectName}
                                    dueDate={t.dueDate}
                                    comments={t.comments}
                                    tag={t.tag}
                                />
                            </li>
                        )
                    })}

                </ul>
            </section>
            <section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white">
                <div className="flex gap-2 items-center">
                    <h5>{'En cours'}</h5>
                    <span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">{nbInProgress}</span>
                </div>
                <ul className="flex flex-col gap-4">
                    {inProgress.map((t)=>{
                        return (
                            <li key={crypto.randomUUID()}>
                                <TaskKanban 
                                    name={t.name}
                                    description={t.description}
                                    projectName={t.projectName}
                                    dueDate={t.dueDate}
                                    comments={t.comments}
                                    tag={t.tag}
                                />
                            </li>
                        )
                    })}

                </ul>
            </section>
            <section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white">
                <div className="flex gap-2 items-center">
                    <h5>{'Terminées'}</h5>
                    <span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">{nbDone}</span>
                </div>
                <ul className="flex flex-col gap-4">
                    {Done.map((t)=>{
                        return (
                            <li key={crypto.randomUUID()}>
                                <TaskKanban 
                                    name={t.name}
                                    description={t.description}
                                    projectName={t.projectName}
                                    dueDate={t.dueDate}
                                    comments={t.comments}
                                    tag={t.tag}
                                />
                            </li>
                        )
                    })}
                </ul>
            </section>
        </div>
    )
}