import type { LucideIcon } from 'lucide-react';

interface WeatherStatCardProps {
  label: string;
  value: string;
  description?: string;
  icon: LucideIcon;
}

export function WeatherStatCard({
  label,
  value,
  description,
  icon: Icon,
}: WeatherStatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}