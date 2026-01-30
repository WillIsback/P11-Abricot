'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventTaskModal from '@/components/EventCalendar/EventTaskModal';

// Types pour les événements/tâches
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
}

interface EventCalendarProps {
  events?: CalendarEvent[];
  onDayClick?: (date: Date) => void;
  open: boolean
  setIsEventTaskOpen: (open: boolean) => void;
}

export default function EventCalendar({
  events = [],
  onDayClick,
  open,
  setIsEventTaskOpen,
}: EventCalendarProps) {
  // État pour le mois actuellement affiché
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // État pour le jour sélectionné
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Navigation entre les mois
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Générer les jours à afficher dans la grille
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  // Filtrer les événements pour un jour donné
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  // Gestion du clic sur un jour
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDayClick?.(date);
  };

  // Gestion du double-clic pour créer un événement
  const handleDayDoubleClick = () => {
    setIsEventTaskOpen(true);
  };

  // Noms des jours de la semaine
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Couleurs pour les événements
  const eventColors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="h-fit w-full max-w-4xl mx-auto p-4">
      {/* Header avec navigation */}
      <header className="flex items-center justify-between mb-6">
        <h2 className="capitalize body-l">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-md border hover:bg-gray-100"
          >
            Aujourd&apos;hui
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Grille du calendrier */}
      <div className="border rounded-lg overflow-hidden">
        {/* En-tête des jours de la semaine */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                onDoubleClick={() => handleDayDoubleClick()}
                className={`
                  min-h-24 p-2 border-b border-r cursor-pointer
                  transition-colors hover:bg-gray-50
                  ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'}
                  ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}
                `}
              >
                {/* Numéro du jour */}
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-sm rounded-full
                    ${isTodayDate ? 'bg-blue-600 text-white font-bold' : ''}
                    ${isSelected && !isTodayDate ? 'bg-blue-100' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {/* Liste des événements du jour */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={`
                        text-xs p-1 rounded truncate text-white cursor-pointer
                        hover:opacity-80 transition-opacity
                        ${eventColors[event.color || 'blue']}
                      `}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {/* Indicateur s'il y a plus d'événements */}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {(open && selectedDate)&&(
        <EventTaskModal
          open={open}
          onOpenChange={setIsEventTaskOpen}
          events={getEventsForDay(selectedDate)}
          date={format(new Date(selectedDate), 'd MMMM', { locale: fr })}
        />
      )}

    </div>
  );
}
