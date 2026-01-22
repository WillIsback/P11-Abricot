import { MessageSquareText } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import SVGCalendar from '@/assets/icons/calendar.svg'
import Tags from '../Tags/Tags';
import CustomButton from '../CustomButton/CustomButton';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface PropType {
  name: string;
  description: string;
  projectName: string;
  dueDate: Date;
  comments: number
  tag: React.ComponentProps<typeof Tags>
}

export default function TaskThumbnail ({ name, description, projectName, dueDate, comments, tag }: PropType){
  
  const formattedDate = format(new Date(dueDate), 'd MMMM', { locale: fr });
  return (
      <div className="flex justify-between items-center w-255.5 rounded-2.5  bg-white py-6.25 px-10 rounded-[10px] border border-gray-200 ">
        <div className="flex flex-col gap-8">
          <div className='flex flex-col gap-1.75'>
            <h5>{name}</h5>
            <p className='body-s text-gray-600'>{description}</p>
          </div>
          <div className="flex flex-row gap-3.75 items-center">
            <div className='flex gap-2 min-w-26.75 flex-nowrap items-center'>
              <FolderOpen className='fill-gray-400 stroke-white'/>
              <span className='text-gray-600 body-xs'>{projectName}</span>
            </div>
            <span className='text-gray-400 text-[11px]'>|</span>
            <div className='flex gap-2 w-15.5 flex-nowrap items-center'>
              <SVGCalendar/><span className='text-gray-600 body-xs whitespace-nowrap'>{formattedDate}</span>
            </div>
              <span className='text-gray-400 text-[11px]'>|</span>
            <div className='flex gap-2 w-15.5 flex-nowrap items-center'>
              <MessageSquareText className='stroke-gray-600' width={15}/>
              <span className='text-gray-600 body-xs'>{comments}</span>
            </div>
          </div>
        </div>

        {/*PARTIE DROITE*/}
        <div className='flex flex-col items-end w-30.25 gap gap-9.25'>
          <Tags label={tag.label} color={tag.color}/>
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