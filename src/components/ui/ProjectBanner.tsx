'use client';
import CustomButton from "./CustomButton"
import IAButtonSquare from "./IAButtonSquare";
import CustomLink from "./CustomLink";
import IconButton from "./IconButton";
import { useState } from "react";
import CreateTask from "../Tasks/Modal/CreateTask";
import UpdateProject from "../Projects/Modal/UpdateProject";
import CreateAiTask from "../Tasks/Modal/CreateAiTask";
import { Task } from "@/schemas/backend.schemas";
import * as z from 'zod';

const tasksZodSchema = z.array(Task)
type TasksType = z.infer<typeof tasksZodSchema>

interface ProjectBannerProps {
  title: string;
  description: string;
  projectId: string;
  tasks: TasksType
}


export default function ProjectBanner (props: ProjectBannerProps){
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isUpdateProject, setIsUpdateTaskOpen] = useState(false);
  const [isCreateAiTaskOpen, setIsCreateAiTaskOpen] = useState(false);

  return (
    <section className="flex justify-between w-full" aria-label="Banniere">
      <div className="flex gap-4">
        <IconButton type="MoveLeft"/>
        <div className="flex flex-col gap-3.5 justify-center">
          <div className="flex justify-between gap-4 w-57.75 items-center">
            <h4 className="whitespace-nowrap">{props.title}</h4>
            <CustomLink
              label='Modifier'
              type='Opener'
              onClickHandler={()=> setIsUpdateTaskOpen(true)}
            />
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
        <IAButtonSquare
          onClick={()=>setIsCreateAiTaskOpen(true)}
        />
      </div>
      {/* Modal de création de tâche */}
      <CreateTask
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={props.projectId}
      />
      {/* Modal de modification de projet */}
      <UpdateProject
        open={isUpdateProject}
        onOpenChange={setIsUpdateTaskOpen}
        projectId={props.projectId}
      />
      {/* Modal de création de tâche assisté par IA*/}
      <CreateAiTask
        open={isCreateAiTaskOpen}
        onOpenChange={setIsCreateAiTaskOpen}
        projectId={props.projectId}
        tasks={props.tasks}
      />
    </section>
  )
}