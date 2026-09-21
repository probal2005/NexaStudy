import {
  StudySubjectCard,
  type StudySubject,
} from './StudySubjectCard';

interface StudySubjectListProps {
  subjects: StudySubject[];
  onSubjectClick?: (subject: StudySubject) => void;
}

export function StudySubjectList({
  subjects,
  onSubjectClick,
}: StudySubjectListProps) {
  if (subjects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((subject) => (
        <StudySubjectCard
          key={subject.id}
          subject={subject}
          onClick={onSubjectClick}
        />
      ))}
    </div>
  );
}