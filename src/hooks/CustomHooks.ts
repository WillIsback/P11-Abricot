import  { useEffect, useState, useTransition, use, DependencyList } from 'react'
import { getProjectDetail } from '@/lib/dto.lib';
import { ProjectContext } from '@/contexts/ProjectContext'




/**
 * Hook générique pour les requêtes async
 * Gère loading, data et erreur simplement
 */
function useFetch<T>(
  fetchFn: () => Promise<T | null>,
  dependencies: DependencyList
): [boolean, T | null] {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await fetchFn();
        setData(result ?? null);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return [isPending, data];
}

export function useProjectName(projectId: string) {
  const [isPending, project] = useFetch(
    () => getProjectDetail(projectId),
    [projectId]
  );
  return [isPending, project?.name ?? ''] as const;
}

export function useProjectMembers(projectId: string) {
  const [isPending, project] = useFetch(
    () => getProjectDetail(projectId),
    [projectId]
  );
  return [isPending, project?.members ?? null] as const;
}



export function useProject() {
  const context = use(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}

