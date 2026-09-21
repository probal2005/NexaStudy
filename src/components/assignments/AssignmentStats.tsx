import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ListTodo,
} from 'lucide-react';

import { StatCard } from '@/components/analytics/StatCard';

interface AssignmentStatsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export function AssignmentStats({
  total,
  pending,
  inProgress,
  completed,
  overdue,
}: AssignmentStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total"
        value={String(total)}
        description="All assignments"
        icon={ListTodo}
      />

      <StatCard
        title="In Progress"
        value={String(inProgress)}
        description={`${pending} pending`}
        icon={Clock3}
      />

      <StatCard
        title="Completed"
        value={String(completed)}
        description="Finished assignments"
        icon={CheckCircle2}
        trend={completed > 0 ? 'up' : 'neutral'}
        trendValue={`${completed} done`}
      />

      <StatCard
        title="Overdue"
        value={String(overdue)}
        description="Need your attention"
        icon={AlertCircle}
        trend={overdue > 0 ? 'down' : 'neutral'}
        trendValue={
          overdue > 0 ? `${overdue} overdue` : 'All clear'
        }
      />
    </div>
  );
}