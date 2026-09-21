'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Course {
  id: string;
  credits: number;
  gradePoint: number;
}

const defaultCourse: Course = {
  id: crypto.randomUUID(),
  credits: 3,
  gradePoint: 4,
};

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([defaultCourse]);

  const gpa = useMemo(() => {
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credits,
      0,
    );

    if (totalCredits <= 0) return 0;

    const totalPoints = courses.reduce(
      (sum, course) => sum + course.credits * course.gradePoint,
      0,
    );

    return totalPoints / totalCredits;
  }, [courses]);

  function addCourse() {
    setCourses((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        credits: 3,
        gradePoint: 4,
      },
    ]);
  }

  function removeCourse(id: string) {
    setCourses((current) =>
      current.length === 1
        ? current
        : current.filter((course) => course.id !== id),
    );
  }

  function updateCourse(
    id: string,
    field: keyof Omit<Course, 'id'>,
    value: number,
  ) {
    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? {
              ...course,
              [field]: Math.max(0, value),
            }
          : course,
      ),
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground">
            GPA Calculator
          </h2>
          <p className="text-sm text-muted-foreground">
            Calculate weighted GPA using credits and grade points.
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 px-4 py-2 text-center">
          <p className="text-[11px] text-muted-foreground">GPA</p>
          <p className="text-xl font-bold text-primary">
            {gpa.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="grid grid-cols-[1fr_1fr_auto] items-end gap-2"
          >
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">
                Course {index + 1} Credits
              </span>

              <Input
                type="number"
                min="0"
                step="0.5"
                value={course.credits}
                onChange={(event) =>
                  updateCourse(
                    course.id,
                    'credits',
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">
                Grade Point
              </span>

              <Input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={course.gradePoint}
                onChange={(event) =>
                  updateCourse(
                    course.id,
                    'gradePoint',
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCourse(course.id)}
              disabled={courses.length === 1}
              aria-label={`Remove course ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="mt-4 w-full" onClick={addCourse}>
        <Plus className="mr-2 h-4 w-4" />
        Add Course
      </Button>
    </div>
  );
}