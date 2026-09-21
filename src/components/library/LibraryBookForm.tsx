'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';

import type { LibraryBook } from './LibraryBookCard';

interface LibraryBookFormProps {
  open: boolean;
  initialBook?: LibraryBook | null;
  categories: string[];
  onClose: () => void;
  onSubmit: (book: LibraryBook) => void;
}

const emptyBook: LibraryBook = {
  id: '',
  title: '',
  author: '',
  description: '',
  category: '',
  type: 'book',
  status: 'unread',
  progress: 0,
  favorite: false,
  coverUrl: '',
  url: '',
  notes: '',
};

export function LibraryBookForm({
  open,
  initialBook,
  categories,
  onClose,
  onSubmit,
}: LibraryBookFormProps) {
  const [form, setForm] = useState<LibraryBook>(emptyBook);

  useEffect(() => {
    if (initialBook) {
      setForm(initialBook);
    } else {
      setForm(emptyBook);
    }
  }, [initialBook, open]);

  if (!open) {
    return null;
  }

  const update = <K extends keyof LibraryBook>(
    key: K,
    value: LibraryBook[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim()) {
      return;
    }

    onSubmit({
      ...form,
      id: form.id || crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category.trim(),
      progress: Math.min(
        100,
        Math.max(0, Number(form.progress) || 0),
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-semibold">
              {initialBook ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <p className="text-xs text-muted-foreground">
              Add a book, PDF, article, course, or reference.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium">Title *</span>
            <input
              required
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Clean Code"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Author</span>
            <input
              value={form.author || ''}
              onChange={(event) => update('author', event.target.value)}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Author name"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Category *</span>
            <input
              required
              list="library-categories"
              value={form.category}
              onChange={(event) => update('category', event.target.value)}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Programming"
            />

            <datalist id="library-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Type</span>
            <select
              value={form.type}
              onChange={(event) =>
                update(
                  'type',
                  event.target.value as LibraryBook['type'],
                )
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            >
              <option value="book">Book</option>
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
              <option value="reference">Reference</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                update(
                  'status',
                  event.target.value as LibraryBook['status'],
                )
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            >
              <option value="unread">Unread</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Progress (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={form.progress ?? 0}
              onChange={(event) =>
                update('progress', Number(event.target.value))
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Resource URL</span>
            <input
              type="url"
              value={form.url || ''}
              onChange={(event) => update('url', event.target.value)}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
              placeholder="https://..."
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium">Cover URL</span>
            <input
              type="url"
              value={form.coverUrl || ''}
              onChange={(event) =>
                update('coverUrl', event.target.value)
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none"
              placeholder="https://..."
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(event) =>
                update('description', event.target.value)
              }
              className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Short description..."
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-medium">Notes</span>
            <textarea
              rows={3}
              value={form.notes || ''}
              onChange={(event) => update('notes', event.target.value)}
              className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Personal study notes..."
            />
          </label>

          <label className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(form.favorite)}
              onChange={(event) =>
                update('favorite', event.target.checked)
              }
              className="h-4 w-4 rounded border"
            />
            <span className="text-sm">Add to favorites</span>
          </label>
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
            Save Resource
          </button>
        </div>
      </form>
    </div>
  );
}