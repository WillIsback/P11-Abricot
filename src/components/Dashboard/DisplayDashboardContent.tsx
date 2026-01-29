'use client';
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Chips from "../ui/Chips";
import DashBoardTasks from "./DashboardTasks";
import DashBoardKanban from "./DashboardKanban";
import { useTasks } from "@/hooks/CustomHooks";
import { isTasks } from "@/lib/utils";
import { LoaderCircle } from 'lucide-react';


export default function DisplayDashboardContent ({}){
  const searchParams = useSearchParams()
  const chips = searchParams.get('chips')
  const search = searchParams.get('search')
  const [isPending, state ] = useTasks();

  if(isPending)return <LoaderCircle/>
  if(!isTasks(state?.data))return<p>error</p>
  
  const q = search?.toLowerCase() ?? "";

  const filteredTasks = state?.data.tasks.filter((t) => {
    const okSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.comments.some((c) => c.content.toLowerCase().includes(q)) ||
      t.assignees.some((a) => a.user.name.toLowerCase().includes(q));
    return okSearch;
  });

  return (
    <div className="flex flex-col mt-15">
      <div className="flex gap-2.5">
        <Chips type='task'/>
        <Chips type="kanban"/>
      </div>
      {chips==='task'
        ? <DashBoardTasks tasks={filteredTasks}/>
        : <DashBoardKanban tasks={state?.data.tasks}/>
      }
      {isPending && <LoaderCircle />}
    </div>
  )
}

