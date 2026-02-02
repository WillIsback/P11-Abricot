import TaskKanban from "../Tasks/TaskKanban";

type Task = React.ComponentProps<typeof TaskKanban>;

interface PropsType {
	tasks: Task[];
}

export default function DashBoardKanban({ tasks }: PropsType) {
	const todo = tasks.filter((t) => t.status === "TODO");
	const nbTodo = todo.length;
	const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
	const nbInProgress = inProgress.length;
	const Done = tasks.filter((t) => t.status === "DONE");
	const nbDone = Done.length;

	return (
		<div className="flex flex-col md:flex-row py-10 gap-x-5.5 w-full">
			<section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white w-full md:w-1/3">
				<div className="flex gap-2 items-center">
					<h2>{"A faire"}</h2>
					<span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">
						{nbTodo}
					</span>
				</div>
				<ul className="flex flex-col gap-4">
					{todo.map((t) => {
						return (
							<li key={crypto.randomUUID()}>
								<TaskKanban {...t} />
							</li>
						);
					})}
				</ul>
			</section>
			<section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white w-full md:w-1/3">
				<div className="flex gap-2 items-center">
					<h2>{"En cours"}</h2>
					<span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">
						{nbInProgress}
					</span>
				</div>
				<ul className="flex flex-col gap-4">
					{inProgress.map((t) => {
						return (
							<li key={crypto.randomUUID()}>
								<TaskKanban {...t} />
							</li>
						);
					})}
				</ul>
			</section>
			<section className="flex flex-col px-6 py-10 gap-10.25 rounded-[10px] bg-white w-full md:w-1/3">
				<div className="flex gap-2 items-center">
					<h2>{"Terminées"}</h2>
					<span className="rounded-[50px] bg-gray-200 px-4 py-1 text-gray-600 body-s">
						{nbDone}
					</span>
				</div>
				<ul className="flex flex-col gap-4">
					{Done.map((t) => {
						return (
							<li key={crypto.randomUUID()}>
								<TaskKanban {...t} />
							</li>
						);
					})}
				</ul>
			</section>
		</div>
	);
}
