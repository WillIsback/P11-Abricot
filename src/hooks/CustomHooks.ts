

import  { useEffect, useState, useTransition } from 'react'
import { getProjectDetail } from '@/lib/dto.lib';

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