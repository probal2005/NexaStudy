import {
  Clock3,
  Flame,
  Target,
  Timer,
} from 'lucide-react';

import { PomodoroStatCard } from './PomodoroStatCard';

export interface PomodoroStatsData {
  completedSessions: number;
  focusMinutes: number;
  currentStreak: number;
  completionRate: number;
}

interface PomodoroStatsProps {
  stats: PomodoroStatsData;
}

export function PomodoroStats({
  stats,
}: PomodoroStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <PomodoroStatCard
        title="Completed Sessions"
        value={stats.completedSessions}
        description="Focus sessions completed"
        icon={Timer}
      />

      <PomodoroStatCard
        title="Focus Time"
        value={`${Math.round(stats.focusMinutes / 60)}h`}
        description={`${stats.focusMinutes} minutes`}
        icon={Clock3}
      />

      <PomodoroStatCard
        title="Current Streak"
        value={stats.currentStreak}
        description="Consecutive sessions"
        icon={Flame}
      />

      <PomodoroStatCard
        title="Completion Rate"
        value={`${Math.round(stats.completionRate)}%`}
        description="Today's focus target"
        icon={Target}
      />
    </div>
  );
}