import {
  StudySessionCard,
  type StudySession,
} from './StudySessionCard';

interface StudySessionListProps {
  sessions: StudySession[];
  onDelete?: (session: StudySession) => void;
}

export function StudySessionList({
  sessions,
  onDelete,
}: StudySessionListProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <StudySessionCard
          key={session.id}
          session={session}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}