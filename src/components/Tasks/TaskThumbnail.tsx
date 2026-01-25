import { MessageSquareText } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import SVGCalendar from '@/assets/icons/calendar.svg'
import Tags from '../ui/Tags';
import CustomButton from '../ui/CustomButton';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface PropType {
    id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: string;
    projectId: string;
    creatorId: string;
    assignees: {
        id: string;
        userId: string;
        taskId: string;
        user: {
            id: string;
            email: string;
            name: string;
            createdAt: string;
            updatedAt: string;
        };
        assignedAt: string;
    }[];
    comments: {
        id: string;
        content: string;
        taskId: string;
        authorId: string;
        author: {
            id: string;
            email: string;
            name: string;
            createdAt: string;
            updatedAt: string;
        };
        createdAt: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

type TagColor = 'gray' | 'orange' | 'info' | 'warning' | 'error' | 'success'

export default function TaskThumbnail (props: PropType){

  const formattedDate = format(new Date(props.dueDate), 'd MMMM', { locale: fr });

  const statusColor: Record<PropType['status'], TagColor> = {
    'TODO': 'error',
    'IN_PROGRESS': 'warning',
    'DONE': 'success',
    'CANCELED': 'gray'
  }
  const statusLabel: Record<PropType['status'], string> = {
    'TODO': 'À faire',
    'IN_PROGRESS': 'En cours',
    'DONE': 'Terminée',
    'CANCELED': 'Abandonnée'
  }
  return (
      <div className="flex justify-between items-center w-255.5 rounded-2.5  bg-white py-6.25 px-10 rounded-[10px] border border-gray-200 ">
        <div className="flex flex-col gap-8">
          <div className='flex flex-col gap-1.75'>
            <h5>{props.title}</h5>
            <p className='body-s text-gray-600'>{props.description}</p>
          </div>
          <div className="flex flex-row gap-3.75 items-center">
            <div className='flex gap-2 min-w-26.75 flex-nowrap items-center'>
              <FolderOpen className='fill-gray-400 stroke-white'/>
              <span className='text-gray-600 body-xs'>{'projectName'}</span>
            </div>
            <span className='text-gray-400 text-[11px]'>|</span>
            <div className='flex gap-2 w-15.5 flex-nowrap items-center'>
              <SVGCalendar/><span className='text-gray-600 body-xs whitespace-nowrap'>{formattedDate}</span>
            </div>
              <span className='text-gray-400 text-[11px]'>|</span>
            <div className='flex gap-2 w-15.5 flex-nowrap items-center'>
              <MessageSquareText className='stroke-gray-600' width={15}/>
              <span className='text-gray-600 body-xs'>{props.comments.length}</span>
            </div>
          </div>
        </div>

        {/*PARTIE DROITE*/}
        <div className='flex flex-col items-end w-30.25 gap gap-9.25'>
          <Tags label={statusLabel[props.status]} color={statusColor[props.status]}/>
          <CustomButton
            label='Voir'
            pending={false}
            disabled={false}
            buttonType='button'
          />
        </div>

      </div>
  )
}