import Link from "next/link";
import { getAllProjects, getProjectTask } from "@/action/project.action";
import { isProjects, isTasks } from "@/lib/utils";
import CardProject from "../ui/CardPoject";

export default async function DisplayProjects() {
	const { ok, message, data } = await getAllProjects();
	if (!ok || !isProjects(data))
		return <p>Error retrieve projects data : {message}</p>;

	return (
		<div className="mt-15">
			<ul className="flex flex-row gap-x-4 gap-y-16 flex-wrap">
				{data.projects.map(async (p) => {
					const res = await getProjectTask(p.id);

					if (!res.ok || !isTasks(res.data))
						return <p key={p.id}>erreur de recuperations des tâches projet</p>;
					return (
						<li key={p.id}>
							<Link href={`/projects/${p.id}`}>
								<CardProject
									name={p.name}
									description={p.description}
									owner={p.owner}
									members={p.members}
									tasks={res.data.tasks}
								/>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
