'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';

import type { Note } from './NoteCard';
import { NoteEditor } from './NoteEditor';

interface NoteFormProps {
  open: boolean;
  initialNote?: Note | null;
  categories: string[];
  onClose: () => void;
  onSubmit: (note: Note) => void;
}

const emptyNote: Note = {
  id: '',
  title: '',
  content: '',
  category: '',
  subject: '',
  tags: [],
  color: '',
  pinned: false,
  favorite: false,
  archived: false,
};

export function NoteForm({
  open,
  initialNote,
  categories,
  onClose,
  onSubmit,
}: NoteFormProps) {
  const [form, setForm] = useState<Note>(emptyNote);
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    if (initialNote) {
      setForm(initialNote);
      setTagsText(initialNote.tags?.join(', ') || '');
    } else {
      setForm(emptyNote);
      setTagsText('');
    }
  }, [initialNote, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim()) {
      return;
    }

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({
      ...form,
      id: form.id || crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category.trim(),
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-semibold">
              {initialNote ? 'Edit Note' : 'Create Note'}
            </h2>

            <p className="text-xs text-muted-foreground">
              Write and organize your study material.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close note editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <NoteEditor
            initialTitle={form.title}
            initialContent={form.content}
            onChange={(data) => {
              setForm((current) => ({
                ...current,
                title: data.title,
                content: data.content,
              }));
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Category *
              </span>

              <input
                required
                list="note-categories"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Programming"
              />

              <datalist id="note-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">Subject</span>

              <input
                value={form.subject || ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    subject: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Database Management"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Tags
              </span>

              <input
                value={tagsText}
                onChange={(event) =>
                  setTagsText(event.target.value)
                }
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
                placeholder="react, exam, important"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Accent Color
              </span>

              <input
                type="color"
                value={form.color || '#6366f1'}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
                className="h-10 w-full cursor-pointer rounded-lg border bg-background p-1"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.pinned)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    pinned: event.target.checked,
                  }))
                }
              />
              Pin note
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.favorite)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    favorite: event.target.checked,
                  }))
                }
              />
              Favorite
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Save className="h-4 w-4" />
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
}