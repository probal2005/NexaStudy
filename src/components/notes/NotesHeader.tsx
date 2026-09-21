'use client';

import { FileText, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NotesHeaderProps {
  onAddNote?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function NotesHeader({
  onAddNote,
  onRefresh,
  loading = false,
}: NotesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground">
            Capture, organize, and revisit your study notes.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </Button>
        )}

        {onAddNote && (
          <Button onClick={onAddNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        )}
      </div>
    </div>
  );
}