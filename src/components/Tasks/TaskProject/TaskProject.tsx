'use client';
import Tags from "@/components/ui/Tags"
import IconButton from "@/components/ui/IconButton"
import SVGCalendar from '@/assets/icons/calendar.svg'
import Assignees from "@/components/ui/Assignees"
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Comment from "@/components/ui/Comment";
import { mapStatusColor, mapStatusLabel } from '@/lib/client.lib';
import { useState } from "react";
import { Task } from "@/schemas/backend.schemas";
import * as z from "zod";





export default function TaskProject (props : z.infer<typeof Task>){
  const [isCollapse, setIsCollapse] = useState(true)
  const formattedDate = format(new Date(props.dueDate), 'd MMMM', { locale: fr });

  return (
    <div className="flex flex-col bg-white w-255.5 rounded-[10px] py-6.25 px-10 gap-6">
      {/* Bloc d'en tête */}
      <div className="flex justify-between">
        {/*Bloc titre projet + tags + description*/}
          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-1.75'>
              <div className="flex items-center gap-2">
                <h5>{props.title}</h5>
                <Tags label={mapStatusLabel[props.status]} color={mapStatusColor[props.status]}/>
              </div>
              <p className='body-s text-gray-600'>{props.description}</p>
            </div>
          </div>
          {/*Bloc bouton paramètre*/}
          <div>
            <IconButton button="Ellipsis"/>
          </div>
        </div>
      {/* Bloc de corps */}
      <div className="flex items-center gap-1">
        <p className="body-xs text-gray-600">Échéance :</p>
        <SVGCalendar stroke={'#1F1F1F'} strokeWidth={0.5}/>
        <span className="body-xs">{formattedDate}</span>
      </div>
      <div className="flex items-center gap-1">
        <p>Assigné à :</p>
        <Assignees assignee={props.assignees}/>
      </div>
      <hr className="h-0.5 border-t-0 bg-gray-200" />
      <div className="flex justify-between">
        <p className="body-s text-gray-800">Commentaires<span>({props.comments.length})</span></p>
        <button type="button"
          onClick={(e)=> {setIsCollapse(!isCollapse); e.preventDefault()}}
        >
          {isCollapse
            ? <ChevronUp stroke="#0F0F0F"/>
            : <ChevronDown stroke="#0F0F0F"/>
          }
        </button>
      </div>
        {isCollapse && <Comment/>}
    </div>
  )
}