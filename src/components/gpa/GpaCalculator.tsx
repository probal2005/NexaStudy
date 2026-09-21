'use client';

import { useMemo } from 'react';

import {
  GpaCourseRow,
  type GpaCourse,
} from './GpaCourseRow';

import { GpaEmptyState } from './GpaEmptyState';

interface GpaCalculatorProps {
  courses: GpaCourse[];
  onEditCourse?: (course: GpaCourse) => void;
  onDeleteCourse?: (course: GpaCourse) => void;
  onAddCourse?: () => void;
}

export function GpaCalculator({
  courses,
  onEditCourse,
  onDeleteCourse,
  onAddCourse,
}: GpaCalculatorProps) {
  const summary = useMemo(() => {
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credits,
      0,
    );

    const totalGradePoints = courses.reduce(
      (sum, course) =>
        sum + course.credits * course.gradePoint,
      0,
    );

    const gpa =
      totalCredits > 0
        ? totalGradePoints / totalCredits
        : 0;

    return {
      totalCredits,
      totalGradePoints,
      gpa,
    };
  }, [courses]);

  if (courses.length === 0) {
    return (
      <GpaEmptyState
        onAddCourse={onAddCourse}
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 sm:grid-cols-[auto_1.5fr_1fr_80px_80px_auto]">
          <span className="hidden sm:block" />

          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Course
          </span>

          <span className="hidden text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:block">
            Credits
          </span>

          <span className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Grade
          </span>

          <span className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Point
          </span>

          <span />
        </div>
      </div>

      <div className="space-y-2 p-4">
        {courses.map((course, index) => (
          <GpaCourseRow
            key={course.id}
            course={course}
            index={index}
            onEdit={onEditCourse}
            onDelete={onDeleteCourse}
          />
        ))}
      </div>

      <div className="grid gap-4 border-t bg-muted/30 p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Courses
          </p>

          <p className="mt-1 text-xl font-bold">
            {courses.length}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Credits
          </p>

          <p className="mt-1 text-xl font-bold">
            {summary.totalCredits}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            GPA
          </p>

          <p className="mt-1 text-xl font-bold text-primary">
            {summary.gpa.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
}