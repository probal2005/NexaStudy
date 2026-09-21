import {
  FileSearch,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface FileEmptyStateProps {
  title?: string;
  description?: string;
  onUpload?: () => void;
}

export function FileEmptyState({
  title = 'No files found',
  description = 'Upload a file to start working with your documents.',
  onUpload,
}: FileEmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <FileSearch className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {onUpload && (
        <Button
          type="button"
          className="mt-5"
          onClick={onUpload}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      )}
    </div>
  );
}