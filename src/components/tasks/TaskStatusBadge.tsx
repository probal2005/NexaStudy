import type { TaskStatus } from './TaskCard';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const config: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  todo: {
    label: 'To Do',
    className:
      'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  },
  'in-progress': {
    label: 'In Progress',
    className:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  completed: {
    label: 'Completed',
    className:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    className:
      'bg-muted text-muted-foreground',
  },
};

export function TaskStatusBadge({
  status,
}: TaskStatusBadgeProps) {
  const item = config[status];

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}