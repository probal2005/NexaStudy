'use client';

import { useMemo, useState } from 'react';

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onChange?: (data: {
    title: string;
    content: string;
    wordCount: number;
    characterCount: number;
  }) => void;
}

export function NoteEditor({
  initialTitle = '',
  initialContent = '',
  onChange,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const stats = useMemo(() => {
    const trimmed = content.trim();

    const wordCount = trimmed
      ? trimmed.split(/\s+/).filter(Boolean).length
      : 0;

    const characterCount = content.length;

    return {
      wordCount,
      characterCount,
    };
  }, [content]);

  const handleTitleChange = (value: string) => {
    setTitle(value);

    onChange?.({
      title: value,
      content,
      ...stats,
    });
  };

  const handleContentChange = (value: string) => {
    setContent(value);

    const trimmed = value.trim();

    const wordCount = trimmed
      ? trimmed.split(/\s+/).filter(Boolean).length
      : 0;

    onChange?.({
      title,
      content: value,
      wordCount,
      characterCount: value.length,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <input
        value={title}
        onChange={(event) => handleTitleChange(event.target.value)}
        placeholder="Note title..."
        className="w-full border-b bg-transparent px-4 py-3 text-lg font-semibold outline-none placeholder:text-muted-foreground"
      />

      <textarea
        value={content}
        onChange={(event) =>
          handleContentChange(event.target.value)
        }
        placeholder="Start writing your note..."
        className="min-h-64 w-full resize-y bg-transparent p-4 text-sm leading-7 outline-none placeholder:text-muted-foreground"
      />

      <div className="flex items-center justify-end gap-4 border-t px-4 py-2 text-xs text-muted-foreground">
        <span>{stats.wordCount} words</span>
        <span>{stats.characterCount} characters</span>
      </div>
    </div>
  );
}