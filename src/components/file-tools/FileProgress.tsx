import { CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/utils';

interface FileProgressProps {
  progress: number;
  label?: string;
  status?: 'idle' | 'processing' | 'completed';
}

export function FileProgress({
  progress,
  label = 'Processing...',
  status = 'processing',
}: FileProgressProps) {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress),
  );

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}

          <span className="text-sm font-medium">
            {status === 'completed'
              ? 'Completed'
              : label}
          </span>
        </div>

        <span className="text-sm font-semibold">
          {safeProgress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            status === 'completed'
              ? 'bg-success'
              : 'bg-primary',
          )}
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>
    </div>
  );
}