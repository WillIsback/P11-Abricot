//src/components/EventCalendar/EventTaskModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskEventCalendar from '../Tasks/TaskEventCalendar';
// Types pour les événements/tâches
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
}

interface EventTaskProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[],
  date: string,
}

export default function EventTaskModal({
  open,
  onOpenChange,
  events,
  date,
}: EventTaskProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
        px-18.25 pt-19.75 pb-9.75
        m-auto flex flex-col justify-between
        bg-white rounded-[10px] items-center gap-14 
        [&_[data-slot=dialog-close]_svg]:stroke-gray-600
        **:data-[slot=dialog-close]:top-6    
        **:data-[slot=dialog-close]:right-6
        min-w-5/12
        "
      >
        <div className="flex flex-col flex-1 gap-10">
          <DialogHeader className="flex gap-2">
            <DialogTitle>Vos tâches du {date}</DialogTitle>
          </DialogHeader>
          {events.length > 0 ? (
            events.map((event) => (
              <TaskEventCalendar 
                key={event.id}
                title={event.title}
                description={event.description}
                color={event.color}
                date={event.date}
                status={event.status}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucune tâche ce jour</p>
          )}
          </div>
      </DialogContent>
    </Dialog>
  );
}


