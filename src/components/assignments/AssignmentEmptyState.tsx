import {
  ClipboardList,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface AssignmentEmptyStateProps {
  title?: string;
  description?: string;
  onAdd?: () => void;
}

export function AssignmentEmptyState({
  title = 'No assignments yet',
  description = 'Create your first assignment to start tracking your academic work.',
  onAdd,
}: AssignmentEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ClipboardList
          className="h-6 w-6"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onAdd && (
        <Button
          type="button"
          className="mt-5"
          onClick={onAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      )}
    </div>
  );
}