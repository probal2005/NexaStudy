'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  onOpen?: () => void;
}

export function CalculatorCard({
  title,
  description,
  icon: Icon,
  category,
  onOpen,
}: CalculatorCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {category}
        </span>
      </div>

      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onOpen && (
        <Button
          variant="outline"
          className="mt-5 w-full"
          onClick={onOpen}
        >
          Open Calculator
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      )}
    </article>
  );
}