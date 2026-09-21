'use client';

import { FileCode2, FilePlus2 } from 'lucide-react';

import type { CodeFile } from './CodeEditor';

interface CodeEditorFileExplorerProps {
  files: CodeFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
}

export default function CodeEditorFileExplorer({
  files,
  activeFileId,
  onSelect,
  onAdd,
}: CodeEditorFileExplorerProps) {
  return (
    <aside className="w-full border-r border-border bg-muted/10 md:w-56">
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Create new file"
        >
          <FilePlus2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1 p-2">
        {files.map((file) => {
          const active = file.id === activeFileId;

          return (
            <button
              key={file.id}
              type="button"
              onClick={() => onSelect(file.id)}
              className={[
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              <FileCode2 className="h-4 w-4 shrink-0" />

              <span className="truncate">{file.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}