import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import ProjectBanner from "@/components/ui/ProjectBanner";
import { notFound } from 'next/navigation'
import Workers from "@/components/ui/Workers";


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
          <Workers contributors={project.team} teamProps={{creator: project.creator, assignees: project.assignees}}/>
        </main>
        <Footer />
      </div>
    </div>
  )
}
