import {
  StudyGoalCard,
  type StudyGoal,
} from './StudyGoalCard';

interface StudyGoalListProps {
  goals: StudyGoal[];
  onEdit?: (goal: StudyGoal) => void;
  onDelete?: (goal: StudyGoal) => void;
  onComplete?: (goal: StudyGoal) => void;
  onPause?: (goal: StudyGoal) => void;
}

export function StudyGoalList({
  goals,
  onEdit,
  onDelete,
  onComplete,
  onPause,
}: StudyGoalListProps) {
  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {goals.map((goal) => (
        <StudyGoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          onPause={onPause}
        />
      ))}
    </div>
  );
}