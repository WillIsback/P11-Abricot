'use client';
import Tags from "@/components/Tags/Tags"
import IconButton from "@/components/IconButton/IconButton"
import SVGCalendar from '@/assets/icons/calendar.svg'
import Assignee from "@/components/Assignee/Assignee"
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Comment from "@/components/Comment/Comment";

import { useState } from "react";

interface ProjectProps {
  name: string;
  description: string;
  labelProps: React.ComponentProps<typeof Tags>;
  dueDate: Date;
  assignees: React.ComponentProps<typeof Assignee>;
  comments: number
}




export default function TaskProject (props : ProjectProps){
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
                <h5>{props.name}</h5>
                <Tags label={props.labelProps.label} color={props.labelProps.color}/>
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
        <Assignee {...props.assignees}/>
      </div>
      <hr className="h-0.5 border-t-0 bg-gray-200" />
      <div className="flex justify-between">
        <p className="body-s text-gray-800">Commentaires<span>({props.comments})</span></p>
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