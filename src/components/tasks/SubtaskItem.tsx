'use client';

import { Check, Pencil, Trash2 } from 'lucide-react';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle?: (subtask: Subtask) => void;
  onEdit?: (subtask: Subtask) => void;
  onDelete?: (subtask: Subtask) => void;
}

export function SubtaskItem({
  subtask,
  onToggle,
  onEdit,
  onDelete,
}: SubtaskItemProps) {
  return (
    <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/60">
      <button
        type="button"
        onClick={() => onToggle?.(subtask)}
        aria-label={
          subtask.completed
            ? 'Mark subtask incomplete'
            : 'Mark subtask complete'
        }
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          subtask.completed
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/40 hover:border-primary'
        }`}
      >
        {subtask.completed && <Check className="h-3.5 w-3.5" />}
      </button>

      <span
        className={`min-w-0 flex-1 text-sm ${
          subtask.completed
            ? 'text-muted-foreground line-through'
            : ''
        }`}
      >
        {subtask.title}
      </span>

      <div className="flex opacity-0 transition group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(subtask)}
            aria-label="Edit subtask"
            className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(subtask)}
            aria-label="Delete subtask"
            className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}