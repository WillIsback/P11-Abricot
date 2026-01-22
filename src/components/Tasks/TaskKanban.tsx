import { MessageSquareText } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import SVGCalendar from '@/assets/icons/calendar.svg'
import Tags from '../Tags/Tags';
import CustomButton from '../CustomButton/CustomButton';

export default function TaskKanban ({}){
  return (
    <div className='flex flex-col rounded-[10px] bg-white px-10 py-6.25 gap-8'>
      <div className='flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1.75'>
            <h5>Nom de la tâche</h5>
            <p className='body-s text-gray-600'>Description de la tâche</p>
          </div>
          <Tags label='À faire' color='error'/>
        </div>
        <div className="flex flex-row gap-3.75 items-center">
          <div className='flex gap-2 w-26.75 flex-nowrap items-center'><FolderOpen className='fill-gray-400 stroke-white'/><span className='text-gray-600 body-xs whitespace-nowrap'>Nom du projet</span></div>
            <span className='text-gray-400 text-[11px]'>|</span>
          <div className='flex gap-2 w-15.5 flex-nowrap items-center'><SVGCalendar/><span className='text-gray-600 body-xs whitespace-nowrap'>9 mars</span></div>
            <span className='text-gray-400 text-[11px]'>|</span>
          <div className='flex gap-2 w-15.5 flex-nowrap items-center'><MessageSquareText className='stroke-gray-600' width={15}/><span className='text-gray-600 body-xs whitespace-nowrap'>2</span></div>
        </div>
      </div>
        <div className='w-30.25'>
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