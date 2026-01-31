'use client';
import { Trash2 } from 'lucide-react';
import { PencilLine } from 'lucide-react';
import SVGCalendar from '@/assets/icons/calendar.svg'
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { useState } from 'react';
import DatePicker from '../ui/DatePicker';

interface TaskAiProps {
  taskId: string,
  title: string,
  description: string,
  dueDate: string,
  handleDeleteTask: (taskId: string) => void,
  handleEditTask: (taskId: string, formData: FormData) => void,
}

export default function TaskAI ({ taskId, title, description, dueDate, handleDeleteTask, handleEditTask}: TaskAiProps) {
  const [isEditing, setIsEditing] = useState(false)
  const formattedDate = format(new Date(dueDate), 'd MMMM', { locale: fr });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleEditTask(taskId, formData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col py-6.25 px-10 bg-white rounded-[10px] gap-7.75 border border-gray-200">
      {isEditing ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.75'>
            <label className='flex flex-col gap-1'>
              Titre :
              <input type='text' name='title' defaultValue={title} className='border rounded-md bg-gray-50 px-2 py-1'/>
            </label>
            <label className='flex flex-col gap-1'>
              Description :
              <input type='text' name='description' defaultValue={description} className='border rounded-md bg-gray-50 px-2 py-1'/>
            </label>
          </div>
          <div className='flex items-center gap-2'>
            <span>Date d&apos;échéance :</span>
            <DatePicker name='dueDate' variant='short' />
          </div>
          <div className='flex gap-2'>
            <button type='submit' className='px-3 py-1 bg-blue-500 text-white rounded-md text-sm'>
              Enregistrer
            </button>
            <button type='button' onClick={() => setIsEditing(false)} className='px-3 py-1 border rounded-md text-sm'>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1.75'>
            <h5>{title}</h5>
            <p className='body-s text-gray-600'>{description}</p>
          </div>
          <div className='flex flex-col gap-2 w-15.5 flex-nowrap items-center'>
            <SVGCalendar/>
            <span className='text-gray-600 body-xs whitespace-nowrap'>{formattedDate}</span>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-3.75 items-center">
        <button 
          className='flex gap-2 flex-nowrap items-center cursor-pointer' 
          type='button' 
          onClick={() => handleDeleteTask(taskId)}
        >
          <Trash2 size={14} stroke='#6B7280'/>
          <span className='text-gray-600 body-xs'>Supprimer</span>
        </button>

        <span className='text-gray-400 text-[11px]'>|</span>

        <button 
          className='flex gap-2 flex-nowrap items-center cursor-pointer'
          type='button' 
          onClick={() => setIsEditing(!isEditing)}
        >
          <PencilLine size={14} stroke='#6B7280'/>
          <span className='text-gray-600 body-xs'>{isEditing ? 'Annuler' : 'Modifier'}</span>
        </button>
      </div>
    </div>
  )
}