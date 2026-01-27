import  { useEffect, useState, useTransition, use } from 'react'
import { getProjectDetail } from '@/lib/dto.lib';
import { ProjectMember, User } from '@/schemas/backend.schemas';
import { ProjectContext } from '@/contexts/ProjectContext'
import { searchUser } from '@/action/user.action';
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

// Type simplifié pour les utilisateurs retournés par la recherche (sans createdAt/updatedAt)
type SearchUser = Pick<z.infer<typeof User>, 'id' | 'email' | 'name'>;

export function useSearchUser(query: string): [boolean, SearchUser[]] {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<SearchUser[]>([]);

  useEffect(() => {
    // Ne pas lancer de recherche si query est vide ou trop court
    if (!query || query.trim().length < 2) {
      startTransition(() => setUsers([]));
      return;
    }

    startTransition(async () => {
      const res = await searchUser(query);
      if (!res?.ok) {
        console.warn(`Aucun utilisateur trouvé pour : "${query}"`);
        setUsers([]);
      } else if (res.data) {
        setUsers(res.data);
      }
    });
  }, [query]);

  return [isPending, users];
}