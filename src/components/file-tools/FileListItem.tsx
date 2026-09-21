import {
  Download,
  File,
  FileImage,
  FileText,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

interface FileListItemProps {
  file: File;
  onRemove?: (file: File) => void;
  onDownload?: (file: File) => void;
  className?: string;
}

function formatSize(bytes: number) {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) {
    return FileImage;
  }

  if (
    file.type === 'application/pdf' ||
    file.type.startsWith('text/')
  ) {
    return FileText;
  }

  return File;
}

export function FileListItem({
  file,
  onRemove,
  onDownload,
  className,
}: FileListItemProps) {
  const Icon = getFileIcon(file);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-card p-3',
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {file.name}
        </p>

        <p className="text-xs text-muted-foreground">
          {formatSize(file.size)}
          {file.type ? ` • ${file.type}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {onDownload && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Download ${file.name}`}
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}

        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${file.name}`}
            onClick={() => onRemove(file)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}