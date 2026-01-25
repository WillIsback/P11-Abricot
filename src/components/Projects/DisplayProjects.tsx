import CardProject from "../ui/CardPoject";
import Link from "next/link";
import { getAllTasksAllProjects } from "@/action/dashboard.action";


export default async function DisplayProjects ({}){
  const { ok, message, data } = await getAllTasksAllProjects();
  if(!ok || !data) return <p>Error retrieve projects data : {message}</p>

  return (
    <div className="mt-15">
      <ul className="flex flex-row gap-x-4 gap-y-16 flex-wrap">
        {data.projects.map((p) => {
          return (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`}>
                <CardProject {...p}/>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}