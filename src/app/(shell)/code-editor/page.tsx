'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Card, CardContent } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  Menu,
  MenuTrigger,
  MenuItem,
  EmptyState,
} from '@/components/ui/Header';

import { cn } from '@/utils';

import {
  Play,
  Download,
  Copy,
  Check,
  FileCode,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronRight,
  Clock,
  Save,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';

type LanguageId =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'sql';

interface LanguageDefinition {
  id: LanguageId;
  label: string;
  extension: string;
  color: string;
  icon: string;
}

interface EditorFile {
  id: string;
  name: string;
  language: LanguageId;
  code: string;
  createdAt: string;
}

type RunResult = {
  status: 'idle' | 'success' | 'error' | 'unsupported';
  output: string;
};

const LANGUAGES: LanguageDefinition[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    extension: 'js',
    color: '#f7df1e',
    icon: 'JS',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    extension: 'ts',
    color: '#3178c6',
    icon: 'TS',
  },
  {
    id: 'python',
    label: 'Python',
    extension: 'py',
    color: '#3776ab',
    icon: 'Py',
  },
  {
    id: 'html',
    label: 'HTML',
    extension: 'html',
    color: '#e34f26',
    icon: 'H',
  },
  {
    id: 'css',
    label: 'CSS',
    extension: 'css',
    color: '#1572b6',
    icon: 'CSS',
  },
  {
    id: 'json',
    label: 'JSON',
    extension: 'json',
    color: '#000000',
    icon: '{}',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    extension: 'md',
    color: '#083fa1',
    icon: 'MD',
  },
  {
    id: 'sql',
    label: 'SQL',
    extension: 'sql',
    color: '#e38c20',
    icon: 'SQL',
  },
];

const DEFAULT_CODE: Record<LanguageId, string> = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i <= 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,

  typescript: `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function getActiveUsers(users: User[]): User[] {
  return users.filter((user) => user.isActive);
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    isActive: true,
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    isActive: false,
  },
];

console.log(getActiveUsers(users));`,

  python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)


data = [64, 34, 25, 12, 22, 11, 90]
print("Original:", data)
print("Sorted:", quicksort(data))`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexaStudy</title>
</head>
<body>
  <main>
    <h1>Hello, NexaStudy!</h1>
    <p>Build something useful.</p>
  </main>
</body>
</html>`,

  css: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

.card {
  padding: 2rem;
  border-radius: 12px;
}`,

  json: `{
  "name": "NexaStudy",
  "version": "1.0.0",
  "description": "A complete student workspace",
  "features": [
    "Tasks",
    "Library",
    "Notes",
    "Calendar",
    "Pomodoro"
  ]
}`,

  markdown: `# Welcome to NexaStudy

## Your Complete Student Workspace

NexaStudy brings together everything you need for academic productivity.

### Features

- Task management
- Digital library
- Notes
- Calendar
- Pomodoro timer

> Start small. Build consistently.`,

  sql: `SELECT
  s.name,
  s.email,
  ROUND(AVG(g.grade_point), 2) AS gpa
FROM students s
JOIN enrollments e
  ON s.id = e.student_id
JOIN grades g
  ON e.id = g.enrollment_id
WHERE g.grade_point >= 2.0
GROUP BY s.id, s.name, s.email
ORDER BY gpa DESC
LIMIT 10;`,
};

const STORAGE_KEY = 'nexastudy_code_editor_files';

function getLanguage(language: LanguageId) {
  return LANGUAGES.find((item) => item.id === language) ?? LANGUAGES[0];
}

function ensureFileExtension(name: string, language: LanguageId) {
  const trimmed = name.trim();

  if (!trimmed) {
    return `untitled.${getLanguage(language).extension}`;
  }

  const knownExtension = LANGUAGES.some(
    (item) => trimmed.toLowerCase().endsWith(`.${item.extension}`),
  );

  if (knownExtension) {
    return trimmed;
  }

  return `${trimmed}.${getLanguage(language).extension}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Lightweight syntax highlighting.
 *
 * Important:
 * Everything is escaped first, then highlighted with controlled spans.
 * This prevents user code from becoming executable HTML.
 */
function highlightCode(code: string, language: LanguageId) {
  if (!code) {
    return '';
  }

  const escaped = escapeHtml(code);

  const keywordsByLanguage: Partial<
    Record<LanguageId, string[]>
  > = {
    javascript: [
      'function',
      'const',
      'let',
      'var',
      'return',
      'if',
      'else',
      'for',
      'while',
      'new',
      'class',
      'export',
      'import',
      'from',
      'async',
      'await',
      'try',
      'catch',
      'throw',
      'true',
      'false',
      'null',
      'undefined',
    ],

    typescript: [
      'function',
      'const',
      'let',
      'var',
      'return',
      'if',
      'else',
      'for',
      'while',
      'new',
      'class',
      'export',
      'import',
      'from',
      'async',
      'await',
      'interface',
      'type',
      'extends',
      'implements',
      'true',
      'false',
      'null',
      'undefined',
      'string',
      'number',
      'boolean',
      'void',
      'any',
      'unknown',
    ],

    python: [
      'def',
      'class',
      'return',
      'if',
      'elif',
      'else',
      'for',
      'while',
      'import',
      'from',
      'as',
      'try',
      'except',
      'finally',
      'with',
      'yield',
      'raise',
      'pass',
      'break',
      'continue',
      'and',
      'or',
      'not',
      'is',
      'in',
      'True',
      'False',
      'None',
      'self',
      'lambda',
    ],

    sql: [
      'SELECT',
      'FROM',
      'WHERE',
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'DROP',
      'ALTER',
      'TABLE',
      'INTO',
      'VALUES',
      'SET',
      'JOIN',
      'LEFT',
      'RIGHT',
      'INNER',
      'OUTER',
      'ON',
      'AND',
      'OR',
      'NOT',
      'NULL',
      'ORDER',
      'BY',
      'GROUP',
      'HAVING',
      'LIMIT',
      'ASC',
      'DESC',
      'AS',
      'DISTINCT',
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
    ],
  };

  let result = escaped;

  /*
   * Protect strings/comments before keyword highlighting.
   * This avoids highlighting words inside quoted strings.
   */
  const protectedParts: string[] = [];

  const protect = (match: string) => {
    const index = protectedParts.push(match) - 1;
    return `\u0000PROTECTED_${index}\u0000`;
  };

  result = result.replace(
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g,
    protect,
  );

  if (
    language === 'javascript' ||
    language === 'typescript'
  ) {
    result = result.replace(/\/\/[^\n]*/g, protect);
    result = result.replace(/\/\*[\s\S]*?\*\//g, protect);
  }

  if (language === 'python') {
    result = result.replace(/#[^\n]*/g, protect);
  }

  if (language === 'sql') {
    result = result.replace(/--[^\n]*/g, protect);
  }

  const keywords = keywordsByLanguage[language] ?? [];

  if (keywords.length > 0) {
    const pattern = new RegExp(
      `\\b(${keywords.join('|')})\\b`,
      language === 'sql' ? 'gi' : 'g',
    );

    result = result.replace(
      pattern,
      '<span class="keyword">$1</span>',
    );
  }

  result = result.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="number">$1</span>',
  );

  if (language === 'html') {
    result = result.replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)/g,
      '$1<span class="tag">$2</span>',
    );

    result = result.replace(
      /(\s)([a-zA-Z_:][\w:.-]*)(=)/g,
      '$1<span class="attr">$2</span>$3',
    );
  }

  if (language === 'css') {
    result = result.replace(
      /([a-zA-Z-]+)(?=\s*:)/g,
      '<span class="attr">$1</span>',
    );
  }

  if (language === 'json') {
    result = result.replace(
      /(&quot;|")([^"]+)(&quot;|")(\s*:)/g,
      '$1<span class="key">$2</span>$3$4',
    );
  }

  result = result.replace(
    /\u0000PROTECTED_(\d+)\u0000/g,
    (_, index: string) => {
      const original = protectedParts[Number(index)];

      if (
        original.startsWith('//') ||
        original.startsWith('/*') ||
        original.startsWith('#') ||
        original.startsWith('--')
      ) {
        return `<span class="comment">${original}</span>`;
      }

      return `<span class="string">${original}</span>`;
    },
  );

  return result;
}

function getIndentation(
  code: string,
  cursorPosition: number,
) {
  const lineStart =
    code.lastIndexOf('\n', cursorPosition - 1) + 1;

  const line = code.slice(lineStart, cursorPosition);

  return line.match(/^\s*/)?.[0] ?? '';
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: LanguageId;
  onCursorChange?: (line: number, column: number) => void;
}

function CodeEditor({
  value,
  onChange,
  language,
  onCursorChange,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  const updateCursor = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const position = textarea.selectionStart;
      const beforeCursor = textarea.value.slice(
        0,
        position,
      );

      const lines = beforeCursor.split('\n');

      onCursorChange?.(
        lines.length,
        (lines[lines.length - 1]?.length ?? 0) + 1,
      );
    },
    [onCursorChange],
  );

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.target;

    onChange(textarea.value);
    updateCursor(textarea);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (event.key === 'Tab') {
      event.preventDefault();

      const indentation = '  ';
      const selectedText = textarea.value.slice(start, end);

      if (selectedText.includes('\n')) {
        const before = textarea.value.slice(0, start);
        const after = textarea.value.slice(end);

        const updatedSelection = event.shiftKey
          ? selectedText
              .split('\n')
              .map((line) =>
                line.startsWith(indentation)
                  ? line.slice(indentation.length)
                  : line,
              )
              .join('\n')
          : selectedText
              .split('\n')
              .map((line) => indentation + line)
              .join('\n');

        onChange(
          before +
            updatedSelection +
            after,
        );

        requestAnimationFrame(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd =
            start + updatedSelection.length;
        });

        return;
      }

      if (event.shiftKey) {
        const lineStart =
          textarea.value.lastIndexOf('\n', start - 1) + 1;

        const linePrefix = textarea.value.slice(
          lineStart,
          start,
        );

        if (linePrefix.startsWith(indentation)) {
          const updated =
            textarea.value.slice(0, lineStart) +
            textarea.value.slice(
              lineStart + indentation.length,
            );

          onChange(updated);

          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(
              lineStart,
              start - indentation.length,
            );
            textarea.selectionEnd = Math.max(
              lineStart,
              end - indentation.length,
            );
          });
        }

        return;
      }

      const updated =
        textarea.value.slice(0, start) +
        indentation +
        textarea.value.slice(end);

      onChange(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart =
          start + indentation.length;
        textarea.selectionEnd =
          start + indentation.length;
      });

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      const indentation = getIndentation(
        textarea.value,
        start,
      );

      const before = textarea.value.slice(0, start);
      const after = textarea.value.slice(end);

      const updated =
        before +
        '\n' +
        indentation +
        after;

      const nextCursor =
        start + 1 + indentation.length;

      onChange(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart = nextCursor;
        textarea.selectionEnd = nextCursor;
      });

      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 's'
    ) {
      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent('nexastudy:save-code'),
      );
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'enter'
    ) {
      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent('nexastudy:run-code'),
      );
    }
  };

  const handleScroll = (
    event: React.UIEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.currentTarget;

    if (!highlightedRef.current) {
      return;
    }

    highlightedRef.current.scrollTop =
      textarea.scrollTop;

    highlightedRef.current.scrollLeft =
      textarea.scrollLeft;
  };

  const highlightedHtml = useMemo(
    () => highlightCode(value, language),
    [value, language],
  );

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {getLanguage(language).label}
          </span>
        </div>

        <Badge
          variant="secondary"
          className="text-[10px]"
        >
          UTF-8
        </Badge>
      </div>

      <div className="relative flex-1 overflow-hidden bg-card">
        <div
          ref={highlightedRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre font-mono text-sm leading-6"
          style={{
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div className="min-w-max py-0 pl-2 pr-4">
            {highlightedHtml
              .split('\n')
              .map((line, index) => (
                <div
                  key={index}
                  className="flex min-h-6 leading-6"
                >
                  <span className="sticky left-0 inline-block w-10 shrink-0 select-none bg-card pr-3 text-right text-xs text-muted-foreground">
                    {index + 1}
                  </span>

                  <span
                    className="text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: line || ' ',
                    }}
                  />
                </div>
              ))}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={(event) =>
            updateCursor(event.currentTarget)
          }
          onKeyUp={(event) =>
            updateCursor(event.currentTarget)
          }
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            'absolute inset-0 h-full w-full resize-none bg-transparent',
            'overflow-auto whitespace-pre font-mono text-sm leading-6',
            'outline-none',
            'text-transparent caret-foreground selection:bg-primary/20',
          )}
          style={{
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.5rem',
            padding: '0 1rem 0 3rem',
            tabSize: 2,
          }}
          aria-label={`${getLanguage(language).label} code editor`}
        />
      </div>
    </div>
  );
}

function runJavaScript(code: string): RunResult {
  try {
    const logs: string[] = [];

    const consoleProxy = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((value) => {
              if (typeof value === 'string') {
                return value;
              }

              try {
                return JSON.stringify(value, null, 2);
              } catch {
                return String(value);
              }
            })
            .join(' '),
        );
      },

      error: (...args: unknown[]) => {
        logs.push(
          `ERROR: ${args.map(String).join(' ')}`,
        );
      },

      warn: (...args: unknown[]) => {
        logs.push(
          `WARN: ${args.map(String).join(' ')}`,
        );
      },
    };

    /*
     * Function is intentionally limited to JavaScript execution
     * inside the browser and receives a restricted console object.
     *
     * This is NOT a secure multi-user sandbox. Do not use it for
     * untrusted code once NexaStudy becomes a shared/online app.
     */
    const execute = new Function(
      'console',
      `"use strict";\n${code}`,
    );

    execute(consoleProxy);

    return {
      status: 'success',
      output:
        logs.length > 0
          ? logs.join('\n')
          : 'Code executed successfully with no console output.',
    };
  } catch (error) {
    return {
      status: 'error',
      output:
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error),
    };
  }
}

function runCode(
  language: LanguageId,
  code: string,
): RunResult {
  if (!code.trim()) {
    return {
      status: 'error',
      output: 'Nothing to run. Write some code first.',
    };
  }

  if (language === 'javascript') {
    return runJavaScript(code);
  }

  if (language === 'json') {
    try {
      JSON.parse(code);

      return {
        status: 'success',
        output: 'Valid JSON ✓',
      };
    } catch (error) {
      return {
        status: 'error',
        output:
          error instanceof Error
            ? error.message
            : String(error),
      };
    }
  }

  if (language === 'html') {
    return {
      status: 'success',
      output:
        'HTML is ready. Use Download to save the file and preview it in your browser.',
    };
  }

  if (language === 'css') {
    return {
      status: 'success',
      output:
        'CSS syntax preview is available. A browser CSS runtime is not attached yet.',
    };
  }

  return {
    status: 'unsupported',
    output: `${getLanguage(language).label} execution is not available in the browser yet. A backend/sandbox runner can be connected later.`,
  };
}

export default function CodeEditorPage() {
  const [files, setFiles] = useState<EditorFile[]>([
    {
      id: '1',
      name: 'fibonacci.js',
      language: 'javascript',
      code: DEFAULT_CODE.javascript,
      createdAt: 'Just now',
    },
    {
      id: '2',
      name: 'users.ts',
      language: 'typescript',
      code: DEFAULT_CODE.typescript,
      createdAt: 'Yesterday',
    },
    {
      id: '3',
      name: 'sort.py',
      language: 'python',
      code: DEFAULT_CODE.python,
      createdAt: '2 days ago',
    },
  ]);

  const [activeFileId, setActiveFileId] =
    useState('1');

  const [showNewDialog, setShowNewDialog] =
    useState(false);

  const [newFileName, setNewFileName] =
    useState('');

  const [newFileLanguage, setNewFileLanguage] =
    useState<LanguageId>('javascript');

  const [copied, setCopied] =
    useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [fullscreen, setFullscreen] =
    useState(false);

  const [lastSaved, setLastSaved] =
    useState<string | null>(null);

  const [cursor, setCursor] = useState({
    line: 1,
    column: 1,
  });

  const [runResult, setRunResult] =
    useState<RunResult>({
      status: 'idle',
      output: '',
    });

  const [showOutput, setShowOutput] =
    useState(false);

  const activeFile =
    files.find((file) => file.id === activeFileId) ??
    files[0];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        STORAGE_KEY,
      );

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return;
      }

      const validFiles: EditorFile[] = parsed
        .filter(
          (file): file is EditorFile =>
            file &&
            typeof file.id === 'string' &&
            typeof file.name === 'string' &&
            typeof file.language === 'string' &&
            typeof file.code === 'string',
        )
        .map((file) => ({
          ...file,
          language: LANGUAGES.some(
            (language) =>
              language.id === file.language,
          )
            ? file.language
            : 'javascript',
        }));

      if (validFiles.length > 0) {
        setFiles(validFiles);
        setActiveFileId(validFiles[0].id);
      }
    } catch {
      // Ignore malformed local storage.
    }
  }, []);

  const persistFiles = useCallback(
    (nextFiles: EditorFile[]) => {
      setFiles(nextFiles);

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(nextFiles),
        );
      } catch {
        // Local persistence is best-effort.
      }
    },
    [],
  );

  const handleCodeChange = useCallback(
    (code: string) => {
      if (!activeFile) {
        return;
      }

      const nextFiles = files.map((file) =>
        file.id === activeFile.id
          ? { ...file, code }
          : file,
      );

      persistFiles(nextFiles);
    },
    [activeFile, files, persistFiles],
  );

  const handleSave = useCallback(() => {
    if (!activeFile) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(files),
      );
    } catch {
      // Best effort.
    }

    setLastSaved(
      new Date().toLocaleTimeString(),
    );
  }, [activeFile, files]);

  const handleRun = useCallback(() => {
    if (!activeFile) {
      return;
    }

    const result = runCode(
      activeFile.language,
      activeFile.code,
    );

    setRunResult(result);
    setShowOutput(true);
  }, [activeFile]);

  useEffect(() => {
    const saveHandler = () => {
      handleSave();
    };

    const runHandler = () => {
      handleRun();
    };

    window.addEventListener(
      'nexastudy:save-code',
      saveHandler,
    );

    window.addEventListener(
      'nexastudy:run-code',
      runHandler,
    );

    return () => {
      window.removeEventListener(
        'nexastudy:save-code',
        saveHandler,
      );

      window.removeEventListener(
        'nexastudy:run-code',
        runHandler,
      );
    };
  }, [handleSave, handleRun]);

  const handleNewFile = () => {
    if (!newFileName.trim()) {
      return;
    }

    const fileName = ensureFileExtension(
      newFileName,
      newFileLanguage,
    );

    const newFile: EditorFile = {
      id:
        typeof crypto !== 'undefined' &&
        'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
      name: fileName,
      language: newFileLanguage,
      code: DEFAULT_CODE[newFileLanguage],
      createdAt: 'Just now',
    };

    const nextFiles = [...files, newFile];

    persistFiles(nextFiles);
    setActiveFileId(newFile.id);
    setShowNewDialog(false);
    setNewFileName('');
    setRunResult({
      status: 'idle',
      output: '',
    });
  };

  const handleDeleteFile = (
    id: string,
    event?: React.MouseEvent,
  ) => {
    event?.stopPropagation();

    if (files.length <= 1) {
      return;
    }

    const index = files.findIndex(
      (file) => file.id === id,
    );

    const remaining = files.filter(
      (file) => file.id !== id,
    );

    persistFiles(remaining);

    if (id === activeFileId) {
      const fallback =
        remaining[index] ??
        remaining[index - 1] ??
        remaining[0];

      setActiveFileId(fallback.id);
    }

    setRunResult({
      status: 'idle',
      output: '',
    });
  };

  const handleCopy = async () => {
    if (!activeFile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        activeFile.code,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!activeFile) {
      return;
    }

    const blob = new Blob(
      [activeFile.code],
      { type: 'text/plain;charset=utf-8' },
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download =
      ensureFileExtension(
        activeFile.name,
        activeFile.language,
      );

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleLanguageChange = (
    language: LanguageId,
  ) => {
    if (!activeFile) {
      return;
    }

    const nextFiles = files.map((file) =>
      file.id === activeFile.id
        ? { ...file, language }
        : file,
    );

    persistFiles(nextFiles);
    setRunResult({
      status: 'idle',
      output: '',
    });
  };

  const lineCount = activeFile
    ? activeFile.code.split('\n').length
    : 1;

  const currentLanguage =
    activeFile?.language ?? 'javascript';

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden bg-card',
        fullscreen &&
          'fixed inset-0 z-50 rounded-none shadow-none',
      )}
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSidebarCollapsed(
                (previous) => !previous,
              )
            }
            aria-label="Toggle file sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </Button>

          <FileCode
            size={17}
            className="shrink-0 text-primary"
          />

          <span className="hidden text-sm font-semibold sm:inline">
            Code Editor
          </span>

          <Badge
            variant="secondary"
            className="text-[10px]"
          >
            {files.length} file
            {files.length !== 1 ? 's' : ''}
          </Badge>

          {activeFile && (
            <span className="hidden max-w-[180px] truncate font-mono text-xs text-muted-foreground md:inline">
              / {activeFile.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {activeFile && (
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500/70" />
              {getLanguage(
                activeFile.language,
              ).label}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRun}
            disabled={!activeFile}
            title="Run code (Ctrl/Cmd + Enter)"
          >
            <Play size={14} />
            <span className="ml-1 hidden md:inline">
              Run
            </span>
          </Button>

          <Menu>
            <MenuTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
              >
                <ChevronRight size={14} />
                <span className="hidden text-xs sm:inline">
                  Actions
                </span>
              </Button>
            </MenuTrigger>

            <MenuItem onClick={handleSave}>
              <Save
                size={14}
                className="mr-1.5"
              />
              Save
            </MenuItem>

            <MenuItem onClick={handleCopy}>
              {copied ? (
                <Check
                  size={14}
                  className="mr-1.5 text-green-500"
                />
              ) : (
                <Copy
                  size={14}
                  className="mr-1.5"
                />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </MenuItem>

            <MenuItem onClick={handleDownload}>
              <Download
                size={14}
                className="mr-1.5"
              />
              Download
            </MenuItem>
          </Menu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFullscreen(
                (previous) => !previous,
              )
            }
            title={
              fullscreen
                ? 'Exit fullscreen'
                : 'Fullscreen'
            }
          >
            {fullscreen ? (
              <Minimize2 size={14} />
            ) : (
              <Maximize2 size={14} />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setShowNewDialog(true)
            }
            title="New file"
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* File sidebar */}
        <aside
          className={cn(
            'flex w-60 shrink-0 flex-col border-r border-border bg-muted/10 transition-all duration-200',
            sidebarCollapsed &&
              'w-0 overflow-hidden border-r-0',
          )}
        >
          <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Files
            </span>

            <button
              type="button"
              onClick={() =>
                setShowNewDialog(true)
              }
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              title="New file"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {files.map((file) => {
                const language =
                  getLanguage(file.language);

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => {
                      setActiveFileId(file.id);
                      setRunResult({
                        status: 'idle',
                        output: '',
                      });
                    }}
                    className={cn(
                      'group flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition-colors',
                      activeFileId === file.id
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-[8px] font-bold"
                      style={{
                        color: language.color,
                      }}
                    >
                      {language.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {file.name}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {file.createdAt}
                      </span>
                    </span>

                    {files.length > 1 && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Delete ${file.name}`}
                        onClick={(event) =>
                          handleDeleteFile(
                            file.id,
                            event,
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' ||
                            event.key === ' '
                          ) {
                            event.preventDefault();
                            handleDeleteFile(
                              file.id,
                            );
                          }
                        }}
                        className="rounded p-1 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/50 p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                setShowNewDialog(true)
              }
            >
              <Plus size={14} />
              New File
            </Button>
          </div>
        </aside>

        {/* Main editor */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {activeFile ? (
            <>
              {/* Language bar */}
              <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border/60 bg-muted/5 px-2 py-1.5">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() =>
                      handleLanguageChange(
                        language.id,
                      )
                    }
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors',
                      currentLanguage ===
                        language.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                    title={language.label}
                  >
                    <span
                      className="font-bold"
                      style={{
                        color: language.color,
                      }}
                    >
                      {language.icon}
                    </span>

                    <span className="hidden lg:inline">
                      {language.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Editor */}
              <div className="min-h-0 flex-1">
                <CodeEditor
                  value={activeFile.code}
                  onChange={handleCodeChange}
                  language={activeFile.language}
                  onCursorChange={(line, column) =>
                    setCursor({
                      line,
                      column,
                    })
                  }
                />
              </div>

              {/* Output panel */}
              {showOutput && (
                <section className="max-h-64 shrink-0 border-t border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Play
                        size={13}
                        className="text-primary"
                      />

                      <span className="text-xs font-semibold">
                        Output
                      </span>

                      {runResult.status !==
                        'idle' && (
                        <Badge
                          variant={
                            runResult.status ===
                            'success'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-[9px]"
                        >
                          {runResult.status}
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowOutput(false)
                      }
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Close output"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-5 text-muted-foreground">
                    {runResult.output ||
                      'No output yet.'}
                  </pre>
                </section>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<FileCode size={40} />}
                title="No files open"
                description="Create a new file to start coding."
              />
            </div>
          )}
        </main>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/20 px-3 py-1 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            Ln {cursor.line}, Col {cursor.column}
          </span>

          <span>
            {lineCount} line
            {lineCount !== 1 ? 's' : ''}
          </span>

          {activeFile && (
            <span>
              {activeFile.code.length} chars
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="hidden items-center gap-1 sm:flex">
              <Clock size={10} />
              Saved {lastSaved}
            </span>
          )}

          <span>UTF-8</span>
          <span>Spaces: 2</span>
        </div>
      </div>

      {/* New file dialog */}
      <Dialog
        open={showNewDialog}
        onClose={() =>
          setShowNewDialog(false)
        }
        title="New File"
        description="Choose a language and name for your new file."
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Language
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LANGUAGES.map((language) => (
                <button
                  key={language.id}
                  type="button"
                  onClick={() =>
                    setNewFileLanguage(
                      language.id,
                    )
                  }
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors',
                    newFileLanguage ===
                      language.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: language.color,
                    }}
                  >
                    {language.icon}
                  </span>

                  <span className="text-[10px]">
                    {language.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              File name
            </label>

            <Input
              value={newFileName}
              onChange={(event) =>
                setNewFileName(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNewFile();
                }
              }}
              placeholder={`example.${getLanguage(
                newFileLanguage,
              ).extension}`}
              className="font-mono text-sm"
            />

            <p className="mt-1 text-[10px] text-muted-foreground">
              Extension will be added automatically if missing.
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              variant="ghost"
              onClick={() =>
                setShowNewDialog(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleNewFile}
              disabled={!newFileName.trim()}
            >
              <Plus size={14} />
              Create File
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}