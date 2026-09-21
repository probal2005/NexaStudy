'use client';

import type { CalendarEventType } from './CalendarEventCard';

interface CalendarLegendProps {
  types?: CalendarEventType[];
}

const colors: Record<CalendarEventType, string> = {
  class: 'bg-blue-500',
  assignment: 'bg-amber-500',
  exam: 'bg-red-500',
  study: 'bg-emerald-500',
  personal: 'bg-purple-500',
  other: 'bg-gray-500',
};

const labels: Record<CalendarEventType, string> = {
  class: 'Class',
  assignment: 'Assignment',
  exam: 'Exam',
  study: 'Study',
  personal: 'Personal',
  other: 'Other',
};

export function CalendarLegend({
  types = [
    'class',
    'assignment',
    'exam',
    'study',
    'personal',
    'other',
  ],
}: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-border bg-card p-3 text-xs text-muted-foreground">
      {types.map((type) => (
        <div key={type} className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${colors[type]}`}
          />
          <span>{labels[type]}</span>
        </div>
      ))}
    </div>
  );
}