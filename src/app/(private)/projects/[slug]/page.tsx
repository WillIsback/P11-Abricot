import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import ProjectBanner from "@/components/ui/ProjectBanner";
import { notFound } from 'next/navigation'
import Workers from "@/components/ui/Workers";
import TaskProject from "@/components/Tasks/TaskProject/TaskProject";
import { getProjectTask } from "@/action/project.action";
import { getProjectDetail } from "@/lib/dto.lib";
import { redirect } from "next/navigation"
import ProjetFilterBar from "@/components/ui/ProjectFilterBar";

type ProjetPageProps = {
  searchParams: Promise<{
    chips?: string
  }>,
  params : Promise<{
    slug: string
  }>
}

export default async function Projet({ searchParams, params }: ProjetPageProps) {
  const { slug } = await params;
  const { chips } = await searchParams;

  const projectTask = await getProjectTask(slug);
  if(!slug || !projectTask.ok || !projectTask?.data) return notFound();
  const { tasks } = projectTask.data
  const project = await getProjectDetail(slug)
  if(!project) return notFound();
  const { name, description, owner, members } = project;
  if (!chips) {
    redirect(`/projects/${slug}?chips=task`)
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <div className="flex pl-11 pr-25 mt-19.5">
          <ProjectBanner
              title={name}
              description={description}
            />
        </div>
        <main className="flex flex-col pb-22.25 pt-12.25 w-1215/1440 gap-8.5 items-center m-auto">
          <Workers owner={owner} members={members} variant="Default"/>
          <div className="flex flex-col w-full bg-white rounded-[10px] px-14.75 py-10">
            <ProjetFilterBar />
            <ul className="flex flex-col gap-4.25">
                {tasks.map((task)=>{
                    return (
                        <li key={task.id}>
                            <TaskProject {...task}/>
                        </li>
                    )
                })}
            </ul>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
