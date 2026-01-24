import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import ProjectBanner from "@/components/ui/ProjectBanner";
import { notFound } from 'next/navigation'
import Workers from "@/components/ui/Workers";
import TaskProject from "@/components/Tasks/TaskProject/TaskProject";

type TagColor = 'gray' | 'orange' | 'info' | 'warning' | 'error' | 'success'

const project = 
  {
    name: "Projet P6",
    description: "Projet de coach sportif en ligne",
    todo: 4,
    completed: 4,
    team: 2,
    creator:'WD',
    assignees: [{intial: 'BG', firstName: 'Bertrand', lastName: 'Guitombo'}, {intial: 'VL', firstName: 'Valerie', lastName:'Lanvin'}],
    slug: 'P6'
  }

const tasks = [
  {
    name: "Tâche 1",
    description: "Faire la mise au point des sizes",
    projectName: "P11-Saas",
    dueDate: "2026-03-07" as unknown as Date,
    comments: 2,
    tag:{label: 'A faire', color:'error' as TagColor}
  },
  {
    name: "Tâche 2",
    description: "Activer les liens API",
    projectName: "P11-Saas",
    dueDate: "2026-03-14" as unknown as Date,
    comments: 5,
    tag:{label: 'En cours', color:'warning' as TagColor}
  },
  {
    name: "Tâche 0",
    description: "KickOff projet",
    projectName: "P11-Saas",
    dueDate: "2026-02-01" as unknown as Date,
    comments: 5,
    tag:{label: 'Terminée', color:'success' as TagColor}
  },
  {
    name: "Tâche 1",
    description: "Faire la mise au point des sizes",
    projectName: "P11-Saas",
    dueDate: "2026-03-07" as unknown as Date,
    comments: 2,
    tag:{label: 'A faire', color:'error' as TagColor}
  },
  {
    name: "Tâche 2",
    description: "Activer les liens API",
    projectName: "P11-Saas",
    dueDate: "2026-03-14" as unknown as Date,
    comments: 5,
    tag:{label: 'En cours', color:'warning' as TagColor}
  },
  {
    name: "Tâche 0",
    description: "KickOff projet",
    projectName: "P11-Saas",
    dueDate: "2026-02-01" as unknown as Date,
    comments: 5,
    tag:{label: 'Terminée', color:'success' as TagColor}
  }
]

export default async function Projet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if(!slug) return notFound();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <ProjectBanner
            title={project.name}
            description={project.description}
          />
          <Workers 
            contributors={project.team} 
            teamProps={{creator: project.creator, assignees: project.assignees}}
          />
          <ul className="flex flex-col gap-4.25">
              {tasks.map((task)=>{
                  return (
                      <li key={crypto.randomUUID()}>
                          <TaskProject
                              name={task.name}
                              description={task.description}
                              labelProps={task.description}
                              dueDate={task.dueDate}
                              comments={task.comments}
                              assignees={task.assignees}
                          />
                      </li>
                  )
              })}
          </ul>
        </main>
        <Footer />
      </div>
    </div>
  )
}
