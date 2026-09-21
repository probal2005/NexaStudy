'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  BookOpen,
  Check,
  ChevronLeft,
  Clock,
  FileText,
  FolderOpen,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';

type DocumentCategory =
  | 'All'
  | 'Study'
  | 'Assignment'
  | 'Project'
  | 'Personal'
  | 'Other';

type DocumentItem = {
  id: string;
  title: string;
  content: string;
  category: Exclude<DocumentCategory, 'All'>;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'nexastudy_documents';

const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'DBMS Indexing Techniques',
    content:
      'Database indexing improves query performance by allowing the database engine to locate rows faster without scanning the entire table.',
    category: 'Study',
    favorite: true,
    createdAt: '2026-09-18T09:30:00.000Z',
    updatedAt: '2026-09-20T10:30:00.000Z',
  },
  {
    id: 'doc-2',
    title: 'Operating Systems — Paging',
    content:
      'Paging is a memory management technique in which physical memory is divided into fixed-size blocks called frames and logical memory is divided into pages.',
    category: 'Study',
    favorite: false,
    createdAt: '2026-09-17T08:00:00.000Z',
    updatedAt: '2026-09-19T15:20:00.000Z',
  },
  {
    id: 'doc-3',
    title: 'CivicPulse AI Project Notes',
    content:
      'Project documentation, architecture ideas, feature planning and implementation notes.',
    category: 'Project',
    favorite: true,
    createdAt: '2026-09-16T12:00:00.000Z',
    updatedAt: '2026-09-18T18:00:00.000Z',
  },
];

const categories: {
  id: DocumentCategory;
  label: string;
  icon: typeof FileText;
}[] = [
  { id: 'All', label: 'All Documents', icon: FolderOpen },
  { id: 'Study', label: 'Study', icon: BookOpen },
  { id: 'Assignment', label: 'Assignments', icon: FileText },
  { id: 'Project', label: 'Projects', icon: Archive },
  { id: 'Personal', label: 'Personal', icon: Pencil },
  { id: 'Other', label: 'Other', icon: FolderOpen },
];

const formatDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

const formatTime = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
};

const getWordCount = (content: string) => {
  const trimmed = content.trim();

  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
};

const getPreview = (content: string) => {
  const cleaned = content.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= 140) {
    return cleaned;
  }

  return `${cleaned.slice(0, 140)}...`;
};

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>(initialDocuments);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

  const [activeCategory, setActiveCategory] =
    useState<DocumentCategory>('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState<Exclude<DocumentCategory, 'All'>>('Study');

  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] =
    useState<Exclude<DocumentCategory, 'All'>>('Study');

  const [isLoaded, setIsLoaded] = useState(false);

  /* -------------------------------------------------------
     Load documents
  ------------------------------------------------------- */

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setDocuments(parsed as DocumentItem[]);
        }
      }
    } catch {
      // Keep default documents if localStorage contains invalid data.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* -------------------------------------------------------
     Persist documents
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch {
      // Ignore storage errors gracefully.
    }
  }, [documents, isLoaded]);

  /* -------------------------------------------------------
     Filter documents
  ------------------------------------------------------- */

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...documents]
      .filter((document) => {
        if (activeCategory === 'All') {
          return true;
        }

        return document.category === activeCategory;
      })
      .filter((document) => {
        if (!query) {
          return true;
        }

        return (
          document.title.toLowerCase().includes(query) ||
          document.content.toLowerCase().includes(query) ||
          document.category.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );
  }, [documents, activeCategory, searchQuery]);

  const selectedDocument = useMemo(
    () =>
      documents.find((document) => document.id === selectedDocumentId) ?? null,
    [documents, selectedDocumentId],
  );

  const totalWords = useMemo(
    () =>
      documents.reduce(
        (total, document) => total + getWordCount(document.content),
        0,
      ),
    [documents],
  );

  const favoriteCount = useMemo(
    () => documents.filter((document) => document.favorite).length,
    [documents],
  );

  /* -------------------------------------------------------
     Select document
  ------------------------------------------------------- */

  const openDocument = (document: DocumentItem) => {
    setSelectedDocumentId(document.id);
    setIsEditing(false);
    setEditTitle(document.title);
    setEditContent(document.content);
    setEditCategory(document.category);
  };

  /* -------------------------------------------------------
     Create document
  ------------------------------------------------------- */

  const createDocument = () => {
    const title = newTitle.trim();

    if (!title) {
      return;
    }

    const now = new Date().toISOString();

    const newDocument: DocumentItem = {
      id: `doc-${Date.now()}`,
      title,
      content: '',
      category: newCategory,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };

    setDocuments((current) => [newDocument, ...current]);

    setNewTitle('');
    setNewCategory('Study');
    setIsCreating(false);

    openDocument(newDocument);
    setIsEditing(true);
  };

  /* -------------------------------------------------------
     Save document
  ------------------------------------------------------- */

  const saveDocument = () => {
    if (!selectedDocument) {
      return;
    }

    const title = editTitle.trim();

    if (!title) {
      return;
    }

    const updatedDocument: DocumentItem = {
      ...selectedDocument,
      title,
      content: editContent,
      category: editCategory,
      updatedAt: new Date().toISOString(),
    };

    setDocuments((current) =>
      current.map((document) =>
        document.id === selectedDocument.id ? updatedDocument : document,
      ),
    );

    setIsEditing(false);
  };

  /* -------------------------------------------------------
     Delete document
  ------------------------------------------------------- */

  const deleteDocument = (documentId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this document?',
    );

    if (!confirmed) {
      return;
    }

    setDocuments((current) =>
      current.filter((document) => document.id !== documentId),
    );

    if (selectedDocumentId === documentId) {
      setSelectedDocumentId(null);
      setIsEditing(false);
    }
  };

  /* -------------------------------------------------------
     Toggle favorite
  ------------------------------------------------------- */

  const toggleFavorite = (documentId: string) => {
    setDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? {
              ...document,
              favorite: !document.favorite,
              updatedAt: new Date().toISOString(),
            }
          : document,
      ),
    );
  };

  /* -------------------------------------------------------
     Editor
  ------------------------------------------------------- */

  if (selectedDocument) {
    const currentWordCount = getWordCount(editContent);
    const currentCharacterCount = editContent.length;

    return (
      <div className="space-y-5 animate-fade-in">
        {/* Editor header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setSelectedDocumentId(null);
                setIsEditing(false);
              }}
            >
              <ChevronLeft size={16} />
              Back to Documents
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(selectedDocument.id)}
                className="gap-1.5"
              >
                <Star
                  size={15}
                  className={
                    selectedDocument.favorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : ''
                  }
                />
                {selectedDocument.favorite ? 'Favorite' : 'Favorite'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteDocument(selectedDocument.id)}
                className="gap-1.5 text-red-600 hover:text-red-700"
              >
                <Trash2 size={15} />
                Delete
              </Button>
            </div>
          </div>

          {/* Editor card */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {isEditing ? (
                <div className="space-y-0">
                  <div className="border-b border-border p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Document title..."
                        className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground"
                        autoFocus
                      />

                      <select
                        value={editCategory}
                        onChange={(event) =>
                          setEditCategory(
                            event.target.value as Exclude<
                              DocumentCategory,
                              'All'
                            >,
                          )
                        }
                        className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                      >
                        {categories
                          .filter((category) => category.id !== 'All')
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    placeholder="Start writing your document..."
                    className="min-h-[55vh] w-full resize-y bg-background p-5 text-sm leading-7 outline-none placeholder:text-muted-foreground sm:p-8"
                  />

                  <div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>{currentWordCount} words</span>
                      <span>{currentCharacterCount} characters</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditTitle(selectedDocument.title);
                          setEditContent(selectedDocument.content);
                          setEditCategory(selectedDocument.category);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={saveDocument}
                        disabled={!editTitle.trim()}
                      >
                        <Check size={15} />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <article>
                  <div className="border-b border-border p-5 sm:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge>{selectedDocument.category}</Badge>

                      {selectedDocument.favorite && (
                        <Badge variant="secondary" className="gap-1">
                          <Star
                            size={11}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          Favorite
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                          {selectedDocument.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            Updated {formatDate(selectedDocument.updatedAt)}
                          </span>

                          <span>•</span>

                          <span>{formatTime(selectedDocument.updatedAt)}</span>

                          <span>•</span>

                          <span>
                            {getWordCount(selectedDocument.content)} words
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setEditTitle(selectedDocument.title);
                          setEditContent(selectedDocument.content);
                          setEditCategory(selectedDocument.category);
                          setIsEditing(true);
                        }}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="min-h-[50vh] p-5 sm:p-8">
                    {selectedDocument.content.trim() ? (
                      <div className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-foreground">
                        {selectedDocument.content}
                      </div>
                    ) : (
                      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                          <FileText
                            size={24}
                            className="text-muted-foreground"
                          />
                        </div>

                        <h2 className="text-base font-semibold">
                          This document is empty
                        </h2>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          Start writing your content and save the document when
                          you are finished.
                        </p>

                        <Button
                          size="sm"
                          className="mt-4 gap-1.5"
                          onClick={() => {
                            setEditTitle(selectedDocument.title);
                            setEditContent(selectedDocument.content);
                            setEditCategory(selectedDocument.category);
                            setIsEditing(true);
                          }}
                        >
                          <Pencil size={14} />
                          Start Writing
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     Documents workspace
  ------------------------------------------------------- */

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Documents
              </h1>

              <p className="text-sm text-muted-foreground">
                Create, edit and organize your study documents.
              </p>
            </div>
          </div>
        </div>

        <Button
          className="gap-1.5"
          onClick={() => {
            setNewTitle('');
            setNewCategory('Study');
            setIsCreating(true);
          }}
        >
          <Plus size={16} />
          New Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Documents',
            value: documents.length,
            icon: FileText,
          },
          {
            label: 'Favorites',
            value: favoriteCount,
            icon: Star,
          },
          {
            label: 'Study Docs',
            value: documents.filter(
              (document) => document.category === 'Study',
            ).length,
            icon: BookOpen,
          },
          {
            label: 'Total Words',
            value: totalWords.toLocaleString(),
            icon: Pencil,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon size={17} />
              </div>

              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search documents, content or categories..."
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm outline-none transition focus:border-primary"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main workspace */}
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Categories */}
        <Card className="h-fit">
          <CardContent className="p-3">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </div>

            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;

                const count =
                  category.id === 'All'
                    ? documents.length
                    : documents.filter(
                        (document) => document.category === category.id,
                      ).length;

                const active = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <Icon size={16} />

                    <span className="min-w-0 flex-1 truncate">
                      {category.label}
                    </span>

                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-4 border-t border-border" />

            <Link href="/library">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <FolderOpen size={16} />
                Open Library
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Document list */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">
                {activeCategory === 'All'
                  ? 'All Documents'
                  : activeCategory}
              </h2>

              <p className="text-xs text-muted-foreground">
                {filteredDocuments.length} document
                {filteredDocuments.length === 1 ? '' : 's'}
              </p>
            </div>

            {searchQuery && (
              <Badge variant="secondary">
                Search: &quot;{searchQuery}&quot;
              </Badge>
            )}
          </div>

          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Search size={26} className="text-muted-foreground" />
                </div>

                <h2 className="text-lg font-semibold">
                  No documents found
                </h2>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try another search term or change the selected category.
                </p>

                <div className="mt-4 flex gap-2">
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  )}

                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setNewTitle('');
                      setNewCategory('Study');
                      setIsCreating(true);
                    }}
                  >
                    <Plus size={14} />
                    Create Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map((document) => (
                <Card
                  key={document.id}
                  className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <button
                      type="button"
                      onClick={() => openDocument(document)}
                      className="block w-full text-left"
                    >
                      <div className="p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                            <FileText size={21} />
                          </div>

                          <div className="flex items-center gap-1">
                            {document.favorite && (
                              <Star
                                size={15}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            )}

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(document.id);
                              }}
                              className="rounded-md p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-accent hover:text-foreground"
                              aria-label={
                                document.favorite
                                  ? 'Remove favorite'
                                  : 'Add favorite'
                              }
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>
                        </div>

                        <h3 className="truncate font-semibold text-foreground">
                          {document.title}
                        </h3>

                        <p className="mt-2 min-h-[42px] text-sm leading-5 text-muted-foreground">
                          {getPreview(document.content) ||
                            'No content yet. Open this document to start writing.'}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {document.category}
                          </Badge>

                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock size={11} />
                            {formatDate(document.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-between border-t border-border px-5 py-3">
                      <span className="text-[11px] text-muted-foreground">
                        {getWordCount(document.content)} words
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2"
                          onClick={() => openDocument(document)}
                        >
                          <Pencil size={13} />
                          Open
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-600 hover:text-red-700"
                          onClick={() => deleteDocument(document.id)}
                          aria-label={`Delete ${document.title}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-document-title"
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2
                    id="new-document-title"
                    className="text-lg font-semibold"
                  >
                    Create New Document
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Start a new document in your workspace.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="document-title"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Document title
                  </label>

                  <input
                    id="document-title"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        createDocument();
                      }
                    }}
                    placeholder="e.g. DBMS Unit 4 Notes"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor="document-category"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <select
                    id="document-category"
                    value={newCategory}
                    onChange={(event) =>
                      setNewCategory(
                        event.target.value as Exclude<DocumentCategory, 'All'>,
                      )
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  >
                    {categories
                      .filter((category) => category.id !== 'All')
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="gap-1.5"
                  onClick={createDocument}
                  disabled={!newTitle.trim()}
                >
                  <Plus size={15} />
                  Create Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}