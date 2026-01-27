import  { useEffect, useState, useTransition, use } from 'react'
import { getProjectDetail } from '@/lib/dto.lib';
import { ProjectMember } from '@/schemas/backend.schemas';
import { ProjectContext } from '@/contexts/ProjectContext'

import * as z from 'zod';

export function useProjectName(projectId: string) {
    const [isPending, startTransition] = useTransition();
    const [projectName, setProjectName] = useState('');
    useEffect(()=>{
        startTransition(async()=>{
            const project = await getProjectDetail(projectId);
            if(!project){
                console.log(`Impossible de retrouvé le project name correspondant à cet ID : ${projectId}`)
                setProjectName('')
            }
            else{
                setProjectName(project.name)
            }
        });
    }, [projectId]);
    return [isPending, projectName]
}

type ProjectMembers = z.infer<typeof ProjectMember>[] | null;


export function useProjectMembers(projectId: string) {
    const [isPending, startTransition] = useTransition();
    const [projetMembers, setprojetMembers] = useState<ProjectMembers>(null);
    useEffect(()=>{
        startTransition(async()=>{
            const project = await getProjectDetail(projectId);
            if(!project){
                console.log(`Impossible de retrouvé le project name correspondant à cet ID : ${projectId}`)
                setprojetMembers(null)
            }
            else{
                setprojetMembers(project.members)
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);
    return [isPending, projetMembers]
}



export function useProject() {
  const context = use(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}