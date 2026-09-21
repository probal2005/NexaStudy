'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CalculatorSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function CalculatorSearch({
  value,
  onChange,
  onClear,
}: CalculatorSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search calculators..."
        className="pl-9 pr-10"
        aria-label="Search calculators"
      />

      {value && onClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={onClear}
          aria-label="Clear calculator search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}