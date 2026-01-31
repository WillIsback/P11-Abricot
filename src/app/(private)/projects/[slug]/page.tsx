import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type * as z from "zod";
import { profile } from "@/action/auth.action";
import { getProjectTask } from "@/action/project.action";
import DisplayEventCalendar from "@/components/EventCalendar/DisplayEventCalendar";
import Footer from "@/components/Footer/Footer";
import Menu from "@/components/Menu/Menu";
import TaskProject from "@/components/Tasks/TaskProject";
import ProjectBanner from "@/components/ui/ProjectBanner";
import ProjetFilterBar from "@/components/ui/ProjectFilterBar";
import Workers from "@/components/ui/Workers";
import { ProjectProvider } from "@/contexts/ProjectProvider";
import { getInitialsFromName } from "@/lib/client.lib";
import { getProjectDetail } from "@/lib/dto.lib";
import { isUser } from "@/lib/utils";
import type { Task } from "@/schemas/backend.schemas";

interface Tasks {
	tasks: z.infer<typeof Task>[];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProjectDetail(slug);
	return {
		title: project?.name || "Projet",
		description: project?.description || "Détail du projet",
	};
}

const priorityOrder: Record<string, number> = {
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
	URGENT: 3,
};

type ProjetPageProps = {
	searchParams: Promise<{
		chips?: string;
		status?: string;
		search?: string;
	}>;
	params: Promise<{
		slug: string;
	}>;
};

export default async function Projet({
	searchParams,
	params,
}: ProjetPageProps) {
	const { slug } = await params;
	const { chips, status, search } = await searchParams;

	const projectTask = await getProjectTask(slug);
	if (!slug || !projectTask.ok || !projectTask?.data) return notFound();
	const { tasks } = projectTask.data as Tasks;
	const project = await getProjectDetail(slug);
	if (!project) return notFound();
	const { name, description, owner, members } = project;
	if (!chips) {
		redirect(`/projects/${slug}?chips=task`);
	}
	const profileData = await profile();

	if (!profileData.ok)
		return <p>Une erreur est apparue : {profileData.message}</p>;
	if (!isUser(profileData.data))
		return <p>Une erreur est apparue : {profileData.message}</p>;
	const userInitial = getInitialsFromName(profileData.data.user.name);
	const userID = profileData.data.user.id;

	const sortedTasks = [...tasks].sort(
		(t1, t2) => priorityOrder[t2.priority] - priorityOrder[t1.priority],
	);
	const q = search?.toLowerCase() ?? "";

	const filteredTasks = sortedTasks.filter((t) => {
		const okStatus = !status || t.status === status;
		const okSearch =
			!q ||
			t.title.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			t.comments.some((c) => c.content.toLowerCase().includes(q)) ||
			t.assignees.some((a) => a.user.name.toLowerCase().includes(q));
		return okStatus && okSearch;
	});

	return (
		<div className="flex  bg-gray-50">
			<div className="w-360 m-auto mt-0">
				<Menu userInitial={userInitial} />
				<ProjectProvider data={project}>
					<div className="flex pl-11 pr-25 mt-19.5">
						<ProjectBanner
							title={name}
							description={description}
							projectId={slug}
							tasks={tasks}
						/>
					</div>
					<main
						id="main-content"
						className="flex flex-col pb-22.25 pt-12.25 w-1215/1440 gap-8.5 items-center m-auto"
					>
						<Workers owner={owner} members={members} variant="Default" />
						<div className="flex flex-col w-full bg-white rounded-[10px] px-14.75 py-10 gap-10.25">
							<ProjetFilterBar />
							{chips === "task" ? (
								<ul className="flex flex-col gap-4.25">
									{filteredTasks.map((task) => {
										return (
											<li key={task.id}>
												<TaskProject
													task={task}
													projectOwner={project.ownerId}
													projectId={slug}
													currentUserId={userID}
													userInitial={userInitial}
												/>
											</li>
										);
									})}
								</ul>
							) : (
								<DisplayEventCalendar tasks={tasks} />
							)}
						</div>
					</main>
				</ProjectProvider>
				<Footer />
			</div>
		</div>
	);
}
