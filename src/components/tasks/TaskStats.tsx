import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ListTodo,
} from 'lucide-react';

import { TaskStatCard } from './TaskStatCard';

export interface TaskStatsData {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  inProgress?: number;
  today?: number;
}

interface TaskStatsProps {
  data: TaskStatsData;
}

export function TaskStats({ data }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <TaskStatCard
        title="Total Tasks"
        value={data.total}
        description="All tasks"
        icon={ListTodo}
      />

      <TaskStatCard
        title="Completed"
        value={data.completed}
        description="Finished tasks"
        icon={CheckCircle2}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />

      <TaskStatCard
        title="Pending"
        value={data.pending}
        description="Tasks remaining"
        icon={Clock3}
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <TaskStatCard
        title="Overdue"
        value={data.overdue}
        description="Past their deadline"
        icon={AlertCircle}
        iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
      />
    </div>
  );
}