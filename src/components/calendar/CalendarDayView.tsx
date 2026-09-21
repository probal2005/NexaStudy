'use client';

import { CalendarEventCard, type CalendarEvent } from './CalendarEventCard';

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function CalendarDayView({
  currentDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}: CalendarDayViewProps) {
  const key = dateKey(currentDate);

  const dayEvents = events
    .filter((event) => event.date === key)
    .sort((a, b) =>
      (a.startTime || '').localeCompare(b.startTime || ''),
    );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {currentDate.toLocaleDateString('en-IN', {
            weekday: 'long',
          })}
        </p>

        <h2 className="mt-1 text-2xl font-bold text-foreground">
          {currentDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h2>
      </div>

      {dayEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-14 text-center">
          <p className="text-sm text-muted-foreground">
            No events scheduled for this day.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <CalendarEventCard
              key={event.id}
              event={event}
              onClick={onEventClick}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}