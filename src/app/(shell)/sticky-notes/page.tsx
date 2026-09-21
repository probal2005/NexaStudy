'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog, EmptyState, Menu, MenuTrigger, MenuItem } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Archive,
  Clock,
  Edit3,
  Grid2X2,
  List,
  MoreHorizontal,
  Pin,
  Plus,
  RotateCcw,
  Search,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react';

interface StickyNote {
  id: string;
  title: string;
  content: string;
  color:
    | 'yellow'
    | 'green'
    | 'blue'
    | 'pink'
    | 'purple'
    | 'orange'
    | 'white';
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

type NoteColor = StickyNote['color'];
type FilterMode = 'active' | 'archived' | 'all';

const STORAGE_KEY = 'nexastudy_sticky_notes_v1';

const colorMap: Record<
  NoteColor,
  { bg: string; border: string; text: string; dot: string }
> = {
  yellow: {
    bg: 'bg-yellow-400/90',
    border: 'border-yellow-500',
    text: 'text-yellow-950',
    dot: 'bg-yellow-400',
  },
  green: {
    bg: 'bg-green-400/90',
    border: 'border-green-500',
    text: 'text-green-950',
    dot: 'bg-green-400',
  },
  blue: {
    bg: 'bg-blue-400/90',
    border: 'border-blue-500',
    text: 'text-blue-950',
    dot: 'bg-blue-400',
  },
  pink: {
    bg: 'bg-pink-400/90',
    border: 'border-pink-500',
    text: 'text-pink-950',
    dot: 'bg-pink-400',
  },
  purple: {
    bg: 'bg-purple-400/90',
    border: 'border-purple-500',
    text: 'text-purple-950',
    dot: 'bg-purple-400',
  },
  orange: {
    bg: 'bg-orange-400/90',
    border: 'border-orange-500',
    text: 'text-orange-950',
    dot: 'bg-orange-400',
  },
  white: {
    bg: 'bg-white dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-900 dark:text-gray-100',
    dot: 'bg-white',
  },
};

const colorPresets: {
  value: NoteColor;
  label: string;
  color: string;
}[] = [
  { value: 'yellow', label: 'Yellow', color: '#FBBF24' },
  { value: 'green', label: 'Green', color: '#4ADE80' },
  { value: 'blue', label: 'Blue', color: '#60A5FA' },
  { value: 'pink', label: 'Pink', color: '#F472B6' },
  { value: 'purple', label: 'Purple', color: '#A78BFA' },
  { value: 'orange', label: 'Orange', color: '#FB923C' },
  { value: 'white', label: 'White', color: '#F1F5F9' },
];

const seedNotes: StickyNote[] = [
  {
    id: 'seed-1',
    title: 'Reminders for Today',
    content:
      '1. Submit DBMS assignment by 11:59 PM\n2. Physics lab report due Friday\n3. Buy groceries on the way back\n4. Call Mom',
    color: 'yellow',
    pinned: true,
    archived: false,
    createdAt: '2026-09-18T08:00:00',
    updatedAt: '2026-09-18T08:00:00',
  },
  {
    id: 'seed-2',
    title: 'Book Recommendations',
    content:
      '• "Atomic Habits" by James Clear\n• "Deep Work" by Cal Newport\n• "The Psychology of Money" by Morgan Housel',
    color: 'green',
    pinned: false,
    archived: false,
    createdAt: '2026-09-17T10:00:00',
    updatedAt: '2026-09-17T10:00:00',
  },
  {
    id: 'seed-3',
    title: 'Meeting Notes - Project Group',
    content:
      'Discussed project timeline:\n- Phase 1: Research\n- Phase 2: Implementation\n- Phase 3: Testing\n- Final submission',
    color: 'blue',
    pinned: false,
    archived: false,
    createdAt: '2026-09-16T14:00:00',
    updatedAt: '2026-09-16T14:00:00',
  },
  {
    id: 'seed-4',
    title: 'Recipe: Pasta Alfredo',
    content:
      'Ingredients:\n- 200g pasta\n- 200ml heavy cream\n- 100g Parmesan\n- 2 cloves garlic\n- Salt, pepper, parsley\n\nCook pasta al dente. Sauté garlic. Add cream, simmer. Add cheese. Mix with pasta.',
    color: 'pink',
    pinned: false,
    archived: false,
    createdAt: '2026-09-15T12:00:00',
    updatedAt: '2026-09-15T12:00:00',
  },
  {
    id: 'seed-5',
    title: 'Exam Prep Checklist',
    content:
      '☐ Review all chapter notes\n☐ Solve 3 practice papers\n☐ Revise formulas\n☐ Get 8 hours sleep before exam',
    color: 'purple',
    pinned: false,
    archived: false,
    createdAt: '2026-09-14T09:00:00',
    updatedAt: '2026-09-14T09:00:00',
  },
  {
    id: 'seed-6',
    title: 'Weekend Plans',
    content:
      'Saturday:\n- Morning jog\n- Study 3 hours\n- Movie with friends\n\nSunday:\n- Clean room\n- Weekly planning',
    color: 'orange',
    pinned: false,
    archived: false,
    createdAt: '2026-09-13T18:00:00',
    updatedAt: '2026-09-13T18:00:00',
  },
  {
    id: 'seed-7',
    title: 'Archived: Old Ideas',
    content: 'This note has been archived.',
    color: 'white',
    pinned: false,
    archived: true,
    createdAt: '2026-09-10T08:00:00',
    updatedAt: '2026-09-12T09:00:00',
  },
];

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadNotes(): StickyNote[] {
  if (typeof window === 'undefined') {
    return seedNotes;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotes));
      return seedNotes;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return seedNotes;
    }

    return parsed as StickyNote[];
  } catch {
    return seedNotes;
  }
}

function formatNoteDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function truncateContent(content: string, length = 90) {
  const normalized = content.replace(/\s+/g, ' ').trim();

  if (normalized.length <= length) {
    return normalized;
  }

  return `${normalized.slice(0, length).trim()}...`;
}

export default function StickyNotesPage() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('active');

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    color: NoteColor;
  }>({
    title: '',
    content: '',
    color: 'yellow',
  });

  useEffect(() => {
    setNotes(loadNotes());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, mounted]);

  const activeNotes = useMemo(
    () => notes.filter((note) => !note.archived),
    [notes],
  );

  const archivedNotes = useMemo(
    () => notes.filter((note) => note.archived),
    [notes],
  );

  const visibleNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesFilter =
        filterMode === 'all'
          ? true
          : filterMode === 'archived'
            ? note.archived
            : !note.archived;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery, filterMode]);

  const sortedNotes = useMemo(() => {
    return [...visibleNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) {
        return -1;
      }

      if (!a.pinned && b.pinned) {
        return 1;
      }

      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      );
    });
  }, [visibleNotes]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      color: 'yellow',
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setShowNewDialog(true);
  };

  const handleCreate = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      return;
    }

    const now = new Date().toISOString();

    const note: StickyNote = {
      id: createId(),
      title,
      content: formData.content.trim(),
      color: formData.color,
      pinned: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((current) => [note, ...current]);
    setShowNewDialog(false);
    resetForm();
  };

  const openEditDialog = (note: StickyNote) => {
    setEditingNote({ ...note });
  };

  const handleSaveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingNote) {
      return;
    }

    const title = editingNote.title.trim();

    if (!title) {
      return;
    }

    const updatedNote: StickyNote = {
      ...editingNote,
      title,
      content: editingNote.content.trim(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) =>
      current.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      ),
    );

    setEditingNote(null);
  };

  const handleDelete = (id: string) => {
    const note = notes.find((item) => item.id === id);

    if (!note) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${note.title}" permanently?`,
    );

    if (!confirmed) {
      return;
    }

    setNotes((current) => current.filter((item) => item.id !== id));

    if (expandedNote === id) {
      setExpandedNote(null);
    }

    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };

  const handleArchive = (id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: true,
              pinned: false,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );

    if (expandedNote === id) {
      setExpandedNote(null);
    }
  };

  const handleRestore = (id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: false,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
  };

  const handlePin = (id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
  };

  const handleDuplicate = (note: StickyNote) => {
    const now = new Date().toISOString();

    const duplicate: StickyNote = {
      ...note,
      id: createId(),
      title: `${note.title} Copy`,
      pinned: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((current) => [duplicate, ...current]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const activeFilterLabel =
    filterMode === 'active'
      ? 'Active'
      : filterMode === 'archived'
        ? 'Archived'
        : 'All';

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Sticky Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Loading your notes...
          </p>
        </div>

        <Card className="p-8 text-center text-muted-foreground">
          Loading notes...
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Sticky Notes
            </h1>

            <Badge variant="outline">
              {activeNotes.length} active
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            Capture quick ideas, reminders, and study notes.
          </p>
        </div>

        <Button onClick={openCreateDialog}>
          <Plus size={15} className="mr-1.5" />
          New Note
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border py-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search title or content..."
            className="pl-9 pr-9"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['active', 'archived', 'all'] as FilterMode[]).map(
            (filter) => {
              const label =
                filter === 'active'
                  ? `Active (${activeNotes.length})`
                  : filter === 'archived'
                    ? `Archived (${archivedNotes.length})`
                    : `All (${notes.length})`;

              const active = filterMode === filter;

              return (
                <Button
                  key={filter}
                  type="button"
                  variant={active ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMode(filter)}
                >
                  {label}
                </Button>
              );
            },
          )}

          <div className="ml-auto flex items-center rounded-lg border border-border p-1">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              type="button"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Result summary */}
      <div className="flex items-center justify-between py-3">
        <p className="text-xs text-muted-foreground">
          {sortedNotes.length} {activeFilterLabel.toLowerCase()} note
          {sortedNotes.length === 1 ? '' : 's'}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>
      </div>

      {/* Notes */}
      {sortedNotes.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={<StickyNote size={24} />}
            title={
              searchQuery
                ? 'No matching notes'
                : filterMode === 'archived'
                  ? 'No archived notes'
                  : 'No notes yet'
            }
            description={
              searchQuery
                ? 'Try another search term or clear the search.'
                : 'Create your first sticky note to get started.'
            }
            action={
              searchQuery
                ? {
                    label: 'Clear Search',
                    onClick: handleClearSearch,
                  }
                : {
                    label: 'New Note',
                    onClick: openCreateDialog,
                  }
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedNotes.map((note) => {
            const colors = colorMap[note.color];
            const isExpanded = expandedNote === note.id;

            return (
              <div
                key={note.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  colors.bg,
                  colors.border,
                  note.pinned &&
                    'ring-2 ring-yellow-400 ring-offset-2',
                  note.archived && 'opacity-70',
                )}
              >
                {/* Note header */}
                <div className="flex items-center justify-between gap-2 border-b border-black/10 p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedNote(
                        isExpanded ? null : note.id,
                      )
                    }
                    className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                  >
                    {note.pinned && (
                      <Pin
                        size={11}
                        className="flex-shrink-0 text-yellow-700"
                        fill="currentColor"
                      />
                    )}

                    <span
                      className={cn(
                        'truncate text-xs font-semibold',
                        colors.text,
                      )}
                    >
                      {note.title}
                    </span>
                  </button>

                  <div
                    className={cn(
                      'flex items-center gap-1',
                      colors.text,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handlePin(note.id)}
                      className="rounded p-1 hover:bg-black/10"
                      aria-label={
                        note.pinned ? 'Unpin note' : 'Pin note'
                      }
                      title={note.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin
                        size={12}
                        fill={note.pinned ? 'currentColor' : 'none'}
                      />
                    </button>

                    <Menu>
                      <MenuTrigger>
                        <button
                          type="button"
                          className="rounded p-1 hover:bg-black/10"
                          aria-label="Note actions"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      </MenuTrigger>

                      <MenuItem
                        onClick={() => openEditDialog(note)}
                        icon={<Edit3 size={12} />}
                      >
                        Edit
                      </MenuItem>

                      <MenuItem
                        onClick={() => handleDuplicate(note)}
                        icon={<StickyNote size={12} />}
                      >
                        Duplicate
                      </MenuItem>

                      {note.archived ? (
                        <MenuItem
                          onClick={() => handleRestore(note.id)}
                          icon={<RotateCcw size={12} />}
                        >
                          Restore
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={() => handleArchive(note.id)}
                          icon={<Archive size={12} />}
                        >
                          Archive
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={() => handleDelete(note.id)}
                        icon={<Trash2 size={12} />}
                        danger
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </div>

                {/* Note body */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedNote(isExpanded ? null : note.id)
                  }
                  className="flex flex-1 flex-col text-left"
                >
                  <div
                    className={cn(
                      'p-4 transition-all',
                      isExpanded
                        ? 'min-h-[150px]'
                        : 'min-h-[110px]',
                    )}
                  >
                    <p
                      className={cn(
                        'whitespace-pre-wrap text-xs leading-relaxed',
                        colors.text,
                        !isExpanded && 'line-clamp-5',
                      )}
                    >
                      {note.content || 'No content'}
                    </p>
                  </div>

                  <div
                    className={cn(
                      'mt-auto flex items-center justify-between px-4 pb-3 text-[10px]',
                      colors.text,
                    )}
                  >
                    <span className="flex items-center gap-1 opacity-70">
                      <Clock size={9} />
                      {formatNoteDate(note.updatedAt)}
                    </span>

                    {isExpanded && (
                      <span className="opacity-60">
                        Click to collapse
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Note
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedNotes.map((note) => {
                  const colors = colorMap[note.color];

                  return (
                    <tr
                      key={note.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedNote(
                              expandedNote === note.id
                                ? null
                                : note.id,
                            )
                          }
                          className="flex max-w-[520px] items-center gap-3 text-left"
                        >
                          <span
                            className={cn(
                              'h-3 w-3 flex-shrink-0 rounded-sm border',
                              colors.dot,
                              colors.border,
                            )}
                          />

                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              {note.pinned && (
                                <Pin
                                  size={11}
                                  className="text-yellow-500"
                                  fill="currentColor"
                                />
                              )}
                              <span className="truncate">
                                {note.title}
                              </span>
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {truncateContent(note.content)}
                            </p>
                          </div>
                        </button>

                        {expandedNote === note.id && (
                          <div className="mt-3 rounded-lg bg-muted/40 p-3">
                            <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                              {note.content || 'No content'}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {formatNoteDate(note.updatedAt)}
                      </td>

                      <td className="px-4 py-3">
                        {note.archived ? (
                          <Badge variant="outline">
                            Archived
                          </Badge>
                        ) : note.pinned ? (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pinned
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Active
                          </Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Menu>
                          <MenuTrigger>
                            <button
                              type="button"
                              className="rounded-md p-1.5 hover:bg-muted"
                              aria-label="Note actions"
                            >
                              <MoreHorizontal
                                size={15}
                                className="text-muted-foreground"
                              />
                            </button>
                          </MenuTrigger>

                          <MenuItem
                            onClick={() => openEditDialog(note)}
                            icon={<Edit3 size={12} />}
                          >
                            Edit
                          </MenuItem>

                          <MenuItem
                            onClick={() => handleDuplicate(note)}
                            icon={<StickyNote size={12} />}
                          >
                            Duplicate
                          </MenuItem>

                          {note.archived ? (
                            <MenuItem
                              onClick={() =>
                                handleRestore(note.id)
                              }
                              icon={<RotateCcw size={12} />}
                            >
                              Restore
                            </MenuItem>
                          ) : (
                            <MenuItem
                              onClick={() =>
                                handleArchive(note.id)
                              }
                              icon={<Archive size={12} />}
                            >
                              Archive
                            </MenuItem>
                          )}

                          <MenuItem
                            onClick={() => handleDelete(note.id)}
                            icon={<Trash2 size={12} />}
                            danger
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Note Dialog */}
      <Dialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        title="New Sticky Note"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <Input
              autoFocus
              placeholder="Note title..."
              value={formData.title}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />

            {!formData.title.trim() && (
              <p className="mt-1 text-xs text-muted-foreground">
                A title is required.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Content
            </label>

            <textarea
              placeholder="Write your note..."
              value={formData.content}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              className="h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Color
            </label>

            <div className="flex flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      color: color.value,
                    }))
                  }
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-all',
                    formData.color === color.value
                      ? 'scale-110 border-gray-900'
                      : 'border-transparent hover:scale-105',
                  )}
                  style={{ backgroundColor: color.color }}
                  aria-label={color.label}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewDialog(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!formData.title.trim()}
            >
              Create Note
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      {editingNote && (
        <Dialog
          open
          onClose={() => setEditingNote(null)}
          title="Edit Sticky Note"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Title
              </label>

              <Input
                autoFocus
                value={editingNote.title}
                onChange={(event) =>
                  setEditingNote((current) =>
                    current
                      ? {
                          ...current,
                          title: event.target.value,
                        }
                      : null,
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Content
              </label>

              <textarea
                value={editingNote.content}
                onChange={(event) =>
                  setEditingNote((current) =>
                    current
                      ? {
                          ...current,
                          content: event.target.value,
                        }
                      : null,
                  )
                }
                className="h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Color
              </label>

              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setEditingNote((current) =>
                        current
                          ? {
                              ...current,
                              color: color.value,
                            }
                          : null,
                      )
                    }
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      editingNote.color === color.value
                        ? 'scale-110 border-gray-900'
                        : 'border-transparent hover:scale-105',
                    )}
                    style={{ backgroundColor: color.color }}
                    aria-label={color.label}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDelete(editingNote.id)}
                className="text-destructive"
              >
                <Trash2 size={14} className="mr-1.5" />
                Delete
              </Button>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingNote(null)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!editingNote.title.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}