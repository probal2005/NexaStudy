import { History } from 'lucide-react';

import {
  PomodoroSessionCard,
} from './PomodoroSessionCard';

import type { PomodoroSession } from './PomodoroSessionForm';

interface PomodoroSessionHistoryProps {
  sessions: PomodoroSession[];
  onDelete?: (session: PomodoroSession) => void;
}

export function PomodoroSessionHistory({
  sessions,
  onDelete,
}: PomodoroSessionHistoryProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />

        <div>
          <h2 className="font-semibold">Session History</h2>
          <p className="text-xs text-muted-foreground">
            Review your completed focus sessions.
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <History className="mx-auto h-8 w-8 text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            No completed sessions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <PomodoroSessionCard
              key={session.id}
              session={session}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}