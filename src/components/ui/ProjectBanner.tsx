'use client';
import CustomButton from "./CustomButton"
import IAButtonSquare from "./IAButtonSquare";
import CustomLink from "./CustomLink";
import IconButton from "./IconButton";
import { useState } from "react";
import CreateTask from "../Tasks/Modal/CreateTask";
import { Task } from "@/schemas/backend.schemas";

import * as z from 'zod';

type NewTask = z.infer<typeof Task>

interface ProjectBannerProps {
  title: string;
  description: string;
  projectId: string;
}


export default function ProjectBanner (props: ProjectBannerProps){
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [tasks, setTasks] = useState<NewTask[]>([]);
  const handleTaskCreated = (newTask: NewTask) => {
    setTasks([...tasks, newTask]);
    console.log('Nouvelle tâche créée !', newTask);
  };

  return (
    <section className="flex justify-between w-full" aria-label="Banniere">
      <div className="flex gap-4">
        <IconButton button="MoveLeft"/>
        <div className="flex flex-col gap-3.5 justify-center">
          <div className="flex justify-between gap-4 w-57.75 items-center">
            <h4 className="whitespace-nowrap">{props.title}</h4>
            <CustomLink label='Modifier' link="#edit"/>
          </div>
          <p>{props.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CustomButton
          onClick={() => setIsCreateTaskOpen(true)}
          label="Créer une tâche"
          pending={false}
          disabled={false}
          buttonType="button"
        />
        <IAButtonSquare />
      </div>
      {/* Modal de création de tâche */}
      <CreateTask
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={props.projectId}
        onTaskCreated={handleTaskCreated}
      />
    </section>
  )
}