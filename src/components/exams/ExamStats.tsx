import {
  CalendarCheck2,
  CalendarClock,
  CircleCheck,
  CircleX,
} from 'lucide-react';

import { StatCard } from '@/components/analytics/StatCard';

interface ExamStatsProps {
  total: number;
  upcoming: number;
  completed: number;
  cancelled?: number;
}

export function ExamStats({
  total,
  upcoming,
  completed,
  cancelled = 0,
}: ExamStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Exams"
        value={total}
        description="All scheduled exams"
        icon={CalendarCheck2}
      />

      <StatCard
        title="Upcoming"
        value={upcoming}
        description="Exams still ahead"
        icon={CalendarClock}
      />

      <StatCard
        title="Completed"
        value={completed}
        description="Exams already finished"
        icon={CircleCheck}
        trend={completed > 0 ? 'up' : 'neutral'}
        trendValue={completed > 0 ? 'Done' : undefined}
      />

      <StatCard
        title="Cancelled"
        value={cancelled}
        description="Cancelled examinations"
        icon={CircleX}
      />
    </div>
  );
}