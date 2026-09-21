'use client';

import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import type { GpaCourse } from './GpaCourseRow';

interface GpaCourseFormProps {
  initialCourse?: GpaCourse | null;
  onSubmit: (course: GpaCourse) => void;
  onCancel?: () => void;
}

interface FormState {
  code: string;
  name: string;
  credits: string;
  grade: string;
  gradePoint: string;
}

const defaultForm: FormState = {
  code: '',
  name: '',
  credits: '',
  grade: '',
  gradePoint: '',
};

const gradeOptions = [
  { grade: 'A+', point: 10 },
  { grade: 'A', point: 9 },
  { grade: 'B+', point: 8 },
  { grade: 'B', point: 7 },
  { grade: 'C+', point: 6 },
  { grade: 'C', point: 5 },
  { grade: 'D', point: 4 },
  { grade: 'F', point: 0 },
];

function courseToForm(
  course?: GpaCourse | null,
): FormState {
  if (!course) {
    return defaultForm;
  }

  return {
    code: course.code ?? '',
    name: course.name,
    credits: String(course.credits),
    grade: course.grade,
    gradePoint: String(course.gradePoint),
  };
}

export function GpaCourseForm({
  initialCourse,
  onSubmit,
  onCancel,
}: GpaCourseFormProps) {
  const [form, setForm] = useState<FormState>(
    courseToForm(initialCourse),
  );

  const [error, setError] = useState('');

  useEffect(() => {
    setForm(courseToForm(initialCourse));
    setError('');
  }, [initialCourse]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleGradeChange(grade: string) {
    const selected = gradeOptions.find(
      (item) => item.grade === grade,
    );

    setForm((current) => ({
      ...current,
      grade,
      gradePoint:
        selected !== undefined
          ? String(selected.point)
          : current.gradePoint,
    }));
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError('');

    const name = form.name.trim();
    const credits = Number(form.credits);
    const gradePoint = Number(form.gradePoint);

    if (!name) {
      setError('Course name is required.');
      return;
    }

    if (
      !Number.isFinite(credits) ||
      credits <= 0 ||
      credits > 100
    ) {
      setError(
        'Credits must be greater than 0 and within a valid range.',
      );
      return;
    }

    if (
      !Number.isFinite(gradePoint) ||
      gradePoint < 0 ||
      gradePoint > 10
    ) {
      setError(
        'Grade point must be between 0 and 10.',
      );
      return;
    }

    if (!form.grade) {
      setError('Please select a grade.');
      return;
    }

    onSubmit({
      id: initialCourse?.id ?? crypto.randomUUID(),
      code: form.code.trim() || undefined,
      name,
      credits,
      grade: form.grade,
      gradePoint,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {initialCourse
            ? 'Edit Course'
            : 'Add Course'}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the course credits and grade to calculate GPA.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="gpa-course-name"
            className="mb-1.5 block text-sm font-medium"
          >
            Course name
          </label>

          <Input
            id="gpa-course-name"
            value={form.name}
            onChange={(event) =>
              updateField('name', event.target.value)
            }
            placeholder="e.g. Data Structures"
          />
        </div>

        <div>
          <label
            htmlFor="gpa-course-code"
            className="mb-1.5 block text-sm font-medium"
          >
            Course code
          </label>

          <Input
            id="gpa-course-code"
            value={form.code}
            onChange={(event) =>
              updateField('code', event.target.value)
            }
            placeholder="e.g. CSE-201"
          />
        </div>

        <div>
          <label
            htmlFor="gpa-course-credits"
            className="mb-1.5 block text-sm font-medium"
          >
            Credits
          </label>

          <Input
            id="gpa-course-credits"
            type="number"
            min="0.5"
            step="0.5"
            value={form.credits}
            onChange={(event) =>
              updateField('credits', event.target.value)
            }
            placeholder="e.g. 4"
          />
        </div>

        <div>
          <label
            htmlFor="gpa-course-grade"
            className="mb-1.5 block text-sm font-medium"
          >
            Grade
          </label>

          <select
            id="gpa-course-grade"
            value={form.grade}
            onChange={(event) =>
              handleGradeChange(event.target.value)
            }
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select grade</option>

            {gradeOptions.map((option) => (
              <option
                key={option.grade}
                value={option.grade}
              >
                {option.grade} — {option.point}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="gpa-grade-point"
            className="mb-1.5 block text-sm font-medium"
          >
            Grade point
          </label>

          <Input
            id="gpa-grade-point"
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={form.gradePoint}
            onChange={(event) =>
              updateField(
                'gradePoint',
                event.target.value,
              )
            }
            placeholder="0 - 10"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button type="submit">
          {initialCourse
            ? 'Update Course'
            : 'Add Course'}
        </Button>
      </div>
    </form>
  );
}