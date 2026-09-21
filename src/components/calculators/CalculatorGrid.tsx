'use client';

import { CalculatorCard, type CalculatorCardProps } from './CalculatorCard';

interface CalculatorGridProps {
  calculators: CalculatorCardProps[];
  onOpen?: (calculator: CalculatorCardProps) => void;
}

export function CalculatorGrid({
  calculators,
  onOpen,
}: CalculatorGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {calculators.map((calculator) => (
        <CalculatorCard
          key={`${calculator.category}-${calculator.title}`}
          {...calculator}
          onOpen={() => onOpen?.(calculator)}
        />
      ))}
    </div>
  );
}