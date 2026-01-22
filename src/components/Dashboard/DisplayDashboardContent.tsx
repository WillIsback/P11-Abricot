'use client';
import { useSearchParams } from "next/navigation";


import Chips from "../Chips/Chips";
import DashBoardTasks from "./DashboardTasks";

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
  }
]

export default function DisplayDashboardContent ({}){
  const searchParams = useSearchParams()
  const chips = searchParams.get('chips')




  return (
    <div className="flex flex-col mt-15">
      <div className="flex gap-2.5">
        <Chips type='task'/>
        <Chips type="kanban"/>
      </div>
      {chips==='task'&&
        <DashBoardTasks tasks={tasks}/>
      }
    </div>
  )
}