'use client';

import { Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import type { CalendarEventType } from './CalendarEventCard';

interface CalendarFiltersProps {
  type: 'all' | CalendarEventType;
  subject: string;
  subjects: string[];
  onTypeChange: (type: 'all' | CalendarEventType) => void;
  onSubjectChange: (subject: string) => void;
  onClear?: () => void;
}

export function CalendarFilters({
  type,
  subject,
  subjects,
  onTypeChange,
  onSubjectChange,
  onClear,
}: CalendarFiltersProps) {
  const hasFilters = type !== 'all' || subject !== 'all';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4 text-muted-foreground" />
        Filters
      </div>

      <select
        value={type}
        onChange={(event) =>
          onTypeChange(
            event.target.value as 'all' | CalendarEventType,
          )
        }
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter calendar events by type"
      >
        <option value="all">All event types</option>
        <option value="class">Classes</option>
        <option value="assignment">Assignments</option>
        <option value="exam">Exams</option>
        <option value="study">Study</option>
        <option value="personal">Personal</option>
        <option value="other">Other</option>
      </select>

      <select
        value={subject}
        onChange={(event) => onSubjectChange(event.target.value)}
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter calendar events by subject"
      >
        <option value="all">All subjects</option>

        {subjects.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {hasFilters && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1.5 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}