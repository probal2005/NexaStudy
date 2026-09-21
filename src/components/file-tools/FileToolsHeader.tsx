'use client';

import {
  FileStack,
  RefreshCw,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface FileToolsHeaderProps {
  onRefresh?: () => void;
  onUpload?: () => void;
}

export function FileToolsHeader({
  onRefresh,
  onUpload,
}: FileToolsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <FileStack className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            File Tools
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Convert, merge, preview, and manage your study files.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}

        {onUpload && (
          <Button
            type="button"
            size="sm"
            onClick={onUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        )}
      </div>
    </div>
  );
}