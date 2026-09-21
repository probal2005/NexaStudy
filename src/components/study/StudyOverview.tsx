import { StudyStats, type StudyStatsData } from './StudyStats';

interface StudyOverviewProps {
  stats: StudyStatsData;
  weeklyGoalMinutes?: number;
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

export function StudyOverview({
  stats,
  weeklyGoalMinutes = 600,
}: StudyOverviewProps) {
  const weeklyMinutes = stats.weeklyStudyMinutes ?? stats.totalStudyMinutes;

  const percentage =
    weeklyGoalMinutes > 0
      ? Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100))
      : 0;

  return (
    <div className="space-y-5">
      <StudyStats data={stats} />

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Weekly Study Goal</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatMinutes(weeklyMinutes)} of{' '}
              {formatMinutes(weeklyGoalMinutes)} completed
            </p>
          </div>

          <span className="text-lg font-bold">{percentage}%</span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}