'use client';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

import { PencilIcon, TrashIcon, Ellipsis, MoveLeft } from "lucide-react";
import { deleteTask } from "@/action/task.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type buttonType = 'MoveLeft' | 'Ellipsis';

interface IconButtonProps {
    type: buttonType;
    taskId?: string,
    projectId?: string,
}
export default function IconButton ({ type, projectId, taskId }  : IconButtonProps){
  const [, startTransition] = useTransition();
    const routeur = useRouter();

    const handleTrashClick = () => {
        startTransition(async() => {
            const res = await deleteTask(projectId||'', taskId||'');
            if(!res?.ok){
                console.warn(res?.message)
            } else {
                routeur.refresh();
            }
            
        })
    }
    const handlePencilClick = () => {
        console.log('Pencil Click');
    }

    const handleBackButton = () => {
        routeur.back();
    }
    return (

        <>
        { type==='MoveLeft'
            ?<RouterBackButton handleBackButton={handleBackButton} />
            :<DropdownMenuDestructive handleTrashClick={handleTrashClick} handlePencilClick={handlePencilClick} />
        }
        </>
    )
}

function RouterBackButton({ handleBackButton }: { handleBackButton: () => void }){
    return (
        <button 
            type="button" 
            className="
                w-14.25 h-14.25 rounded-[10px] group flex 
                items-center justify-center border border-gray-200 bg-white 
                hover:border-brand-dark focus:border-brand-dark"
            onClick={handleBackButton}
            >
            <MoveLeft className="w-3.75 stroke-black group-hover:stroke-brand-dark group-focus:stroke-brand-dark"/>
        </button>
    )
}

function DropdownMenuDestructive({ handleTrashClick, handlePencilClick }: { handleTrashClick: () => void; handlePencilClick: () => void }) {

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="w-14.25 h-14.25 rounded-[10px] group flex items-center justify-center border border-gray-200 bg-white hover:border-brand-dark focus:border-brand-dark"
            >
            <Ellipsis className="w-3.75 stroke-gray-600 group-hover:stroke-brand-dark group-focus:stroke-brand-dark"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
                onClick={handlePencilClick}
            >
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
                variant="destructive"
                onClick={handleTrashClick}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  