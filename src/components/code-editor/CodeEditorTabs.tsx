'use client';

import { FileCode2, X } from 'lucide-react';

import type { CodeFile } from './CodeEditor';

interface CodeEditorTabsProps {
  files: CodeFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
}

export default function CodeEditorTabs({
  files,
  activeFileId,
  onSelect,
  onClose,
}: CodeEditorTabsProps) {
  return (
    <div className="flex min-w-max items-center border-b border-border bg-muted/30">
      {files.map((file) => {
        const active = file.id === activeFileId;

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelect(file.id)}
            className={[
              'group flex items-center gap-2 border-r border-border px-4 py-2.5 text-sm transition-colors',
              active
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
            ].join(' ')}
          >
            <FileCode2 className="h-4 w-4" />

            <span>{file.name}</span>

            {onClose && files.length > 1 && (
              <span
                role="button"
                tabIndex={0}
                className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose(file.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onClose(file.id);
                  }
                }}
                aria-label={`Close ${file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}