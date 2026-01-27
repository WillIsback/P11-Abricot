"use client"
import CalendarSVG  from '@/assets/icons/calendar.svg'


import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from 'date-fns/locale';



export default function DatePicker({ name, onValueChange, required = false }: {name: string, onValueChange?: ()=>void ,required?: boolean}) {
  const [date, setDate] = React.useState<Date>()
  // console.log("dueDate :",date)
  return (
    <>
      <input 
        type="hidden" 
        name={name}
        value={date?.toISOString() || ''}
        required={required}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
              data-empty={!date}
              className="data-[empty=true]:text-muted-foreground bg-white min-h-13.25 
              border w-full flex flex-row-reverse justify-between text-gray-800 cursor-pointer"
              variant='ghost'
              
          >
            {date ? <><CalendarSVG/>{format(new Date(date), 'd MMMM yyyy', { locale: fr })}</>  : <>{''}<CalendarSVG/></>}

          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setTimeout(() => onValueChange?.(), 0);
            }}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
