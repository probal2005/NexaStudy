'use client';

import {
  Filter,
  Search,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export type AssignmentFilterStatus =
  | 'all'
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'overdue';

export type AssignmentFilterPriority =
  | 'all'
  | 'low'
  | 'medium'
  | 'high';

interface AssignmentFiltersProps {
  search: string;
  status: AssignmentFilterStatus;
  priority: AssignmentFilterPriority;
  subject: string;

  subjects: string[];

  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: AssignmentFilterStatus,
  ) => void;
  onPriorityChange: (
    value: AssignmentFilterPriority,
  ) => void;
  onSubjectChange: (value: string) => void;
  onClear?: () => void;
}

export function AssignmentFilters({
  search,
  status,
  priority,
  subject,
  subjects,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSubjectChange,
  onClear,
}: AssignmentFiltersProps) {
  const hasFilters =
    search.trim().length > 0 ||
    status !== 'all' ||
    priority !== 'all' ||
    subject !== 'all';

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter
            className="h-4 w-4 text-primary"
            aria-hidden="true"
          />

          <h2 className="text-sm font-semibold text-foreground">
            Filters
          </h2>
        </div>

        {hasFilters && onClear && (
          <Button
            type="button"
            variant="ghost"
            className="h-8 text-xs"
            onClick={onClear}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search assignments..."
            className="pl-9"
            aria-label="Search assignments"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as AssignmentFilterStatus,
            )
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange(
              event.target.value as AssignmentFilterPriority,
            )
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          value={subject}
          onChange={(event) =>
            onSubjectChange(event.target.value)
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
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
    </section>
  );
}