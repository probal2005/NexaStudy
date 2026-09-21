import {
  Calculator,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface GpaEmptyStateProps {
  title?: string;
  description?: string;
  onAddCourse?: () => void;
}

export function GpaEmptyState({
  title = 'No courses added',
  description = 'Add your courses, credits, and grades to calculate your GPA.',
  onAddCourse,
}: GpaEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Calculator className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {onAddCourse && (
        <Button
          type="button"
          className="mt-5"
          onClick={onAddCourse}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      )}
    </div>
  );
}