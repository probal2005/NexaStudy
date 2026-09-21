'use client';

import { Code2, Maximize2, Settings2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CodeEditorHeaderProps {
  onSettings?: () => void;
  onFullscreen?: () => void;
}

export default function CodeEditorHeader({
  onSettings,
  onFullscreen,
}: CodeEditorHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Code2 className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Code Editor
          </h1>
          <p className="text-sm text-muted-foreground">
            Write, run and test code directly inside NexaStudy.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSettings}
          aria-label="Open editor settings"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFullscreen}
          aria-label="Toggle fullscreen editor"
        >
          <Maximize2 className="mr-2 h-4 w-4" />
          Fullscreen
        </Button>
      </div>
    </div>
  );
}