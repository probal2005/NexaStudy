import { Flame, Target, Trophy } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  weeklyGoal,
  weeklyProgress,
}: StreakCardProps) {
  const safeGoal = Math.max(weeklyGoal, 1);
  const progress = Math.min(
    Math.max((weeklyProgress / safeGoal) * 100, 0),
    100,
  );

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
          <Flame className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Study Streak
          </h2>
          <p className="text-sm text-muted-foreground">
            Keep your momentum going.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs">Current</span>
          </div>

          <p className="text-2xl font-bold text-foreground">
            {currentStreak}
          </p>

          <p className="text-xs text-muted-foreground">
            {currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs">Best</span>
          </div>

          <p className="text-2xl font-bold text-foreground">
            {longestStreak}
          </p>

          <p className="text-xs text-muted-foreground">
            {longestStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" aria-hidden="true" />
            Weekly goal
          </div>

          <span className="font-medium text-foreground">
            {weeklyProgress}/{weeklyGoal}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}