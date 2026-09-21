'use client';

import { Plus } from 'lucide-react';

import {
  TaskCard,
  type Task,
  type TaskStatus,
} from './TaskCard';

interface TaskKanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAdd?: (status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (
    task: Task,
    status: TaskStatus,
  ) => void;
}

const columnStyles: Record<TaskStatus, string> = {
  todo: 'border-slate-500/20 bg-slate-500/5',
  'in-progress': 'border-blue-500/20 bg-blue-500/5',
  completed: 'border-emerald-500/20 bg-emerald-500/5',
  cancelled: 'border-muted bg-muted/20',
};

export function TaskKanbanColumn({
  status,
  title,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskKanbanColumnProps) {
  return (
    <section
      className={`min-w-[290px] flex-1 rounded-xl border p-3 ${columnStyles[status]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>

          <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(status)}
            aria-label={`Add task to ${title}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            compact
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed bg-background/50 p-6 text-center text-xs text-muted-foreground">
            No tasks here
          </div>
        )}
      </div>
    </section>
  );
}