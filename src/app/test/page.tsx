'use client';
import { generateAiTask } from "@/action/mistral.action";
import { Task } from "@/schemas/backend.schemas";
import { Sparkle } from "lucide-react";
import { useActionState } from "react";
import * as z from 'zod';
import IAButton from "@/components/ui/IAButton";
const Tasks = z.object({
    tasks: z.array(Task.passthrough())
});

type TasksInput = z.infer<typeof Tasks>;

const tasks: TasksInput = {
  tasks: [
  {
      "id": "cmkkjdmfr003zrtilpottykor",
      "title": "Intégration API nutrition",
      "description": "Connecter l'app à une API de données nutritionnelles pour les calories et nutriments.",
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": "2024-02-10T00:00:00.000Z",
      "createdAt": "2026-01-19T02:18:48.663Z",
      "updatedAt": "2026-01-19T02:18:48.663Z",
      "projectId": "cmkkjdivp000brtil8aepsbfh",
      "creatorId": "cmkkjdi290000rtilaz2vtrfn",
      "creator": {
          "id": "cmkkjdi290000rtilaz2vtrfn",
          "email": "alice@example.com",
          "name": "Alice Martin"
      },
      "project": {
          "id": "cmkkjdivp000brtil8aepsbfh",
          "name": "Application E-commerce"
      },
      "assignees": [
          {
              "id": "cmkkjdmhr0041rtiln11lyui6",
              "userId": "cmkkjdinu0007rtil5ymzwgaj",
              "taskId": "cmkkjdmfr003zrtilpottykor",
              "assignedAt": "2026-01-19T02:18:48.735Z",
              "user": {
                  "id": "cmkkjdinu0007rtil5ymzwgaj",
                  "email": "henri@example.com",
                  "name": "Henri Laurent",
                  "createdAt": "2026-01-19T02:18:43.770Z",
                  "updatedAt": "2026-01-19T02:18:43.770Z"
              }
          }
      ],
      "comments": [
          {
              "id": "cmkkjdmjp0043rtilvmg2atow",
              "content": "Petit bug détecté sur mobile. À corriger avant la livraison.",
              "taskId": "cmkkjdmfr003zrtilpottykor",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:48.806Z",
              "updatedAt": "2026-01-19T02:18:48.806Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          },
          {
              "id": "cmkkjdml80045rtilm6w32ogr",
              "content": "Documentation mise à jour. Tutoriel d'utilisation créé.",
              "taskId": "cmkkjdmfr003zrtilpottykor",
              "authorId": "cmkkjdinu0007rtil5ymzwgaj",
              "createdAt": "2026-01-19T02:18:48.861Z",
              "updatedAt": "2026-01-19T02:18:48.861Z",
              "author": {
                  "id": "cmkkjdinu0007rtil5ymzwgaj",
                  "email": "henri@example.com",
                  "name": "Henri Laurent",
                  "createdAt": "2026-01-19T02:18:43.770Z",
                  "updatedAt": "2026-01-19T02:18:43.770Z"
              }
          }
      ]
  },
  {
      "id": "cmkkjdnec004zrtilub7u7bie",
      "title": "Développement des graphiques",
      "description": "Implémenter les composants de visualisation avec Chart.js ou D3.js.",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-01-22T00:00:00.000Z",
      "createdAt": "2026-01-19T02:18:49.909Z",
      "updatedAt": "2026-01-19T02:18:49.909Z",
      "projectId": "cmkkjdivp000brtil8aepsbfh",
      "creatorId": "cmkkjdi290000rtilaz2vtrfn",
      "creator": {
          "id": "cmkkjdi290000rtilaz2vtrfn",
          "email": "alice@example.com",
          "name": "Alice Martin"
      },
      "project": {
          "id": "cmkkjdivp000brtil8aepsbfh",
          "name": "Application E-commerce"
      },
      "assignees": [
          {
              "id": "cmkkjdng30051rtilq86f16eq",
              "userId": "cmkkjdiem0004rtil03tvp43h",
              "taskId": "cmkkjdnec004zrtilub7u7bie",
              "assignedAt": "2026-01-19T02:18:49.972Z",
              "user": {
                  "id": "cmkkjdiem0004rtil03tvp43h",
                  "email": "emma@example.com",
                  "name": "Emma Rousseau",
                  "createdAt": "2026-01-19T02:18:43.438Z",
                  "updatedAt": "2026-01-19T02:18:43.438Z"
              }
          },
          {
              "id": "cmkkjdnic0053rtilm3tyo9k9",
              "userId": "cmkkjdinu0007rtil5ymzwgaj",
              "taskId": "cmkkjdnec004zrtilub7u7bie",
              "assignedAt": "2026-01-19T02:18:50.052Z",
              "user": {
                  "id": "cmkkjdinu0007rtil5ymzwgaj",
                  "email": "henri@example.com",
                  "name": "Henri Laurent",
                  "createdAt": "2026-01-19T02:18:43.770Z",
                  "updatedAt": "2026-01-19T02:18:43.770Z"
              }
          }
      ],
      "comments": [
          {
              "id": "cmkkjdnkd0055rtilu2e8fc28",
              "content": "Petit bug détecté sur mobile. À corriger avant la livraison.",
              "taskId": "cmkkjdnec004zrtilub7u7bie",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:50.126Z",
              "updatedAt": "2026-01-19T02:18:50.126Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          },
          {
              "id": "cmkkjdnmc0057rtiluogfczq7",
              "content": "Documentation mise à jour. Tutoriel d'utilisation créé.",
              "taskId": "cmkkjdnec004zrtilub7u7bie",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:50.196Z",
              "updatedAt": "2026-01-19T02:18:50.196Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          },
          {
              "id": "cmkkjdno10059rtillw9ntxwk",
              "content": "Tests de charge effectués. Performance satisfaisante.",
              "taskId": "cmkkjdnec004zrtilub7u7bie",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:50.258Z",
              "updatedAt": "2026-01-19T02:18:50.258Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          }
      ]
  },
  {
      "id": "cmkkjdl7o002prtilh8ntacf1",
      "title": "Module de gestion des congés",
      "description": "Développer le système de demande et validation des congés avec workflow d'approbation.",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "createdAt": "2026-01-19T02:18:47.076Z",
      "updatedAt": "2026-01-19T02:18:47.076Z",
      "projectId": "cmkkjdivp000brtil8aepsbfh",
      "creatorId": "cmkkjdi290000rtilaz2vtrfn",
      "creator": {
          "id": "cmkkjdi290000rtilaz2vtrfn",
          "email": "alice@example.com",
          "name": "Alice Martin"
      },
      "project": {
          "id": "cmkkjdivp000brtil8aepsbfh",
          "name": "Application E-commerce"
      },
      "assignees": [
          {
              "id": "cmkkjdl9f002rrtilvmge2ibi",
              "userId": "cmkkjdiem0004rtil03tvp43h",
              "taskId": "cmkkjdl7o002prtilh8ntacf1",
              "assignedAt": "2026-01-19T02:18:47.140Z",
              "user": {
                  "id": "cmkkjdiem0004rtil03tvp43h",
                  "email": "emma@example.com",
                  "name": "Emma Rousseau",
                  "createdAt": "2026-01-19T02:18:43.438Z",
                  "updatedAt": "2026-01-19T02:18:43.438Z"
              }
          },
          {
              "id": "cmkkjdlbi002trtilvj3rel7y",
              "userId": "cmkkjdihx0005rtil8wzlbs5q",
              "taskId": "cmkkjdl7o002prtilh8ntacf1",
              "assignedAt": "2026-01-19T02:18:47.214Z",
              "user": {
                  "id": "cmkkjdihx0005rtil8wzlbs5q",
                  "email": "francois@example.com",
                  "name": "François Dubois",
                  "createdAt": "2026-01-19T02:18:43.558Z",
                  "updatedAt": "2026-01-19T02:18:43.558Z"
              }
          }
      ],
      "comments": [
          {
              "id": "cmkkjdldf002vrtilb86wj2ra",
              "content": "API nutrition identifiée. Documentation reçue, intégration prévue.",
              "taskId": "cmkkjdl7o002prtilh8ntacf1",
              "authorId": "cmkkjdihx0005rtil8wzlbs5q",
              "createdAt": "2026-01-19T02:18:47.283Z",
              "updatedAt": "2026-01-19T02:18:47.283Z",
              "author": {
                  "id": "cmkkjdihx0005rtil8wzlbs5q",
                  "email": "francois@example.com",
                  "name": "François Dubois",
                  "createdAt": "2026-01-19T02:18:43.558Z",
                  "updatedAt": "2026-01-19T02:18:43.558Z"
              }
          },
          {
              "id": "cmkkjdlfd002xrtilg099dccl",
              "content": "Système de cours opérationnel. Interface d'administration complète.",
              "taskId": "cmkkjdl7o002prtilh8ntacf1",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:47.353Z",
              "updatedAt": "2026-01-19T02:18:47.353Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          }
      ]
  },
  {
      "id": "cmkkjdjvd001brtil3o90l7wi",
      "title": "Conception de la base de données",
      "description": "Créer le schéma de base de données pour les produits, utilisateurs, commandes et paiements.",
      "status": "DONE",
      "priority": "HIGH",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2026-01-19T02:18:45.337Z",
      "updatedAt": "2026-01-19T02:18:45.337Z",
      "projectId": "cmkkjdivp000brtil8aepsbfh",
      "creatorId": "cmkkjdi290000rtilaz2vtrfn",
      "creator": {
          "id": "cmkkjdi290000rtilaz2vtrfn",
          "email": "alice@example.com",
          "name": "Alice Martin"
      },
      "project": {
          "id": "cmkkjdivp000brtil8aepsbfh",
          "name": "Application E-commerce"
      },
      "assignees": [
          {
              "id": "cmkkjdjxa001drtil04svdkfe",
              "userId": "cmkkjdi5k0001rtilh5d62qcw",
              "taskId": "cmkkjdjvd001brtil3o90l7wi",
              "assignedAt": "2026-01-19T02:18:45.406Z",
              "user": {
                  "id": "cmkkjdi5k0001rtilh5d62qcw",
                  "email": "bob@example.com",
                  "name": "Bob Dupont",
                  "createdAt": "2026-01-19T02:18:43.112Z",
                  "updatedAt": "2026-01-19T02:18:43.112Z"
              }
          },
          {
              "id": "cmkkjdjzb001frtil1ylcrc03",
              "userId": "cmkkjdi8i0002rtilzeisftu3",
              "taskId": "cmkkjdjvd001brtil3o90l7wi",
              "assignedAt": "2026-01-19T02:18:45.479Z",
              "user": {
                  "id": "cmkkjdi8i0002rtilzeisftu3",
                  "email": "caroline@example.com",
                  "name": "Caroline Leroy",
                  "createdAt": "2026-01-19T02:18:43.219Z",
                  "updatedAt": "2026-01-19T02:18:43.219Z"
              }
          }
      ],
      "comments": [
          {
              "id": "cmkkjdk1b001hrtilkb22blam",
              "content": "Base de données créée avec succès. Toutes les tables sont en place et les relations sont correctes.",
              "taskId": "cmkkjdjvd001brtil3o90l7wi",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:45.552Z",
              "updatedAt": "2026-01-19T02:18:45.552Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          },
          {
              "id": "cmkkjdk32001jrtilm1kjztuq",
              "content": "API REST en cours de développement. Les endpoints produits et utilisateurs sont terminés.",
              "taskId": "cmkkjdjvd001brtil3o90l7wi",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:45.615Z",
              "updatedAt": "2026-01-19T02:18:45.615Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          },
          {
              "id": "cmkkjdk56001lrtilc2kepzvy",
              "content": "Interface responsive en cours. Les composants de base sont créés, reste à implémenter le panier.",
              "taskId": "cmkkjdjvd001brtil3o90l7wi",
              "authorId": "cmkkjdi290000rtilaz2vtrfn",
              "createdAt": "2026-01-19T02:18:45.690Z",
              "updatedAt": "2026-01-19T02:18:45.690Z",
              "author": {
                  "id": "cmkkjdi290000rtilaz2vtrfn",
                  "email": "alice@example.com",
                  "name": "Alice Martin",
                  "createdAt": "2026-01-19T02:18:42.994Z",
                  "updatedAt": "2026-01-19T02:18:42.994Z"
              }
          }
      ]
  }
        ]
};

export default function TestPage() {
    const boundGenerateAiTask = generateAiTask.bind(null, tasks.tasks);
    const [state, formAction, isPending] = useActionState(boundGenerateAiTask, undefined);
    if(!Tasks.safeParse(tasks).success)return <p>Error</p>
    return (
      <div className="m-auto mt-19.25 flex flex-col justify-between w-149.5 bg-white rounded-[10px] items-center gap-14">
        <div className="flex flex-col w-123.5 gap-10">
          <div className="flex gap-2 items-center">
            <Sparkle className="fill-brand-dark stroke-0"/>
            <h4>Créer une tâche</h4>
          </div>
          <div className="flex flex-col gap-6 min-h-130.75 w-full">
            {isPending ? (
                // Skeleton de chargement
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : state?.ok ? (
                  state?.data?.tasks.map((task, index) => (
                    <div key={index}>
                      <h5>{task.title}</h5>
                      <p>{task.description}</p>
                      <span>{task.dueDate}</span>
                    </div>
                  ))) : (
                    <p></p>
                  )
            }
          </div>
        </div>
        <form
          action={formAction} 
          className="flex w-full gap-3.5 px-8 py-4.5 rounded-[80px] bg-gray-50 justify-between"
        >
            <input 
              type="text"
              name='prompt'
              id="prompt"
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              className="flex-1 focus:outline-0"
            />
            <IAButton />
        </form>
      </div>
    );
}