import type { LucideIcon } from 'lucide-react';

interface WeatherDetailsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  description?: string;
}

export function WeatherDetailsCard({
  label,
  value,
  icon: Icon,
  description,
}: WeatherDetailsCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-lg font-bold">{value}</p>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}