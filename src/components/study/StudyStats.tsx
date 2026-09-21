import {
  BookOpen,
  Clock3,
  Flame,
  Target,
} from 'lucide-react';

import { StudyStatCard } from './StudyStatCard';

export interface StudyStatsData {
  totalStudyMinutes: number;
  sessionsCompleted: number;
  activeGoals: number;
  currentStreak: number;
  weeklyStudyMinutes?: number;
  previousWeeklyStudyMinutes?: number;
}

interface StudyStatsProps {
  data: StudyStatsData;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

function getWeeklyTrend(
  current: number,
  previous: number | undefined,
): { trend: 'up' | 'down' | 'neutral'; value?: string } {
  if (previous === undefined || previous === 0) {
    return { trend: 'neutral' };
  }

  const percentage = Math.round(((current - previous) / previous) * 100);

  if (percentage === 0) {
    return {
      trend: 'neutral',
      value: 'No change from last week',
    };
  }

  return {
    trend: percentage > 0 ? 'up' : 'down',
    value: `${percentage > 0 ? '+' : ''}${percentage}% vs last week`,
  };
}

export function StudyStats({ data }: StudyStatsProps) {
  const weeklyTrend = getWeeklyTrend(
    data.weeklyStudyMinutes ?? data.totalStudyMinutes,
    data.previousWeeklyStudyMinutes,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StudyStatCard
        title="Study Time"
        value={formatMinutes(data.totalStudyMinutes)}
        description="Total tracked study time"
        icon={Clock3}
        trend={weeklyTrend.trend}
        trendValue={weeklyTrend.value}
      />

      <StudyStatCard
        title="Sessions"
        value={data.sessionsCompleted}
        description="Completed study sessions"
        icon={BookOpen}
      />

      <StudyStatCard
        title="Active Goals"
        value={data.activeGoals}
        description="Goals currently in progress"
        icon={Target}
      />

      <StudyStatCard
        title="Study Streak"
        value={`${data.currentStreak} days`}
        description="Consecutive study days"
        icon={Flame}
        trend={data.currentStreak > 0 ? 'up' : 'neutral'}
        trendValue={
          data.currentStreak > 0
            ? 'Keep the streak going'
            : 'Start studying today'
        }
      />
    </div>
  );
}