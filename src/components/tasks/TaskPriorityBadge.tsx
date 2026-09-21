import type { TaskPriority } from './TaskCard';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

const config: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: 'Low',
    className: 'bg-muted text-muted-foreground',
  },
  medium: {
    label: 'Medium',
    className:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  high: {
    label: 'High',
    className:
      'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  },
  urgent: {
    label: 'Urgent',
    className:
      'bg-red-500/10 text-red-700 dark:text-red-400',
  },
};

export function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const item = config[priority];

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}