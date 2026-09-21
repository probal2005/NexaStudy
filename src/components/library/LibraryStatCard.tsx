import type { LucideIcon } from 'lucide-react';

interface LibraryStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}

export function LibraryStatCard({
  title,
  value,
  description,
  icon: Icon,
}: LibraryStatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}