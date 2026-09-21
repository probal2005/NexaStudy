'use client';

import {
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import Button from '@/components/ui/Button';

interface CodeEditorToolbarProps {
  isRunning?: boolean;
  hasCode?: boolean;
  onRun?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onClear?: () => void;
  onDownload?: () => void;
  onUpload?: () => void;
}

export default function CodeEditorToolbar({
  isRunning = false,
  hasCode = false,
  onRun,
  onSave,
  onReset,
  onClear,
  onDownload,
  onUpload,
}: CodeEditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 p-3">
      <Button
        type="button"
        size="sm"
        onClick={onRun}
        disabled={isRunning || !hasCode}
      >
        <Play className="mr-2 h-4 w-4" />
        {isRunning ? 'Running...' : 'Run'}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onSave}
      >
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>

      <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUpload}
      >
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDownload}
        disabled={!hasCode}
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClear}
        disabled={!hasCode}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear
      </Button>

      {hasCode && (
        <div className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Ready
        </div>
      )}
    </div>
  );
}