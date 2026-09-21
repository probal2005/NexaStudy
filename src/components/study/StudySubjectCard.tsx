import { BookOpen, Clock3, Target } from 'lucide-react';

export interface StudySubject {
  id: string;
  name: string;
  color?: string;
  studyMinutes: number;
  targetMinutes: number;
  sessions: number;
}

interface StudySubjectCardProps {
  subject: StudySubject;
  onClick?: (subject: StudySubject) => void;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining > 0
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}

export function StudySubjectCard({
  subject,
  onClick,
}: StudySubjectCardProps) {
  const progress =
    subject.targetMinutes > 0
      ? Math.min(
          100,
          Math.round(
            (subject.studyMinutes / subject.targetMinutes) * 100,
          ),
        )
      : 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(subject)}
      className="w-full rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          style={
            subject.color
              ? {
                  backgroundColor: `${subject.color}18`,
                  color: subject.color,
                }
              : undefined
          }
        >
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{subject.name}</h3>

          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatMinutes(subject.studyMinutes)}
            </span>

            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5" />
              {subject.sessions} sessions
            </span>
          </div>
        </div>

        <span className="text-sm font-semibold">{progress}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}