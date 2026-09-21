'use client';

import {
  FileUp,
  UploadCloud,
} from 'lucide-react';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { cn } from '@/utils';

interface FileUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function FileUploadZone({
  accept,
  multiple = true,
  maxFiles = 20,
  maxSizeMB = 25,
  disabled = false,
  onFilesSelected,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const processFiles = useCallback(
    (selectedFiles: File[]) => {
      setError('');

      if (selectedFiles.length === 0) {
        return;
      }

      let files = selectedFiles;

      if (!multiple) {
        files = files.slice(0, 1);
      } else if (files.length > maxFiles) {
        files = files.slice(0, maxFiles);
        setError(`Only the first ${maxFiles} files were selected.`);
      }

      const maxBytes = maxSizeMB * 1024 * 1024;

      const validFiles = files.filter(
        (file) => file.size <= maxBytes,
      );

      if (validFiles.length !== files.length) {
        setError(
          `Files larger than ${maxSizeMB} MB were skipped.`,
        );
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [
      maxFiles,
      maxSizeMB,
      multiple,
      onFilesSelected,
    ],
  );

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    processFiles(
      Array.from(event.target.files ?? []),
    );

    event.target.value = '';
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    processFiles(
      Array.from(event.dataTransfer.files),
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (
            !disabled &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();

          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          'flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-card hover:border-primary/40 hover:bg-muted/20',
          disabled &&
            'cursor-not-allowed opacity-50',
        )}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {isDragging ? (
            <FileUp className="h-8 w-8 text-primary" />
          ) : (
            <UploadCloud className="h-8 w-8 text-primary" />
          )}
        </div>

        <h3 className="text-lg font-semibold">
          {isDragging
            ? 'Drop your files here'
            : 'Upload your files'}
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Drag and drop files here, or click to browse from your
          computer.
        </p>

        <p className="mt-3 text-xs text-muted-foreground">
          Maximum {maxSizeMB} MB per file
          {multiple ? ` • Up to ${maxFiles} files` : ''}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}