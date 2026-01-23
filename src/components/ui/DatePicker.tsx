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




export default function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground bg-white min-h-13.25 justify-center text-gray-950 focus:bg-white hover:bg-white"
        >
          {date ? format(date, "PPP") : <CalendarSVG />}

        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
