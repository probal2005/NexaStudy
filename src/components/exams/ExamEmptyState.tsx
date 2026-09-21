import { CalendarDays, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface ExamEmptyStateProps {
  title?: string;
  description?: string;
  onAddExam?: () => void;
}

export function ExamEmptyState({
  title = 'No exams found',
  description = 'Add your upcoming exams to keep your academic schedule organized.',
  onAddExam,
}: ExamEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <CalendarDays className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {onAddExam && (
        <Button
          type="button"
          className="mt-5"
          onClick={onAddExam}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      )}
    </div>
  );
}