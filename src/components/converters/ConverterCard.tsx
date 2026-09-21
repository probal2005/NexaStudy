'use client';

import type { LucideIcon } from 'lucide-react';

interface ConverterCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
}

export default function ConverterCard({
  title,
  description,
  icon: Icon,
  onClick,
  active = false,
}: ConverterCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group w-full rounded-2xl border p-4 text-left transition-all',
        'hover:-translate-y-0.5 hover:shadow-md',
        active
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-background hover:border-primary/40',
      ].join(' ')}
    >
      <div
        className={[
          'mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  );
}