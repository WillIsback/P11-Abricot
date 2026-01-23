'use client';
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import Chips from "../ui/Chips";
import DashBoardTasks from "./DashboardTasks";
import DashBoardKanban from "./DashboardKanban";

type TagColor = 'gray' | 'orange' | 'info' | 'warning' | 'error' | 'success'

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



export default function DisplayDashboardContent ({}){
  const searchParams = useSearchParams()
  const chips = searchParams.get('chips')
  const search = searchParams.get('search')

  const taskSearchFilter = useMemo(() => {
    if(search && search.length > 3){
      return tasks.filter((t)=>t.name.includes(search) || t.description.includes(search) || t.projectName.includes(search))
    }
    return tasks;
  }, [search])




  return (
    <div className="flex flex-col mt-15">
      <div className="flex gap-2.5">
        <Chips type='task'/>
        <Chips type="kanban"/>
      </div>
      {chips==='task'
        ? <DashBoardTasks tasks={taskSearchFilter}/>
        : <DashBoardKanban tasks={taskSearchFilter}/>
      }
    </div>
  )
}