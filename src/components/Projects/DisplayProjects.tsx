import CardProject from "../ui/CardPoject";
import Link from "next/link";

const projects = [
  {
    name: "Projet P10",
    description: "Machine Learning Projet 10",
    todo: 4,
    completed: 0,
    team: 3,
    creator:'WD',
    assigned: ['BG','VL'],
    slug: 'P10'
  },
  {
    name: "Projet P9",
    description: "Plateforme de partage de photo",
    todo: 12,
    completed: 8,
    team: 4,
    creator:'WD',
    assigned: ['BG','VL','PT','MH'],
    slug: 'P9'
  },
  {
    name: "Projet P8",
    description: "Analyse des données d'une boutique en ligne",
    todo: 4,
    completed: 4,
    team: 1,
    creator:'WD',
    assigned: ['WD'],
    slug: 'P8'
  },
  {
    name: "Projet P7",
    description: "Data analyse du marche immobilier Projet 7",
    todo: 4,
    completed: 0,
    team: 2,
    creator:'WD',
    assigned: ['BG','VL'],
    slug: 'P7'
  },
  {
    name: "Projet P11",
    description: "Saas gestion des projet",
    todo: 12,
    completed: 2,
    team: 3,
    creator:'WD',
    assigned: ['BG','VL'],
    slug: 'P11'
  },
  {
    name: "Projet P6",
    description: "Projet de coach sportif en ligne",
    todo: 4,
    completed: 4,
    team: 2,
    creator:'WD',
    assigned: ['BG','VL'],
    slug: 'P6'
  }
]



export default function DisplayProjects ({}){

  return (
    <div className="mt-15">
      <ul className="flex flex-row gap-x-4 gap-y-16 flex-wrap">
        {projects.map((p) => {
          return (
            <li key={crypto.randomUUID()}>
              <Link href={`/projects/${p.slug}`}>
                <CardProject
                  name={p.name}
                  description={p.description}
                  todo={p.todo}
                  completed={p.completed}
                  team={p.team}
                  creator={p.creator}
                  assigned={p.assigned}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}