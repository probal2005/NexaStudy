'use client';

import {
  CheckCircle2,
  ClipboardList,
  Flame,
  GraduationCap,
} from 'lucide-react';

import DashboardStatCard from './DashboardStatCard';

export interface DashboardStatsData {
  tasksCompleted: number;
  totalTasks: number;
  attendance: number;
  assignmentsDue: number;
  currentStreak: number;
}

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  const taskRate =
    stats.totalTasks > 0
      ? Math.round(
          (stats.tasksCompleted / stats.totalTasks) * 100,
        )
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Tasks completed"
        value={`${stats.tasksCompleted}/${stats.totalTasks}`}
        description={`${taskRate}% completion rate`}
        icon={CheckCircle2}
        trend="up"
        trendValue={`${taskRate}%`}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />

      <DashboardStatCard
        title="Attendance"
        value={`${stats.attendance}%`}
        description="Overall attendance"
        icon={GraduationCap}
        trend={
          stats.attendance >= 75
            ? 'up'
            : stats.attendance >= 60
              ? 'neutral'
              : 'down'
        }
        trendValue={
          stats.attendance >= 75
            ? 'On track'
            : 'Needs attention'
        }
        iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      />

      <DashboardStatCard
        title="Assignments due"
        value={stats.assignmentsDue}
        description="Upcoming submissions"
        icon={ClipboardList}
        trend={stats.assignmentsDue > 3 ? 'down' : 'neutral'}
        trendValue={
          stats.assignmentsDue > 3 ? 'Busy' : 'Manageable'
        }
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <DashboardStatCard
        title="Study streak"
        value={`${stats.currentStreak} days`}
        description="Keep the momentum going"
        icon={Flame}
        trend="up"
        trendValue="Active"
        iconClassName="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      />
    </div>
  );
}