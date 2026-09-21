'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  Download,
  File,
  FileEdit,
  FileText,
  Folder,
  Grid2X2,
  Image as ImageIcon,
  List,
  MoreHorizontal,
  Search,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog, Menu, MenuTrigger, MenuItem, EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';

interface LibraryFile {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  folderId: string | null;
  tags: string[];
  favorite: boolean;
  trashed: boolean;
  uploadedAt: string;
  modifiedAt: string;
  content?: string;
  previewUrl?: string;
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
}

type ViewMode = 'grid' | 'list';
type SortMode = 'date' | 'name' | 'size';

const STORAGE_KEY = 'nexastudy_library_files';

const mockFiles: LibraryFile[] = [
  {
    id: '1',
    name: 'DBMS_Notes_Complete.pdf',
    size: 2450000,
    type: 'application/pdf',
    mimeType: 'pdf',
    folderId: null,
    tags: ['dbms', 'notes'],
    favorite: true,
    trashed: false,
    uploadedAt: '2026-09-18T10:30:00',
    modifiedAt: '2026-09-18T10:30:00',
  },
  {
    id: '2',
    name: 'Thermodynamics_Ch5_Summary.docx',
    size: 520000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mimeType: 'docx',
    folderId: null,
    tags: ['physics', 'thermo'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-17T14:00:00',
    modifiedAt: '2026-09-17T14:00:00',
  },
  {
    id: '3',
    name: 'Physics_Lab_Report_Optics.docx',
    size: 1200000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mimeType: 'docx',
    folderId: null,
    tags: ['lab', 'physics'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-16T09:00:00',
    modifiedAt: '2026-09-16T09:00:00',
  },
  {
    id: '4',
    name: 'Calculus_II_ProblemSet4.pdf',
    size: 890000,
    type: 'application/pdf',
    mimeType: 'pdf',
    folderId: null,
    tags: ['math', 'calculus', 'assignment'],
    favorite: true,
    trashed: false,
    uploadedAt: '2026-09-15T16:00:00',
    modifiedAt: '2026-09-15T16:00:00',
  },
  {
    id: '5',
    name: 'Chemistry_Notes_Ch3.pdf',
    size: 1300000,
    type: 'application/pdf',
    mimeType: 'pdf',
    folderId: null,
    tags: ['chemistry', 'notes'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-14T11:00:00',
    modifiedAt: '2026-09-14T11:00:00',
  },
  {
    id: '6',
    name: 'Operating_Systems_Slides.pptx',
    size: 5600000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    mimeType: 'pptx',
    folderId: null,
    tags: ['os', 'slides'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-12T08:00:00',
    modifiedAt: '2026-09-12T08:00:00',
  },
  {
    id: '7',
    name: 'Research_Paper_Attention_Mechanism.pdf',
    size: 3400000,
    type: 'application/pdf',
    mimeType: 'pdf',
    folderId: null,
    tags: ['research', 'ml', 'reading'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-10T13:00:00',
    modifiedAt: '2026-09-10T13:00:00',
  },
  {
    id: '8',
    name: 'Economics_Essay_SupplyDemand.docx',
    size: 450000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mimeType: 'docx',
    folderId: null,
    tags: ['economics', 'essay'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-08T10:00:00',
    modifiedAt: '2026-09-08T10:00:00',
  },
  {
    id: '9',
    name: 'Math_Formula_Cheatsheet.jpg',
    size: 240000,
    type: 'image/jpeg',
    mimeType: 'jpg',
    folderId: null,
    tags: ['math', 'cheatsheet'],
    favorite: true,
    trashed: false,
    uploadedAt: '2026-09-05T09:00:00',
    modifiedAt: '2026-09-05T09:00:00',
  },
  {
    id: '10',
    name: 'Study_Plan_Semester2.xlsx',
    size: 90000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mimeType: 'xlsx',
    folderId: null,
    tags: ['study', 'plan'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-09-01T12:00:00',
    modifiedAt: '2026-09-01T12:00:00',
  },
  {
    id: '11',
    name: 'README.md',
    size: 1200,
    type: 'text/markdown',
    mimeType: 'md',
    folderId: null,
    tags: [],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-08-30T08:00:00',
    modifiedAt: '2026-08-30T08:00:00',
    content: '# Study Notes\n\nThis is my personal study library.\n',
  },
  {
    id: '12',
    name: 'Backup_Notes_2026.zip',
    size: 25000000,
    type: 'application/zip',
    mimeType: 'zip',
    folderId: null,
    tags: ['backup'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-08-25T15:00:00',
    modifiedAt: '2026-08-25T15:00:00',
  },
  {
    id: '13',
    name: 'Semester_Grades.xlsx',
    size: 150000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mimeType: 'xlsx',
    folderId: null,
    tags: ['grades', 'academic'],
    favorite: true,
    trashed: false,
    uploadedAt: '2026-08-20T10:00:00',
    modifiedAt: '2026-08-20T10:00:00',
  },
  {
    id: '14',
    name: 'Old_Physics_Notes.pdf',
    size: 1800000,
    type: 'application/pdf',
    mimeType: 'pdf',
    folderId: null,
    tags: ['physics'],
    favorite: false,
    trashed: true,
    uploadedAt: '2026-08-15T09:00:00',
    modifiedAt: '2026-08-15T09:00:00',
  },
  {
    id: '15',
    name: 'Semester_2_Schedule.png',
    size: 890000,
    type: 'image/png',
    mimeType: 'png',
    folderId: null,
    tags: ['schedule', 'semester'],
    favorite: false,
    trashed: false,
    uploadedAt: '2026-08-10T11:00:00',
    modifiedAt: '2026-08-10T11:00:00',
  },
];

const mockFolders: FolderItem[] = [
  { id: 'f1', name: 'Documents', parentId: null },
  { id: 'f2', name: 'Notes', parentId: null },
  { id: 'f3', name: 'Assignments', parentId: null },
  { id: 'f4', name: 'Exams', parentId: null },
  { id: 'f5', name: 'Study Materials', parentId: null },
];

const fileIcons: Record<string, typeof File> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  ppt: FileText,
  pptx: FileText,
  xls: FileText,
  xlsx: FileText,
  txt: File,
  md: FileEdit,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  png: ImageIcon,
  webp: ImageIcon,
  zip: Archive,
  rar: Archive,
};

const typeOptions = [
  'all',
  'pdf',
  'docx',
  'pptx',
  'xlsx',
  'txt',
  'md',
  'jpg',
  'png',
  'webp',
  'zip',
];

const formatSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

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

const getExtension = (fileName: string) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() || 'file' : 'file';
};

const getFileTags = (file: File) => {
  const extension = getExtension(file.name);

  const tags = [extension];

  if (file.type.startsWith('image/')) {
    tags.push('image');
  }

  if (file.type === 'application/pdf') {
    tags.push('pdf');
  }

  if (file.type.startsWith('text/')) {
    tags.push('text');
  }

  return [...new Set(tags)];
};

function FileIcon({
  mimeType,
  size = 32,
  className,
}: {
  mimeType: string;
  size?: number;
  className?: string;
}) {
  const Icon = fileIcons[mimeType] || File;

  return <Icon size={size} className={className} />;
}

export default function LibraryPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<LibraryFile[]>(mockFiles);
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortMode>('date');

  const [selectedFile, setSelectedFile] = useState<LibraryFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [initialized, setInitialized] = useState(false);

  /*
   * Files selected through the browser cannot be serialized into localStorage.
   * This map keeps their temporary Blob/File objects alive for the current
   * browser session so Download can work immediately after upload.
   */
  const [sessionFiles, setSessionFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFiles(parsed);
        }
      }
    } catch {
      // Keep the default demo library if localStorage is unavailable.
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!initialized) return;

    try {
      const serializableFiles = files.map(({ previewUrl, ...file }) => file);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serializableFiles),
      );
    } catch {
      // Storage failures should not break the library UI.
    }
  }, [files, initialized]);

  useEffect(() => {
    if (!selectedFile) return;

    const refreshed = files.find((file) => file.id === selectedFile.id);

    if (refreshed) {
      setSelectedFile(refreshed);
    } else {
      setSelectedFile(null);
    }
  }, [files, selectedFile]);

  const filteredFiles = useMemo(() => {
    let result = showTrash
      ? files.filter((file) => file.trashed)
      : files.filter((file) => !file.trashed);

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((file) => {
        const searchableText = [
          file.name,
          file.type,
          file.mimeType,
          ...file.tags,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (typeFilter !== 'all') {
      result = result.filter(
        (file) =>
          file.mimeType === typeFilter ||
          file.type.toLowerCase().includes(typeFilter.toLowerCase()),
      );
    }

    /*
     * Always sort a copied array. Array.sort() mutates its source.
     */
    return [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'size') {
        return b.size - a.size;
      }

      return (
        new Date(b.uploadedAt).getTime() -
        new Date(a.uploadedAt).getTime()
      );
    });
  }, [files, search, typeFilter, sortBy, showTrash]);

  const activeFiles = useMemo(
    () => files.filter((file) => !file.trashed),
    [files],
  );

  const trashCount = useMemo(
    () => files.filter((file) => file.trashed).length,
    [files],
  );

  const favoriteCount = useMemo(
    () => activeFiles.filter((file) => file.favorite).length,
    [activeFiles],
  );

  const totalSize = useMemo(
    () => activeFiles.reduce((total, file) => total + file.size, 0),
    [activeFiles],
  );

  const toggleFavorite = (id: string) => {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === id
          ? {
              ...file,
              favorite: !file.favorite,
              modifiedAt: new Date().toISOString(),
            }
          : file,
      ),
    );
  };

  const toggleTrash = (id: string) => {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === id
          ? {
              ...file,
              trashed: !file.trashed,
              modifiedAt: new Date().toISOString(),
            }
          : file,
      ),
    );
  };

  const deletePermanently = (id: string) => {
    const file = files.find((item) => item.id === id);

    if (!file) return;

    const confirmed = window.confirm(
      `Permanently delete "${file.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setFiles((previous) => previous.filter((item) => item.id !== id));

    setSessionFiles((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });

    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const restoreAllTrash = () => {
    setFiles((previous) =>
      previous.map((file) =>
        file.trashed
          ? {
              ...file,
              trashed: false,
              modifiedAt: new Date().toISOString(),
            }
          : file,
      ),
    );
  };

  const clearTrash = () => {
    if (trashCount === 0) return;

    const confirmed = window.confirm(
      `Permanently delete all ${trashCount} file${
        trashCount === 1 ? '' : 's'
      } in Trash?`,
    );

    if (!confirmed) return;

    const trashIds = new Set(
      files.filter((file) => file.trashed).map((file) => file.id),
    );

    setFiles((previous) =>
      previous.filter((file) => !file.trashed),
    );

    setSessionFiles((previous) => {
      const next = { ...previous };

      trashIds.forEach((id) => {
        delete next[id];
      });

      return next;
    });

    setSelectedFile(null);
  };

  const createLibraryFiles = (browserFiles: File[]) => {
    if (browserFiles.length === 0) return;

    const now = new Date().toISOString();

    const newFiles: LibraryFile[] = browserFiles.map((file, index) => {
      const extension = getExtension(file.name);

      return {
        id: `upload-${Date.now()}-${index}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        mimeType: extension,
        folderId: null,
        tags: getFileTags(file),
        favorite: false,
        trashed: false,
        uploadedAt: now,
        modifiedAt: now,
      };
    });

    const sessionMap: Record<string, File> = {};

    newFiles.forEach((libraryFile, index) => {
      sessionMap[libraryFile.id] = browserFiles[index];
    });

    setSessionFiles((previous) => ({
      ...previous,
      ...sessionMap,
    }));

    setFiles((previous) => [...newFiles, ...previous]);
    setShowUpload(false);

    if (newFiles.length === 1) {
      setSelectedFile(newFiles[0]);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files;

    if (!selected || selected.length === 0) return;

    const validFiles = Array.from(selected).filter(
      (file) => file.size <= 10 * 1024 * 1024,
    );

    if (validFiles.length !== selected.length) {
      window.alert(
        'Some files were skipped because they are larger than 10 MB.',
      );
    }

    createLibraryFiles(validFiles);

    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    const validFiles = droppedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024,
    );

    if (validFiles.length !== droppedFiles.length) {
      window.alert(
        'Some files were skipped because they are larger than 10 MB.',
      );
    }

    createLibraryFiles(validFiles);
  };

  const downloadFile = async (file: LibraryFile) => {
    const sessionFile = sessionFiles[file.id];

    if (sessionFile) {
      const url = URL.createObjectURL(sessionFile);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
      return;
    }

    if (file.content !== undefined) {
      const blob = new Blob([file.content], {
        type: file.type || 'text/plain',
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
      return;
    }

    window.alert(
      'This demo item has no local file data attached. A real download requires backend/cloud storage integration.',
    );
  };

  const renameFile = (file: LibraryFile) => {
    const currentExtension = file.name.includes('.')
      ? `.${file.name.split('.').at(-1)}`
      : '';

    const baseName = currentExtension
      ? file.name.slice(0, -currentExtension.length)
      : file.name;

    const nextName = window.prompt(
      'Enter a new file name:',
      baseName,
    );

    if (!nextName?.trim()) return;

    const cleanName = nextName.trim();

    const finalName =
      currentExtension &&
      !cleanName.toLowerCase().endsWith(currentExtension.toLowerCase())
        ? `${cleanName}${currentExtension}`
        : cleanName;

    setFiles((previous) =>
      previous.map((item) =>
        item.id === file.id
          ? {
              ...item,
              name: finalName,
              modifiedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const handleFileClick = (file: LibraryFile) => {
    setSelectedFile(file);
  };

  const isImage = (file: LibraryFile) =>
    ['jpg', 'jpeg', 'png', 'webp'].includes(file.mimeType);

  const isTextFile = (file: LibraryFile) =>
    ['txt', 'md'].includes(file.mimeType);

  const getFolderName = (folderId: string | null) => {
    if (!folderId) return 'Root';

    return (
      mockFolders.find((folder) => folder.id === folderId)?.name ||
      'Unknown'
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">Digital Library</h1>

            {showTrash && (
              <Badge variant="secondary">
                Trash
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {mockFolders.length} folders · {activeFiles.length} files ·{' '}
            {formatSize(totalSize)} used · {favoriteCount} favorites
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {showTrash ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={restoreAllTrash}
                disabled={trashCount === 0}
              >
                <RefreshCw size={14} />
                Restore all
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearTrash}
                disabled={trashCount === 0}
              >
                <Trash2 size={14} />
                Empty trash
              </Button>

              <Button
                size="sm"
                onClick={() => setShowTrash(false)}
              >
                View files
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrash(true)}
              >
                <Archive size={14} />
                Trash
                {trashCount > 0 && (
                  <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                    {trashCount}
                  </span>
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => setShowUpload(true)}
              >
                <Upload size={14} />
                Upload
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Folders */}
      {!showTrash && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {mockFolders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => {
                setSearch(folder.name);
                setTypeFilter('all');
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Folder size={18} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {folder.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Folder
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search files, extensions or tags..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Filter by file type"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All types' : type.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortMode)
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Sort files"
          >
            <option value="date">Newest first</option>
            <option value="name">Name A–Z</option>
            <option value="size">Largest first</option>
          </select>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'rounded-md border p-2 transition-colors',
                view === 'grid'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted',
              )}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'rounded-md border p-2 transition-colors',
                view === 'list'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted',
              )}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto pr-1">
          {filteredFiles.length === 0 ? (
            <EmptyState
              icon={<Folder size={24} />}
              title={
                showTrash
                  ? 'Trash is empty'
                  : 'No files found'
              }
              description={
                showTrash
                  ? 'Deleted files will appear here.'
                  : 'Try another search or upload a new file.'
              }
              action={
                !showTrash
                  ? {
                      label: 'Upload file',
                      onClick: () => setShowUpload(true),
                    }
                  : undefined
              }
            />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredFiles.map((file) => {
                const Icon = fileIcons[file.mimeType] || File;

                return (
                  <div
                    key={file.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleFileClick(file)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleFileClick(file);
                      }
                    }}
                    className={cn(
                      'group relative cursor-pointer rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm',
                      selectedFile?.id === file.id &&
                        'border-primary ring-2 ring-primary/20',
                      file.trashed && 'opacity-60',
                    )}
                  >
                    <div className="mb-3 flex h-14 items-center justify-center rounded-lg bg-muted">
                      <Icon
                        size={28}
                        className="text-muted-foreground"
                      />
                    </div>

                    <p
                      className="truncate text-sm font-medium"
                      title={file.name}
                    >
                      {file.name}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        {formatSize(file.size)}
                      </span>

                      <div className="flex items-center gap-1">
                        {file.favorite && (
                          <Star
                            size={11}
                            className="fill-yellow-500 text-yellow-500"
                          />
                        )}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(file.id);
                          }}
                          className="rounded p-1 hover:bg-muted"
                          aria-label={
                            file.favorite
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                        >
                          <Star
                            size={12}
                            className={cn(
                              file.favorite
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground',
                            )}
                          />
                        </button>

                        <Menu>
                          <MenuTrigger>
                            <button
                              type="button"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="File actions"
                            >
                              <MoreHorizontal size={13} />
                            </button>
                          </MenuTrigger>

                          <MenuItem
                            onClick={() => downloadFile(file)}
                            icon={<Download size={12} />}
                          >
                            Download
                          </MenuItem>

                          <MenuItem
                            onClick={() => renameFile(file)}
                            icon={<FileEdit size={12} />}
                          >
                            Rename
                          </MenuItem>

                          <MenuItem
                            onClick={() => toggleTrash(file.id)}
                            icon={<Archive size={12} />}
                          >
                            {file.trashed
                              ? 'Restore'
                              : 'Move to trash'}
                          </MenuItem>

                          {file.trashed && (
                            <MenuItem
                              onClick={() =>
                                deletePermanently(file.id)
                              }
                              icon={<Trash2 size={12} />}
                              danger
                            >
                              Delete permanently
                            </MenuItem>
                          )}
                        </Menu>
                      </div>
                    </div>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead className="border-b border-border bg-muted/30">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3 font-medium">
                        File
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Size
                      </th>
                      <th className="px-4 py-3 font-medium">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFiles.map((file) => {
                      const Icon =
                        fileIcons[file.mimeType] || File;

                      return (
                        <tr
                          key={file.id}
                          onClick={() =>
                            handleFileClick(file)
                          }
                          className={cn(
                            'cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/40',
                            file.trashed && 'opacity-60',
                          )}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon
                                  size={18}
                                  className="text-muted-foreground"
                                />
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="max-w-[280px] truncate text-sm font-medium"
                                  title={file.name}
                                >
                                  {file.name}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(
                                    file.uploadedAt,
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatSize(file.size)}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {file.tags
                                .slice(0, 3)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div
                              className="flex justify-end gap-1"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleFavorite(file.id)
                                }
                                className="rounded p-1.5 hover:bg-muted"
                                aria-label={
                                  file.favorite
                                    ? 'Remove from favorites'
                                    : 'Add to favorites'
                                }
                              >
                                <Star
                                  size={14}
                                  className={cn(
                                    file.favorite
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-muted-foreground',
                                  )}
                                />
                              </button>

                              <Menu>
                                <MenuTrigger>
                                  <button
                                    type="button"
                                    className="rounded p-1.5 hover:bg-muted"
                                    aria-label="File actions"
                                  >
                                    <MoreHorizontal
                                      size={14}
                                      className="text-muted-foreground"
                                    />
                                  </button>
                                </MenuTrigger>

                                <MenuItem
                                  onClick={() =>
                                    downloadFile(file)
                                  }
                                  icon={
                                    <Download size={12} />
                                  }
                                >
                                  Download
                                </MenuItem>

                                <MenuItem
                                  onClick={() =>
                                    renameFile(file)
                                  }
                                  icon={
                                    <FileEdit size={12} />
                                  }
                                >
                                  Rename
                                </MenuItem>

                                <MenuItem
                                  onClick={() =>
                                    toggleTrash(file.id)
                                  }
                                  icon={
                                    <Archive size={12} />
                                  }
                                >
                                  {file.trashed
                                    ? 'Restore'
                                    : 'Move to trash'}
                                </MenuItem>

                                {file.trashed && (
                                  <MenuItem
                                    onClick={() =>
                                      deletePermanently(
                                        file.id,
                                      )
                                    }
                                    icon={
                                      <Trash2 size={12} />
                                    }
                                    danger
                                  >
                                    Delete permanently
                                  </MenuItem>
                                )}
                              </Menu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Details panel */}
        {selectedFile && (
          <Card className="hidden w-80 shrink-0 overflow-y-auto lg:flex lg:flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">
                  File Details
                </CardTitle>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded p-1 hover:bg-muted"
                  aria-label="Close details"
                >
                  <X size={16} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Preview */}
              {isImage(selectedFile) &&
              sessionFiles[selectedFile.id] ? (
                <div className="overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={URL.createObjectURL(
                      sessionFiles[selectedFile.id],
                    )}
                    alt={selectedFile.name}
                    className="h-44 w-full object-contain"
                  />
                </div>
              ) : isTextFile(selectedFile) &&
                selectedFile.content ? (
                <pre className="max-h-44 overflow-auto rounded-lg bg-muted p-3 text-xs leading-5">
                  {selectedFile.content}
                </pre>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg bg-muted">
                  <FileIcon
                    mimeType={selectedFile.mimeType}
                    size={44}
                    className="text-muted-foreground"
                  />
                </div>
              )}

              <div className="min-w-0 text-center">
                <p
                  className="truncate text-sm font-medium"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatSize(selectedFile.size)}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">
                    Type
                  </span>
                  <span className="font-mono text-xs">
                    {selectedFile.mimeType.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">
                    Uploaded
                  </span>
                  <span className="text-right text-xs">
                    {formatDateTime(selectedFile.uploadedAt)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">
                    Modified
                  </span>
                  <span className="text-right text-xs">
                    {formatDateTime(selectedFile.modifiedAt)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">
                    Folder
                  </span>
                  <span>
                    {getFolderName(selectedFile.folderId)}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">
                    Tags
                  </span>

                  <div className="flex flex-wrap gap-1">
                    {selectedFile.tags.length > 0 ? (
                      selectedFile.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No tags
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    downloadFile(selectedFile)
                  }
                >
                  <Download size={12} />
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => renameFile(selectedFile)}
                >
                  <FileEdit size={12} />
                  Rename
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
                onClick={() =>
                  toggleTrash(selectedFile.id)
                }
              >
                <Trash2 size={12} />
                {selectedFile.trashed
                  ? 'Restore file'
                  : 'Move to trash'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload dialog */}
      <Dialog
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Files"
        description="Add files to your local NexaStudy library."
      >
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.jpg,.jpeg,.png,.webp,.zip,.rar"
            onChange={handleInputChange}
          />

          <div
            className={cn(
              'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <Upload
              size={32}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <p className="text-sm font-medium">
              Drag & drop files here
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse from your computer
            </p>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose files
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Frontend-only storage
            </p>
            <p className="mt-1">
              Files selected from this browser session can be
              downloaded again during the session. Library
              metadata is persisted in localStorage. Permanent
              cloud storage will require a backend/storage
              service later.
            </p>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            Maximum file size: 10 MB per file · PDF, Office,
            text, image and archive formats supported
          </p>
        </div>
      </Dialog>

      {/* Mobile details sheet */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden">
          <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  File Details
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(selectedFile.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Close file details"
              >
                <X size={18} />
              </button>
            </div>

            {isImage(selectedFile) &&
            sessionFiles[selectedFile.id] ? (
              <div className="mb-4 overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={URL.createObjectURL(
                    sessionFiles[selectedFile.id],
                  )}
                  alt={selectedFile.name}
                  className="h-48 w-full object-contain"
                />
              </div>
            ) : (
              <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-muted">
                <FileIcon
                  mimeType={selectedFile.mimeType}
                  size={38}
                  className="text-muted-foreground"
                />
              </div>
            )}

            <p className="mb-4 break-words text-sm font-medium">
              {selectedFile.name}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadFile(selectedFile)
                }
              >
                <Download size={13} />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => renameFile(selectedFile)}
              >
                <FileEdit size={13} />
                Rename
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="col-span-2 text-red-600"
                onClick={() =>
                  toggleTrash(selectedFile.id)
                }
              >
                <Trash2 size={13} />
                {selectedFile.trashed
                  ? 'Restore'
                  : 'Move to trash'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}