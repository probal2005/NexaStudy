import type { LucideIcon } from 'lucide-react';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/utils';

interface FileToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function FileToolCard({
  title,
  description,
  icon: Icon,
  onClick,
  disabled = false,
  className,
}: FileToolCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full items-start gap-4 rounded-2xl border bg-card p-5 text-left shadow-sm transition',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
    </button>
  );
}