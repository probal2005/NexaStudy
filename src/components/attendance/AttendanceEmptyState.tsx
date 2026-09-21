'use client';

import { CalendarCheck2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface AttendanceEmptyStateProps {
  filtered?: boolean;
  onAdd?: () => void;
}

export function AttendanceEmptyState({
  filtered = false,
  onAdd,
}: AttendanceEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarCheck2 className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {filtered ? 'No attendance records found' : 'No attendance records yet'}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {filtered
          ? 'Try changing your search or filters to find another attendance record.'
          : 'Start recording your classes to keep your attendance organized.'}
      </p>

      {!filtered && onAdd && (
        <Button className="mt-5" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Attendance
        </Button>
      )}
    </div>
  );
}