import { BookOpen, Plus } from 'lucide-react';

interface StudyEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StudyEmptyState({
  title = 'No study data yet',
  description = 'Start by creating a study goal or logging your first study session.',
  actionLabel = 'Create Study Goal',
  onAction,
}: StudyEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BookOpen className="h-6 w-6" />
      </div>

      <h2 className="mt-4 font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}