'use client';

import { BookOpen, Plus, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LibraryHeaderProps {
  onAddBook?: () => void;
  onRefresh?: () => void;
  onImport?: () => void;
  loading?: boolean;
}

export function LibraryHeader({
  onAddBook,
  onRefresh,
  onImport,
  loading = false,
}: LibraryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Library</h1>
            <p className="text-sm text-muted-foreground">
              Organize your books, study materials, references, and resources.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh library"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}

        {onImport && (
          <Button variant="outline" onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}

        {onAddBook && (
          <Button onClick={onAddBook}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        )}
      </div>
    </div>
  );
}