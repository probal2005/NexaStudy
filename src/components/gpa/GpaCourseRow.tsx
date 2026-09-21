import {
  Edit3,
  GripVertical,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

export interface GpaCourse {
  id: string;
  code?: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface GpaCourseRowProps {
  course: GpaCourse;
  index?: number;
  onEdit?: (course: GpaCourse) => void;
  onDelete?: (course: GpaCourse) => void;
}

function gradeTone(gradePoint: number) {
  if (gradePoint >= 9) {
    return 'text-success';
  }

  if (gradePoint >= 7) {
    return 'text-primary';
  }

  if (gradePoint >= 5) {
    return 'text-warning';
  }

  return 'text-destructive';
}

export function GpaCourseRow({
  course,
  index,
  onEdit,
  onDelete,
}: GpaCourseRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 rounded-xl border bg-card p-3 sm:grid-cols-[auto_1.5fr_1fr_80px_80px_auto]">
      <div className="hidden text-muted-foreground sm:block">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        {typeof index === 'number' && (
          <p className="mb-0.5 text-xs text-muted-foreground sm:hidden">
            Course {index + 1}
          </p>
        )}

        <p className="truncate font-medium">
          {course.name}
        </p>

        {course.code && (
          <p className="text-xs text-muted-foreground">
            {course.code}
          </p>
        )}
      </div>

      <div className="hidden text-sm text-muted-foreground sm:block">
        {course.credits}{' '}
        {course.credits === 1 ? 'credit' : 'credits'}
      </div>

      <div className="text-center">
        <span
          className={cn(
            'font-semibold',
            gradeTone(course.gradePoint),
          )}
        >
          {course.grade}
        </span>
      </div>

      <div className="text-center">
        <span className="font-semibold">
          {course.gradePoint.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1">
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${course.name}`}
            onClick={() => onEdit(course)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}

        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${course.name}`}
            onClick={() => onDelete(course)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}