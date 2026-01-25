

import  { useEffect, useState, useTransition } from 'react'
import { getProjectNameByID } from '@/lib/dto.lib';

export function useProjectName(projectId: string) {
    const [isPending, startTransition] = useTransition();
    const [projectName, setProjectName] = useState('');
    useEffect(()=>{
        startTransition(async()=>{
            const projectName = await getProjectNameByID(projectId);
            if(!projectName){
                console.log(`Impossible de retrouvé le project name correspondant à cet ID : ${projectId}`)
                setProjectName('')
            }
            else{
                setProjectName(projectName)
            }
        });
    }, [projectId]);
    return [isPending, projectName]
}