'use client';

import { Plus } from 'lucide-react';
import {
  SubtaskItem,
  type Subtask,
} from './SubtaskItem';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle?: (subtask: Subtask) => void;
  onEdit?: (subtask: Subtask) => void;
  onDelete?: (subtask: Subtask) => void;
  onAdd?: () => void;
}

export function SubtaskList({
  subtasks,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
}: SubtaskListProps) {
  const completed = subtasks.filter(
    (subtask) => subtask.completed,
  ).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Subtasks</h4>

          <p className="text-xs text-muted-foreground">
            {completed} of {subtasks.length} completed
          </p>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="rounded-lg border p-1">
          {subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}