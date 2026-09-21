'use client';

import { CalendarEventCard, type CalendarEvent } from './CalendarEventCard';

interface CalendarAgendaViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function CalendarAgendaView({
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}: CalendarAgendaViewProps) {
  const sortedEvents = [...events].sort((a, b) => {
    const dateComparison =
      parseDate(a.date).getTime() - parseDate(b.date).getTime();

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  const grouped = sortedEvents.reduce<Record<string, CalendarEvent[]>>(
    (accumulator, event) => {
      if (!accumulator[event.date]) {
        accumulator[event.date] = [];
      }

      accumulator[event.date].push(event);
      return accumulator;
    },
    {},
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No events available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateEvents]) => {
        const parsedDate = parseDate(date);

        return (
          <section key={date}>
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">
                {parsedDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
            </div>

            <div className="space-y-3">
              {dateEvents.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}