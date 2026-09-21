import { ClipboardList } from 'lucide-react';

import {
  AssignmentCard,
  type Assignment,
  type AssignmentStatus,
} from './AssignmentCard';
import { AssignmentEmptyState } from './AssignmentEmptyState';

interface AssignmentListProps {
  assignments: Assignment[];
  emptyMessage?: string;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
  onStatusChange?: (
    assignment: Assignment,
    status: AssignmentStatus,
  ) => void;
}

export function AssignmentList({
  assignments,
  emptyMessage = 'No assignments found.',
  onEdit,
  onDelete,
  onStatusChange,
}: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <AssignmentEmptyState
        title="No assignments found"
        description={emptyMessage}
      />
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList
          className="h-4 w-4 text-primary"
          aria-hidden="true"
        />

        <h2 className="text-sm font-semibold text-foreground">
          Assignments
        </h2>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {assignments.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  );
}