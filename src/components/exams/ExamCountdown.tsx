'use client';

import { CalendarClock } from 'lucide-react';

import { cn } from '@/utils';
import type { Exam } from './ExamCard';

interface ExamCountdownProps {
  exam: Exam;
  className?: string;
}

function getDaysUntil(date: string) {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const difference =
    target.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );
}

export function ExamCountdown({
  exam,
  className,
}: ExamCountdownProps) {
  const days = getDaysUntil(exam.date);

  if (exam.status !== 'upcoming') {
    return null;
  }

  let label = '';
  let tone =
    'border-primary/20 bg-primary/5 text-primary';

  if (days < 0) {
    label = 'Exam date has passed';
    tone = 'border-muted bg-muted text-muted-foreground';
  } else if (days === 0) {
    label = 'Exam is today';
    tone = 'border-destructive/20 bg-destructive/10 text-destructive';
  } else if (days === 1) {
    label = 'Exam is tomorrow';
    tone = 'border-warning/20 bg-warning/10 text-warning';
  } else {
    label = `${days} days remaining`;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3',
        tone,
        className,
      )}
    >
      <CalendarClock className="h-5 w-5 shrink-0" />

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide opacity-80">
          {exam.subject}
        </p>

        <p className="font-semibold">{label}</p>
      </div>
    </div>
  );
}