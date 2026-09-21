'use client';

import type { SupportedLanguage } from './CodeEditor';

interface CodeEditorLanguageSelectProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
}

const languages: Array<{
  value: SupportedLanguage;
  label: string;
}> = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
];

export default function CodeEditorLanguageSelect({
  value,
  onChange,
}: CodeEditorLanguageSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Language</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as SupportedLanguage)
        }
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}