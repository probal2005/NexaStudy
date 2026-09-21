'use client';

import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export type CalendarEventType =
  | 'class'
  | 'assignment'
  | 'exam'
  | 'study'
  | 'personal'
  | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: CalendarEventType;
  subject?: string;
  location?: string;
  color?: string;
  reminder?: boolean;
}

interface CalendarEventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onClick?: (event: CalendarEvent) => void;
}

const eventTypeLabels: Record<CalendarEventType, string> = {
  class: 'Class',
  assignment: 'Assignment',
  exam: 'Exam',
  study: 'Study',
  personal: 'Personal',
  other: 'Other',
};

const eventTypeVariants: Record<
  CalendarEventType,
  'default' | 'success' | 'warning' | 'danger'
> = {
  class: 'default',
  assignment: 'warning',
  exam: 'danger',
  study: 'success',
  personal: 'default',
  other: 'default',
};

export function CalendarEventCard({
  event,
  compact = false,
  onEdit,
  onDelete,
  onClick,
}: CalendarEventCardProps) {
  return (
    <article
      className="group rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md"
      style={{
        borderLeftWidth: 3,
        borderLeftColor: event.color || 'hsl(var(--primary))',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onClick?.(event)}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {event.title}
            </h3>

            {!compact && (
              <Badge variant={eventTypeVariants[event.type]}>
                {eventTypeLabels[event.type]}
              </Badge>
            )}
          </div>

          {event.subject && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {event.subject}
            </p>
          )}
        </button>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(event)}
                aria-label={`Edit ${event.title}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDelete(event)}
                aria-label={`Delete ${event.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              <span>
                {event.startTime || '--:--'}
                {event.endTime ? ` - ${event.endTime}` : ''}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{event.date}</span>
          </div>
        </div>
      )}

      {event.description && !compact && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {event.description}
        </p>
      )}
    </article>
  );
}