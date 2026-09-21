import type { LucideIcon } from 'lucide-react';

interface LibraryCategoryCardProps {
  name: string;
  count: number;
  icon: LucideIcon;
  onClick?: () => void;
}

export function LibraryCategoryCard({
  name,
  count,
  icon: Icon,
  onClick,
}: LibraryCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? 'resource' : 'resources'}
        </p>
      </div>
    </button>
  );
}