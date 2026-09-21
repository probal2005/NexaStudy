'use client';

import type { ReactNode } from 'react';

interface CalculatorCategoryProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function CalculatorCategory({
  title,
  description,
  children,
}: CalculatorCategoryProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}