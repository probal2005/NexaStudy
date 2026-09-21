'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ExamStatus, ExamType } from './ExamCard';

interface ExamFiltersProps {
  search: string;
  status: 'all' | ExamStatus;
  type: 'all' | ExamType;
  subject: string;

  subjects?: string[];

  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | ExamStatus) => void;
  onTypeChange: (value: 'all' | ExamType) => void;
  onSubjectChange: (value: string) => void;
  onClear?: () => void;
}

export function ExamFilters({
  search,
  status,
  type,
  subject,
  subjects = [],
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSubjectChange,
  onClear,
}: ExamFiltersProps) {
  const hasFilters =
    search.trim() !== '' ||
    status !== 'all' ||
    type !== 'all' ||
    subject !== 'all';

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Filters</h2>
        </div>

        {hasFilters && onClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search exams..."
            className="pl-9"
            aria-label="Search exams"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as 'all' | ExamStatus,
            )
          }
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="postponed">Postponed</option>
        </select>

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as 'all' | ExamType,
            )
          }
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Filter by exam type"
        >
          <option value="all">All types</option>
          <option value="midterm">Midterm</option>
          <option value="final">Final</option>
          <option value="quiz">Quiz</option>
          <option value="practical">Practical</option>
          <option value="viva">Viva</option>
          <option value="other">Other</option>
        </select>

        <select
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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