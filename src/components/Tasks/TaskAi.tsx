import { Trash2 } from 'lucide-react';
import { PencilLine } from 'lucide-react';

interface TaskAiProps {
  title: string,
  description: string,
}

export default function TaskAI ( {title, description} : TaskAiProps){
  return (
    <div className="flex flex-col py-6.25 px-10 bg-white rounded-[10px] gap-7.75 border border-gray-200">
      <div className='flex flex-col gap-1.75'>
        <h5>{title}</h5>
        <p className='body-s text-gray-600'>{description}</p>
      </div>
        <div className="flex flex-row gap-3.75 items-center">
          <div className='flex gap-2 flex-nowrap items-center'>
            <Trash2 size={14} stroke='#6B7280'/>
            <span className='text-gray-600 body-xs'>Supprimer</span></div>
            <span className='text-gray-400 text-[11px]'>|</span>
          <div className='flex gap-2  flex-nowrap items-center'>
            <PencilLine size={14} stroke='#6B7280'/>
            <span className='text-gray-600 body-xs'>Modifier</span></div>
        </div>
    </div>
  )
}