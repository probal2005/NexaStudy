'use client';

import { Terminal } from 'lucide-react';

interface CodeEditorConsoleProps {
  messages: string[];
  onClear?: () => void;
}

export default function CodeEditorConsole({
  messages,
  onClear,
}: CodeEditorConsoleProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0b1020]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Terminal className="h-4 w-4" />
          Console
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="max-h-60 min-h-24 overflow-auto p-4 font-mono text-xs leading-6 text-slate-300">
        {messages.length === 0 ? (
          <span className="text-slate-500">
            Console output will appear here.
          </span>
        ) : (
          messages.map((message, index) => (
            <div key={`${message}-${index}`}>{message}</div>
          ))
        )}
      </div>
    </div>
  );
}