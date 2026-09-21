'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AttendanceFiltersProps {
  search: string;
  status: 'all' | 'present' | 'absent' | 'late';
  subject: string;
  subjects: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: 'all' | 'present' | 'absent' | 'late',
  ) => void;
  onSubjectChange: (value: string) => void;
  onClear?: () => void;
}

export function AttendanceFilters({
  search,
  status,
  subject,
  subjects,
  onSearchChange,
  onStatusChange,
  onSubjectChange,
  onClear,
}: AttendanceFiltersProps) {
  const hasFilters =
    search.trim().length > 0 || status !== 'all' || subject !== 'all';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        </div>

        {hasFilters && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="mr-1.5 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search subject..."
            className="pl-9"
            aria-label="Search attendance records"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | 'all'
                | 'present'
                | 'absent'
                | 'late',
            )
          }
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
          aria-label="Filter by attendance status"
        >
          <option value="all">All statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>

        <select
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
          aria-label="Filter by subject"
        >
          <option value="all">All subjects</option>

          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}