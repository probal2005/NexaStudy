'use client';

import { CalendarEventCard, type CalendarEvent } from './CalendarEventCard';

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function CalendarWeekView({
  currentDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}: CalendarWeekViewProps) {
  const start = startOfWeek(currentDate);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid min-w-[900px] grid-cols-7">
        {days.map((date) => {
          const key = dateKey(date);

          const dayEvents = events.filter(
            (event) => event.date === key,
          );

          const today = new Date();

          const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();

          return (
            <div
              key={key}
              className="min-h-[500px] border-r border-border last:border-r-0"
            >
              <div className="border-b border-border p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  {date.toLocaleDateString('en-IN', {
                    weekday: 'short',
                  })}
                </p>

                <div
                  className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-2 p-2">
                {dayEvents.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                  />
                ))}

                {dayEvents.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No events
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}