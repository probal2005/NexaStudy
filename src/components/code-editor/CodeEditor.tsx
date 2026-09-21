'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import CodeEditorPane from './CodeEditorPane';
import CodeEditorOutput from './CodeEditorOutput';

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'html'
  | 'css'
  | 'json';

export interface CodeFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  code: string;
}

interface CodeEditorProps {
  files?: CodeFile[];
  initialFile?: CodeFile;
  onChange?: (file: CodeFile) => void;
  onRun?: (file: CodeFile) => Promise<string> | string;
}

const defaultCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("NexaStudy");
console.log(message);`;

const STORAGE_KEY = 'nexastudy_code_editor_v1';

function createDefaultFile(): CodeFile {
  return {
    id: 'main',
    name: 'main.js',
    language: 'javascript',
    code: defaultCode,
  };
}

export default function CodeEditor({
  files: externalFiles,
  initialFile,
  onChange,
  onRun,
}: CodeEditorProps) {
  const initial = useMemo(
    () => initialFile ?? externalFiles?.[0] ?? createDefaultFile(),
    [initialFile, externalFiles],
  );

  const [files, setFiles] = useState<CodeFile[]>(
    externalFiles ?? [initial],
  );
  const [activeFileId, setActiveFileId] = useState(initial.id);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalFiles?.length) {
      setFiles(externalFiles);
      setActiveFileId(externalFiles[0].id);
    }
  }, [externalFiles]);

  useEffect(() => {
    if (externalFiles) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as CodeFile[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setFiles(parsed);
          setActiveFileId(parsed[0].id);
        }
      }
    } catch {
      // Ignore invalid local storage.
    }
  }, [externalFiles]);

  const activeFile =
    files.find((file) => file.id === activeFileId) ?? files[0];

  const updateActiveFile = (updates: Partial<CodeFile>) => {
    if (!activeFile) return;

    const updatedFile = {
      ...activeFile,
      ...updates,
    };

    setFiles((current) =>
      current.map((file) =>
        file.id === activeFile.id ? updatedFile : file,
      ),
    );

    onChange?.(updatedFile);
  };

  const saveFiles = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch {
      // Ignore storage errors.
    }
  };

  const runCode = async () => {
    if (!activeFile || !activeFile.code.trim()) return;

    setIsRunning(true);
    setOutput(['Running code...']);

    try {
      if (onRun) {
        const result = await onRun(activeFile);

        setOutput(
          result
            ? result.split('\n')
            : ['Execution completed successfully.'],
        );

        return;
      }

      if (activeFile.language === 'javascript') {
        const logs: string[] = [];

        const originalLog = console.log;

        console.log = (...args: unknown[]) => {
          logs.push(
            args
              .map((value) =>
                typeof value === 'object'
                  ? JSON.stringify(value)
                  : String(value),
              )
              .join(' '),
          );
        };

        try {
          // eslint-disable-next-line no-new-func
          const execute = new Function(activeFile.code);
          execute();

          setOutput(
            logs.length
              ? logs
              : ['Execution completed without console output.'],
          );
        } finally {
          console.log = originalLog;
        }
      } else {
        setOutput([
          `${activeFile.language} execution requires a backend runtime.`,
          'The editor is ready for backend execution integration.',
        ]);
      }
    } catch (error) {
      setOutput([
        'Execution failed.',
        error instanceof Error ? error.message : String(error),
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const resetFile = () => {
    if (!activeFile) return;

    const defaultFile = createDefaultFile();

    updateActiveFile({
      code:
        activeFile.language === 'javascript'
          ? defaultFile.code
          : '',
    });

    setOutput([]);
  };

  const clearFile = () => {
    updateActiveFile({ code: '' });
    setOutput([]);
  };

  const downloadFile = () => {
    if (!activeFile) return;

    const blob = new Blob([activeFile.code], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = activeFile.name;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const uploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const code = await file.text();

    const extension = file.name.split('.').pop()?.toLowerCase();

    const languageMap: Record<string, SupportedLanguage> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
    };

    const newFile: CodeFile = {
      id: crypto.randomUUID(),
      name: file.name,
      language: languageMap[extension ?? ''] ?? 'javascript',
      code,
    };

    setFiles((current) => [...current, newFile]);
    setActiveFileId(newFile.id);

    event.target.value = '';
  };

  if (!activeFile) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <CodeEditorPane
        files={files}
        activeFileId={activeFile.id}
        code={activeFile.code}
        language={activeFile.language}
        isRunning={isRunning}
        output={output}
        fileInputRef={fileInputRef}
        onSelectFile={setActiveFileId}
        onCodeChange={(code) => updateActiveFile({ code })}
        onRun={runCode}
        onSave={saveFiles}
        onReset={resetFile}
        onClear={clearFile}
        onDownload={downloadFile}
        onUpload={uploadFile}
        onFileUpload={handleUpload}
      />

      <CodeEditorOutput output={output} />
    </div>
  );
}