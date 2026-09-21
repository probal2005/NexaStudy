'use client';

import type { ChangeEvent, RefObject } from 'react';

import CodeEditorTabs from './CodeEditorTabs';
import CodeEditorToolbar from './CodeEditorToolbar';
import CodeEditorLanguageSelect from './CodeEditorLanguageSelect';
import type { CodeFile, SupportedLanguage } from './CodeEditor';

interface CodeEditorPaneProps {
  files: CodeFile[];
  activeFileId: string;
  code: string;
  language: SupportedLanguage;
  isRunning: boolean;
  output: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onSelectFile: (id: string) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSave: () => void;
  onReset: () => void;
  onClear: () => void;
  onDownload: () => void;
  onUpload: () => void;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CodeEditorPane({
  files,
  activeFileId,
  code,
  language,
  isRunning,
  fileInputRef,
  onSelectFile,
  onCodeChange,
  onRun,
  onSave,
  onReset,
  onClear,
  onDownload,
  onUpload,
  onFileUpload,
}: CodeEditorPaneProps) {
  const lineCount = Math.max(code.split('\n').length, 1);
  const lines = Array.from({ length: lineCount }, (_, index) => index + 1);

  return (
    <div>
      <CodeEditorTabs
        files={files}
        activeFileId={activeFileId}
        onSelect={onSelectFile}
      />

      <CodeEditorToolbar
        isRunning={isRunning}
        hasCode={Boolean(code.trim())}
        onRun={onRun}
        onSave={onSave}
        onReset={onReset}
        onClear={onClear}
        onDownload={onDownload}
        onUpload={onUpload}
      />

      <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-3 py-2">
        <CodeEditorLanguageSelect
          value={language}
          onChange={(value) => {
            // Language selection is handled by the parent in future editor upgrades.
            void value;
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.html,.css,.json,.txt"
          onChange={onFileUpload}
        />

        <span className="text-xs text-muted-foreground">
          {code.length} characters · {lineCount} lines
        </span>
      </div>

      <div className="flex min-h-[420px] overflow-auto bg-[#0b1020] font-mono text-sm text-slate-100">
        <div
          aria-hidden="true"
          className="sticky left-0 select-none border-r border-white/10 bg-[#0b1020] px-3 py-4 text-right text-xs leading-6 text-slate-500"
        >
          {lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          spellCheck={false}
          wrap="off"
          aria-label="Code editor"
          className="min-h-[420px] min-w-[800px] flex-1 resize-none border-0 bg-transparent p-4 leading-6 text-slate-100 outline-none placeholder:text-slate-600"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
}