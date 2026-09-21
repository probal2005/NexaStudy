'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Clock,
  FileText,
  Grid2X2,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Dialog,
  EmptyState,
  Menu,
  MenuItem,
  MenuTrigger,
} from '@/components/ui/Header';
import { cn } from '@/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string | null;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  wordCount: number;
  charCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

type ViewMode = 'list' | 'grid';

const STORAGE_KEY = 'nexastudy_notes';

const subjects: Subject[] = [
  {
    id: 's1',
    name: 'CS 301 - DBMS',
    color: '#4F46E5',
  },
  {
    id: 's2',
    name: 'PH 201 - Thermodynamics',
    color: '#F59E0B',
  },
  {
    id: 's3',
    name: 'MA 202 - Calculus II',
    color: '#10B981',
  },
  {
    id: 's4',
    name: 'CH 201 - Physical Chemistry',
    color: '#EF4444',
  },
  {
    id: 's5',
    name: 'EC 201 - Economics',
    color: '#EC4899',
  },
];

const seedNotes: Note[] = [
  {
    id: '1',
    title: 'DBMS Indexing Techniques',
    content:
      '# Indexing in DBMS\n\n## What is Indexing?\n\nIndexing is a data structure technique used to quickly locate and access data in a database table.\n\n## Types of Indexes\n\n1. **Clustered Index** - Determines the physical order of data\n2. **Non-Clustered Index** - Creates a separate structure with pointers\n3. **Unique Index** - Ensures all values are different\n\n## B-Tree Indexing\n\nB-Tree is the most common index structure. It maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.\n\n## Key Points\n- Index improves read performance\n- Index slows down write operations\n- Choose columns used frequently in WHERE clauses\n- Composite indexes work well for multi-column queries',
    subjectId: 's1',
    tags: ['dbms', 'indexes', 'database'],
    favorite: true,
    archived: false,
    wordCount: 89,
    charCount: 512,
    createdAt: '2026-09-18T10:30:00',
    updatedAt: '2026-09-18T10:30:00',
  },
  {
    id: '2',
    title: 'Thermodynamics Laws Summary',
    content:
      '# Laws of Thermodynamics\n\n## Zeroth Law\nIf two systems are in thermal equilibrium with a third, they are in thermal equilibrium with each other.\n\n## First Law\nEnergy cannot be created or destroyed, only transformed.\nΔU = Q - W\n\n## Second Law\nEntropy of an isolated system always increases. Heat flows from hot to cold.\n\n## Third Law\nEntropy approaches a constant minimum as temperature approaches absolute zero.',
    subjectId: 's2',
    tags: ['physics', 'thermo', 'laws'],
    favorite: false,
    archived: false,
    wordCount: 56,
    charCount: 312,
    createdAt: '2026-09-17T14:00:00',
    updatedAt: '2026-09-17T14:00:00',
  },
  {
    id: '3',
    title: 'OS Paging and Segmentation',
    content:
      '# Memory Management\n\n## Paging\n- Divides memory into fixed-size blocks called pages\n- Eliminates external fragmentation\n- Internal fragmentation may occur\n\n## Segmentation\n- Divides memory based on logical units\n- Each segment has variable size\n- Better represents program structure\n\n## Comparison\n| Feature | Paging | Segmentation |\n|---------|--------|--------------|\n| Block size | Fixed | Variable |\n| Fragmentation | Internal | External |\n| Address | Page number + offset | Segment + offset |',
    subjectId: 's1',
    tags: ['os', 'memory', 'paging'],
    favorite: false,
    archived: false,
    wordCount: 78,
    charCount: 356,
    createdAt: '2026-09-16T09:00:00',
    updatedAt: '2026-09-16T09:00:00',
  },
  {
    id: '4',
    title: 'Physics Lab: Optics Experiment',
    content:
      "## Experiment: Refraction through Prism\n\n### Aim\nTo determine the refractive index of glass prism material.\n\n### Theory\nSnell's Law: n₁sinθ₁ = n₂sinθ₂\nMinimum deviation: δm = i₁ + i₂ - A\n\n### Observations\n+------+--------+----------+\n| Trial | Angle i | Angle δ |\n+------+--------+----------+\n| 1    | 40°    | 38°      |\n| 2    | 45°    | 35°      |\n| 3    | 50°    | 37°      |\n+------+--------+----------+\n\n### Result\nRefractive index n = 1.52 ± 0.03",
    subjectId: 's2',
    tags: ['lab', 'physics', 'optics'],
    favorite: false,
    archived: false,
    wordCount: 64,
    charCount: 298,
    createdAt: '2026-09-15T16:00:00',
    updatedAt: '2026-09-15T16:00:00',
  },
  {
    id: '5',
    title: 'Calculus: Integration Formulas',
    content:
      "# Integration Formulas\n\n## Basic Formulas\n- ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫ 1/x dx = ln|x| + C\n- ∫ eˣ dx = eˣ + C\n- ∫ sin(x) dx = -cos(x) + C\n- ∫ cos(x) dx = sin(x) + C\n\n## Integration by Parts\n∫ u dv = uv - ∫ v du\n\n## Substitution\n∫ f(g(x))g'(x) dx = ∫ f(u) du",
    subjectId: 's3',
    tags: ['math', 'calculus', 'integration'],
    favorite: true,
    archived: false,
    wordCount: 45,
    charCount: 234,
    createdAt: '2026-09-14T11:00:00',
    updatedAt: '2026-09-14T11:00:00',
  },
  {
    id: '6',
    title: 'Chemistry: Periodic Trends',
    content:
      '# Periodic Trends\n\n## Atomic Radius\n- Decreases across a period\n- Increases down a group\n- Due to effective nuclear charge\n\n## Ionization Energy\n- Increases across a period\n- Decreases down a group\n- Exception at half-filled orbitals\n\n## Electronegativity\n- Increases across a period\n- Decreases down a group\n- Fluorine is most electronegative',
    subjectId: 's4',
    tags: ['chemistry', 'periodic', 'trends'],
    favorite: false,
    archived: false,
    wordCount: 52,
    charCount: 276,
    createdAt: '2026-09-13T10:00:00',
    updatedAt: '2026-09-13T10:00:00',
  },
];

const countWords = (content: string) => {
  const trimmed = content.trim();

  if (!trimmed) return 0;

  return trimmed.split(/\s+/).filter(Boolean).length;
};

const getSubject = (subjectId: string | null) =>
  subjects.find((subject) => subject.id === subjectId);

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getPreview = (content: string) => {
  const plainText = content
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*/g, '')
    .replace(/[*_`]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.length > 120
    ? `${plainText.slice(0, 120)}...`
    : plainText;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(seedNotes);

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [view, setView] = useState<ViewMode>('list');
  const [showArchived, setShowArchived] = useState(false);

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(
    null,
  );

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTags, setNewTags] = useState('');

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch {
      // Keep seed notes if localStorage is unavailable.
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!initialized) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes),
      );
    } catch {
      // Storage errors should not break the notes editor.
    }
  }, [notes, initialized]);

  const allTags = useMemo(() => {
    return Array.from(
      new Set(notes.flatMap((note) => note.tags)),
    ).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notes
      .filter((note) => {
        if (!showArchived && note.archived) {
          return false;
        }

        if (showArchived && !note.archived) {
          return false;
        }

        if (query) {
          const searchableText = [
            note.title,
            note.content,
            ...note.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(query)) {
            return false;
          }
        }

        if (
          subjectFilter !== 'all' &&
          note.subjectId !== subjectFilter
        ) {
          return false;
        }

        if (
          tagFilter !== 'all' &&
          !note.tags.includes(tagFilter)
        ) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );
  }, [
    notes,
    searchQuery,
    subjectFilter,
    tagFilter,
    showArchived,
  ]);

  const activeCount = notes.filter(
    (note) => !note.archived,
  ).length;

  const archivedCount = notes.filter(
    (note) => note.archived,
  ).length;

  const favoriteCount = notes.filter(
    (note) => note.favorite && !note.archived,
  ).length;

  const resetNewNoteForm = () => {
    setNewTitle('');
    setNewSubject('');
    setNewTags('');
  };

  const openNewNoteDialog = () => {
    resetNewNoteForm();
    setShowNewDialog(true);
  };

  const createNote = () => {
    const title = newTitle.trim() || 'Untitled Note';

    const content =
      '# New Note\n\nStart writing your study notes here...';

    const now = new Date().toISOString();

    const tags = Array.from(
      new Set(
        newTags
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    );

    const note: Note = {
      id: `note-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      title,
      content,
      subjectId: newSubject || null,
      tags,
      favorite: false,
      archived: false,
      wordCount: countWords(content),
      charCount: content.length,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((previous) => [note, ...previous]);
    setSelectedNote(note);
    setShowNewDialog(false);
    resetNewNoteForm();
    setShowArchived(false);
  };

  const updateNote = (
    id: string,
    changes: Partial<Note>,
  ) => {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === id
          ? {
              ...note,
              ...changes,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );

    setSelectedNote((previous) =>
      previous?.id === id
        ? {
            ...previous,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : previous,
    );
  };

  const updateContent = (content: string) => {
    if (!selectedNote) return;

    updateNote(selectedNote.id, {
      content,
      wordCount: countWords(content),
      charCount: content.length,
    });
  };

  const updateTitle = (title: string) => {
    if (!selectedNote) return;

    updateNote(selectedNote.id, {
      title,
    });
  };

  const toggleFavorite = (id: string) => {
    const note = notes.find((item) => item.id === id);

    if (!note) return;

    updateNote(id, {
      favorite: !note.favorite,
    });
  };

  const toggleArchive = (id: string) => {
    const note = notes.find((item) => item.id === id);

    if (!note) return;

    updateNote(id, {
      archived: !note.archived,
    });

    if (!note.archived) {
      setSelectedNote(null);
    }
  };

  const deleteNote = (id: string) => {
    const note = notes.find((item) => item.id === id);

    if (!note) return;

    const confirmed = window.confirm(
      `Delete "${note.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setNotes((previous) =>
      previous.filter((item) => item.id !== id),
    );

    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const addTagToSelectedNote = () => {
    if (!selectedNote) return;

    const tag = window
      .prompt('Enter a tag:')
      ?.trim()
      .toLowerCase();

    if (!tag) return;

    if (selectedNote.tags.includes(tag)) return;

    updateNote(selectedNote.id, {
      tags: [...selectedNote.tags, tag],
    });
  };

  const removeTagFromSelectedNote = (tag: string) => {
    if (!selectedNote) return;

    updateNote(selectedNote.id, {
      tags: selectedNote.tags.filter(
        (currentTag) => currentTag !== tag,
      ),
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">Notes</h1>

            {showArchived && (
              <Badge variant="secondary">
                Archived
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {showArchived ? archivedCount : activeCount} notes
            {showArchived
              ? ' in archive'
              : ` · ${favoriteCount} favorites · ${archivedCount} archived`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive size={14} />
            {showArchived ? 'Active Notes' : 'Archive'}
            {archivedCount > 0 && !showArchived && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {archivedCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setView(view === 'list' ? 'grid' : 'list')
            }
          >
            {view === 'list' ? (
              <>
                <Grid2X2 size={14} />
                Grid
              </>
            ) : (
              <>
                <List size={14} />
                List
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={openNewNoteDialog}
          >
            <Plus size={14} />
            New Note
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        {/* Notes browser */}
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col',
            selectedNote && 'lg:max-w-[42%]',
          )}
        >
          {/* Filters */}
          <div className="flex shrink-0 flex-col gap-3 pb-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                placeholder="Search title, content or tags..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={subjectFilter}
                onChange={(event) =>
                  setSubjectFilter(event.target.value)
                }
                className="h-9 min-w-[150px] rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter notes by subject"
              >
                <option value="all">All subjects</option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={tagFilter}
                onChange={(event) =>
                  setTagFilter(event.target.value)
                }
                className="h-9 min-w-[120px] rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter notes by tag"
              >
                <option value="all">All tags</option>

                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <Card className="min-h-0 flex-1 overflow-y-auto p-3">
            {filteredNotes.length === 0 ? (
              <EmptyState
                icon={
                  showArchived ? (
                    <Archive size={24} />
                  ) : (
                    <FileText size={24} />
                  )
                }
                title={
                  showArchived
                    ? 'No archived notes'
                    : 'No notes found'
                }
                description={
                  showArchived
                    ? 'Archived notes will appear here.'
                    : 'Create a new note or adjust your filters.'
                }
                action={
                  showArchived
                    ? undefined
                    : {
                        label: 'New Note',
                        onClick: openNewNoteDialog,
                      }
                }
              />
            ) : view === 'list' ? (
              <div className="space-y-2">
                {filteredNotes.map((note) => {
                  const subject = getSubject(note.subjectId);

                  return (
                    <div
                      key={note.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedNote(note)}
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' ||
                          event.key === ' '
                        ) {
                          event.preventDefault();
                          setSelectedNote(note);
                        }
                      }}
                      className={cn(
                        'group flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50',
                        selectedNote?.id === note.id &&
                          'border-primary ring-2 ring-primary/20',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          note.favorite
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className="truncate text-sm font-medium"
                            title={note.title}
                          >
                            {note.title}
                          </p>

                          {note.favorite && (
                            <Star
                              size={12}
                              className="shrink-0 fill-yellow-500 text-yellow-500"
                            />
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {getPreview(note.content)}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {subject && (
                            <span className="flex items-center gap-1">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    subject.color,
                                }}
                              />
                              {subject.name}
                            </span>
                          )}

                          <span>·</span>

                          <span>
                            {note.wordCount} words
                          </span>

                          <span>·</span>

                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>

                        {note.tags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {note.tags
                              .slice(0, 3)
                              .map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="px-1.5 py-0 text-[10px]"
                                >
                                  <Tag
                                    size={8}
                                    className="mr-0.5"
                                  />
                                  {tag}
                                </Badge>
                              ))}

                            {note.tags.length > 3 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{note.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <Menu>
                        <MenuTrigger>
                          <button
                            type="button"
                            className="rounded p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            aria-label="Note actions"
                          >
                            <MoreHorizontal
                              size={14}
                              className="text-muted-foreground"
                            />
                          </button>
                        </MenuTrigger>

                        <MenuItem
                          onClick={() =>
                            toggleFavorite(note.id)
                          }
                          icon={
                            <Star
                              size={12}
                              className={
                                note.favorite
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : ''
                              }
                            />
                          }
                        >
                          {note.favorite
                            ? 'Unfavorite'
                            : 'Favorite'}
                        </MenuItem>

                        <MenuItem
                          onClick={() =>
                            toggleArchive(note.id)
                          }
                          icon={<Archive size={12} />}
                        >
                          {note.archived
                            ? 'Unarchive'
                            : 'Archive'}
                        </MenuItem>

                        <MenuItem
                          onClick={() =>
                            deleteNote(note.id)
                          }
                          icon={<Trash2 size={12} />}
                          danger
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredNotes.map((note) => {
                  const subject = getSubject(note.subjectId);

                  return (
                    <div
                      key={note.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedNote(note)}
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' ||
                          event.key === ' '
                        ) {
                          event.preventDefault();
                          setSelectedNote(note);
                        }
                      }}
                      className={cn(
                        'group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm',
                        selectedNote?.id === note.id &&
                          'border-primary ring-2 ring-primary/20',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            note.favorite
                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <FileText size={18} />
                        </div>

                        <div className="flex items-center gap-1">
                          {note.favorite && (
                            <Star
                              size={13}
                              className="fill-yellow-500 text-yellow-500"
                            />
                          )}

                          <Menu>
                            <MenuTrigger>
                              <button
                                type="button"
                                className="rounded p-1 hover:bg-muted"
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                aria-label="Note actions"
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            </MenuTrigger>

                            <MenuItem
                              onClick={() =>
                                toggleFavorite(note.id)
                              }
                              icon={<Star size={12} />}
                            >
                              {note.favorite
                                ? 'Unfavorite'
                                : 'Favorite'}
                            </MenuItem>

                            <MenuItem
                              onClick={() =>
                                toggleArchive(note.id)
                              }
                              icon={<Archive size={12} />}
                            >
                              {note.archived
                                ? 'Unarchive'
                                : 'Archive'}
                            </MenuItem>

                            <MenuItem
                              onClick={() =>
                                deleteNote(note.id)
                              }
                              icon={<Trash2 size={12} />}
                              danger
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      </div>

                      <h3
                        className="mt-3 truncate text-sm font-semibold"
                        title={note.title}
                      >
                        {note.title}
                      </h3>

                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                        {getPreview(note.content)}
                      </p>

                      {subject && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: subject.color,
                            }}
                          />
                          {subject.name}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{note.wordCount} words</span>
                        <span>
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>

                      {note.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Editor */}
        {selectedNote ? (
          <div className="fixed inset-0 z-40 flex flex-col bg-background lg:static lg:z-auto lg:flex lg:w-[58%] lg:shrink-0">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border pb-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md p-1.5 hover:bg-muted lg:hidden"
                    onClick={() =>
                      setSelectedNote(null)
                    }
                    aria-label="Close editor"
                  >
                    <X size={18} />
                  </button>

                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(event) =>
                      updateTitle(event.target.value)
                    }
                    className="w-full max-w-xl bg-transparent p-0 text-xl font-bold outline-none"
                    placeholder="Note title"
                  />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {selectedNote.wordCount} words
                  </span>

                  <span>·</span>

                  <span>
                    {selectedNote.charCount} characters
                  </span>

                  <span>·</span>

                  <span>
                    Updated {formatDateTime(selectedNote.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toggleFavorite(selectedNote.id)
                  }
                  className={cn(
                    selectedNote.favorite &&
                      'text-yellow-500',
                  )}
                  aria-label={
                    selectedNote.favorite
                      ? 'Remove favorite'
                      : 'Add favorite'
                  }
                >
                  <Star
                    size={15}
                    className={
                      selectedNote.favorite
                        ? 'fill-current'
                        : ''
                    }
                  />
                </Button>

                <Menu>
                  <MenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="More note actions"
                    >
                      <MoreHorizontal size={15} />
                    </Button>
                  </MenuTrigger>

                  <MenuItem
                    onClick={() =>
                      toggleArchive(selectedNote.id)
                    }
                    icon={<Archive size={12} />}
                  >
                    {selectedNote.archived
                      ? 'Unarchive'
                      : 'Archive'}
                  </MenuItem>

                  <MenuItem
                    onClick={() =>
                      deleteNote(selectedNote.id)
                    }
                    icon={<Trash2 size={12} />}
                    danger
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 pt-3">
              <textarea
                value={selectedNote.content}
                onChange={(event) =>
                  updateContent(event.target.value)
                }
                className="min-h-0 flex-1 resize-none rounded-lg border border-border bg-card p-4 font-mono text-sm leading-6 outline-none transition-colors focus:border-primary"
                style={{ fontFamily: 'inherit' }}
                placeholder="Start writing your notes..."
                spellCheck
              />

              {/* Note metadata */}
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Tags:
                </span>

                {selectedNote.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      removeTagFromSelectedNote(tag)
                    }
                    className="group"
                    title={`Remove ${tag}`}
                  >
                    <Badge
                      variant="outline"
                      className="cursor-pointer text-xs group-hover:border-red-300 group-hover:text-red-600"
                    >
                      <Tag
                        size={8}
                        className="mr-1"
                      />
                      {tag}
                      <X
                        size={9}
                        className="ml-1 opacity-50"
                      />
                    </Badge>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={addTagToSelectedNote}
                  className="rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary"
                >
                  + Add tag
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground lg:flex">
            <div className="max-w-sm px-6 text-center">
              <FileText
                size={48}
                className="mx-auto mb-3 opacity-30"
              />

              <p className="text-sm font-medium text-foreground">
                No note selected
              </p>

              <p className="mt-1 text-sm">
                Select a note from the list or create a new
                note to start writing.
              </p>

              <Button
                size="sm"
                className="mt-4"
                onClick={openNewNoteDialog}
              >
                <Plus size={14} />
                Create Note
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Note dialog */}
      <Dialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        title="Create New Note"
        description="Set up your note before opening the editor."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Note title
            </label>

            <Input
              placeholder="e.g. DBMS Normalization Notes"
              value={newTitle}
              onChange={(event) =>
                setNewTitle(event.target.value)
              }
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Subject
            </label>

            <select
              value={newSubject}
              onChange={(event) =>
                setNewSubject(event.target.value)
              }
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">No subject</option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tags
            </label>

            <Input
              placeholder="dbms, database, normalization"
              value={newTags}
              onChange={(event) =>
                setNewTags(event.target.value)
              }
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Separate multiple tags with commas.
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            The note will open in the editor immediately after
            creation. Your notes are currently persisted locally
            in this browser.
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNewDialog(false)}
            >
              Cancel
            </Button>

            <Button onClick={createNote}>
              <Plus size={14} />
              Create Note
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}