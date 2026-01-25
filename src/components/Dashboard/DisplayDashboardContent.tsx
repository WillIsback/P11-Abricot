'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import Chips from "../ui/Chips";
import DashBoardTasks from "./DashboardTasks";
import DashBoardKanban from "./DashboardKanban";

import { getAllTasks } from "@/action/dashboard.action";
import { Task as TaskSchema } from "@/schemas/backend.schemas";
import * as z from "zod";

import { LoaderCircle } from 'lucide-react';


type Task = z.infer<typeof TaskSchema>;
type Tasks = Task[];

export default function DisplayDashboardContent ({}){
  const searchParams = useSearchParams()
  const chips = searchParams.get('chips')
  const search = searchParams.get('search')
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState([] as Tasks);

  useEffect(()=>{
    startTransition(async () => {
      const currentTasks = await getAllTasks();
      if(!currentTasks.ok){
        console.log(currentTasks.message)
      } else {
        if(currentTasks.data?.tasks){
          setTasks(currentTasks.data.tasks)
        }
      }
    });
  },[]);

  const taskSearchFilter = useMemo(() => {
    const term = (search || "").toLowerCase().trim();
    if (term.length < 3) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
    );
  }, [search, tasks])

  console.log(tasks)


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
      {isPending && <LoaderCircle />}
    </div>
  )
}

