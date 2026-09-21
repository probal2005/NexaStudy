'use client';

import { ArrowLeftRight, RotateCcw } from 'lucide-react';

import Button from '@/components/ui/Button';

interface ConverterHeaderProps {
  onReset?: () => void;
}

export default function ConverterHeader({
  onReset,
}: ConverterHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-background/80 px-4 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ArrowLeftRight className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Unit Converters
          </h1>

          <p className="text-sm text-muted-foreground">
            Convert units quickly and accurately.
          </p>
        </div>
      </div>

      {onReset && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}