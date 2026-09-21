'use client';

import { AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

interface CodeEditorOutputProps {
  output: string[];
}

export default function CodeEditorOutput({
  output,
}: CodeEditorOutputProps) {
  const hasError = output.some(
    (line) =>
      line.toLowerCase().includes('failed') ||
      line.toLowerCase().includes('error'),
  );

  return (
    <section className="border-t border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Terminal className="h-4 w-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold">Output</h2>

        {output.length > 0 &&
          (hasError ? (
            <AlertCircle className="ml-auto h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
          ))}
      </div>

      <div className="min-h-28 max-h-64 overflow-auto bg-black/[0.03] px-4 py-4 dark:bg-white/[0.02]">
        {output.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Run your code to see the output here.
          </p>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-6">
            {output.join('\n')}
          </pre>
        )}
      </div>
    </section>
  );
}