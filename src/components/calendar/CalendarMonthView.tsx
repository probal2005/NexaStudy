'use client';

import { CalendarEventCard, type CalendarEvent } from './CalendarEventCard';

interface CalendarMonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
}

function getMonthDays(date: Date): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonthDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    days.push({
      date: new Date(year, month - 1, previousMonthDays - i),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });

    nextDay += 1;
  }

  return days;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isToday(date: Date) {
  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

export function CalendarMonthView({
  currentDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
  onDayClick,
}: CalendarMonthViewProps) {
  const days = getMonthDays(currentDate);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b border-border">
        {weekdays.map((day) => (
          <div
            key={day}
            className="border-r border-border px-2 py-3 text-center text-xs font-semibold text-muted-foreground last:border-r-0 sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map(({ date, currentMonth }) => {
          const key = dateKey(date);

          const dayEvents = events.filter(
            (event) => event.date === key,
          );

          return (
            <div
              key={key}
              className={`min-h-[110px] border-b border-r border-border p-1.5 transition-colors last:border-r-0 sm:min-h-[145px] sm:p-2 ${
                currentMonth
                  ? 'bg-card'
                  : 'bg-muted/20 text-muted-foreground'
              }`}
            >
              <button
                type="button"
                onClick={() => onDayClick?.(date)}
                className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isToday(date)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {date.getDate()}
              </button>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    compact
                    onClick={onEventClick}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                  />
                ))}

                {dayEvents.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onDayClick?.(date)}
                    className="px-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}