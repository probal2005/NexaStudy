'use client';

import { Code2, FilePlus2 } from 'lucide-react';

interface CodeEditorEmptyStateProps {
  onCreate?: () => void;
}

export default function CodeEditorEmptyState({
  onCreate,
}: CodeEditorEmptyStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Code2 className="h-8 w-8" />
      </div>

      <h2 className="text-lg font-semibold">
        No code file open
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create a new file or import an existing source file to start
        coding.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <FilePlus2 className="mr-2 h-4 w-4" />
        Create File
      </button>
    </div>
  );
}