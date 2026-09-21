'use client';

import { useState } from 'react';

interface CodeEditorSettingsProps {
  open: boolean;
  onClose: () => void;
}

export default function CodeEditorSettings({
  open,
  onClose,
}: CodeEditorSettingsProps) {
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Editor Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize your coding workspace.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Font size: {fontSize}px
            </span>

            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(event) =>
                setFontSize(Number(event.target.value))
              }
              className="w-full"
            />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">
                Word wrap
              </span>
              <span className="text-xs text-muted-foreground">
                Wrap long lines automatically.
              </span>
            </span>

            <input
              type="checkbox"
              checked={wordWrap}
              onChange={(event) => setWordWrap(event.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">
                Line numbers
              </span>
              <span className="text-xs text-muted-foreground">
                Show line numbers in the editor.
              </span>
            </span>

            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(event) =>
                setLineNumbers(event.target.checked)
              }
              className="h-4 w-4"
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}