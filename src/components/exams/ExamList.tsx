import { ExamCard, type Exam } from './ExamCard';
import { ExamEmptyState } from './ExamEmptyState';

interface ExamListProps {
  exams: Exam[];
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
  onClick?: (exam: Exam) => void;
  onAddExam?: () => void;
}

export function ExamList({
  exams,
  onEdit,
  onDelete,
  onClick,
  onAddExam,
}: ExamListProps) {
  if (exams.length === 0) {
    return <ExamEmptyState onAddExam={onAddExam} />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}