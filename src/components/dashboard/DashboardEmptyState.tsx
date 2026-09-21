'use client';

import { LayoutDashboard, Plus } from 'lucide-react';

interface DashboardEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function DashboardEmptyState({
  title = 'Your dashboard is ready',
  description = 'Start adding tasks, study sessions, assignments and notes to personalize your workspace.',
  actionLabel = 'Get started',
  onAction,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LayoutDashboard className="h-8 w-8" />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}