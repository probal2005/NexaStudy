'use client';

import { CalendarDays, RefreshCw } from 'lucide-react';

import Button from '@/components/ui/Button';

interface DashboardHeaderProps {
  studentName?: string;
  onRefresh?: () => void;
}

export default function DashboardHeader({
  studentName = 'Student',
  onRefresh,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-1 text-sm font-medium text-primary">
          {today}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Good morning, {studentName} 👋
        </h1>

        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Here&apos;s your academic overview for today.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={() => {
            window.location.href = '/calendar';
          }}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </div>
    </header>
  );
}