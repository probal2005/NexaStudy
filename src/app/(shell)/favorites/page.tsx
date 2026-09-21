'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  CloudRain,
  CloudSun,
  File,
  FileText,
  GraduationCap,
  History,
  Pin,
  Star,
  StickyNote,
  Thermometer,
  Trash2,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';

type FavoriteSection =
  | 'all'
  | 'files'
  | 'notes'
  | 'subjects'
  | 'tools'
  | 'locations';

type FavoriteItemType =
  | 'file'
  | 'note'
  | 'subject'
  | 'tool'
  | 'location';

interface FavoriteItem {
  id: string;
  type: FavoriteItemType;
  title: string;
  subtitle: string;
  meta?: string;
  href?: string;
  icon: typeof FileText;
  color?: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  icon: typeof Cloud;
  color: string;
}

const FAVORITES_STORAGE_KEY = 'nexastudy_favorites';

const defaultFavorites: FavoriteItem[] = [
  {
    id: 'file-1',
    type: 'file',
    title: 'DBMS_Notes_Complete.pdf',
    subtitle: 'CS 301',
    meta: 'PDF · 2.4 MB',
    icon: FileText,
  },
  {
    id: 'file-2',
    type: 'file',
    title: 'Calculus_Formula_Cheatsheet.pdf',
    subtitle: 'MA 202',
    meta: 'PDF · 1.1 MB',
    icon: FileText,
  },
  {
    id: 'file-3',
    type: 'file',
    title: 'Study_Plan_Semester2.xlsx',
    subtitle: 'General',
    meta: 'XLSX · 90 KB',
    icon: File,
  },
  {
    id: 'file-4',
    type: 'file',
    title: 'Semester_Grades.xlsx',
    subtitle: 'Academic',
    meta: 'XLSX · 150 KB',
    icon: File,
  },
  {
    id: 'file-5',
    type: 'file',
    title: 'Math_Formula_Cheatsheet.jpg',
    subtitle: 'MA 202',
    meta: 'JPG · 240 KB',
    icon: Cloud,
  },

  {
    id: 'note-1',
    type: 'note',
    title: 'DBMS Indexing Techniques',
    subtitle: 'CS 301',
    meta: '89 words · 2 hours ago',
    icon: StickyNote,
  },
  {
    id: 'note-2',
    type: 'note',
    title: 'Calculus: Integration Formulas',
    subtitle: 'MA 202',
    meta: '45 words · 3 days ago',
    icon: StickyNote,
  },
  {
    id: 'note-3',
    type: 'note',
    title: 'Physics Lab: Optics Experiment',
    subtitle: 'PH 201',
    meta: '64 words · 1 week ago',
    icon: StickyNote,
  },

  {
    id: 'subject-1',
    type: 'subject',
    title: 'CS 301 - DBMS',
    subtitle: 'Dr. Anil Kumar',
    meta: 'CS 301 · 4 credits',
    icon: GraduationCap,
    color: '#4F46E5',
  },
  {
    id: 'subject-2',
    type: 'subject',
    title: 'MA 202 - Calculus II',
    subtitle: 'Dr. Rajesh Patel',
    meta: 'MA 202 · 4 credits',
    icon: GraduationCap,
    color: '#10B981',
  },
  {
    id: 'subject-3',
    type: 'subject',
    title: 'EC 201 - Microeconomics',
    subtitle: 'Dr. Vikram Singh',
    meta: 'EC 201 · 3 credits',
    icon: GraduationCap,
    color: '#EC4899',
  },

  {
    id: 'tool-1',
    type: 'tool',
    title: 'GPA / CGPA Calculator',
    subtitle: 'Track your academic performance',
    href: '/gpa',
    icon: TrendingUp,
  },
  {
    id: 'tool-2',
    type: 'tool',
    title: 'Pomodoro Timer',
    subtitle: 'Focus sessions',
    href: '/pomodoro',
    icon: Clock,
  },
  {
    id: 'tool-3',
    type: 'tool',
    title: 'Basic Calculator',
    subtitle: 'Quick calculations',
    href: '/calculators',
    icon: Calculator,
  },
  {
    id: 'tool-4',
    type: 'tool',
    title: 'Temperature Converter',
    subtitle: 'Unit conversions',
    href: '/converters',
    icon: Thermometer,
  },

  {
    id: 'location-1',
    type: 'location',
    title: 'New Delhi',
    subtitle: 'India',
    meta: '28°C',
    icon: CloudSun,
  },
  {
    id: 'location-2',
    type: 'location',
    title: 'Bangalore',
    subtitle: 'India',
    meta: '24°C',
    icon: Cloud,
  },
  {
    id: 'location-3',
    type: 'location',
    title: 'London',
    subtitle: 'United Kingdom',
    meta: '15°C',
    icon: CloudRain,
  },
];

const defaultActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'file_uploaded',
    description: 'Uploaded DBMS_Notes_Complete.pdf',
    createdAt: '2 hours ago',
    icon: Cloud,
    color: '#3B82F6',
  },
  {
    id: 'activity-2',
    type: 'note_created',
    description: 'Created note: "Calculus Integration Formulas"',
    createdAt: '5 hours ago',
    icon: StickyNote,
    color: '#F59E0B',
  },
  {
    id: 'activity-3',
    type: 'task_completed',
    description: 'Completed: "Read Chapter 5 of OS"',
    createdAt: 'Yesterday',
    icon: CheckCircle2,
    color: '#10B981',
  },
  {
    id: 'activity-4',
    type: 'document_edited',
    description: 'Edited document: "Physics Lab Report"',
    createdAt: 'Yesterday',
    icon: FileText,
    color: '#8B5CF6',
  },
  {
    id: 'activity-5',
    type: 'study_session_completed',
    description: 'Study session: DBMS (1h 30m)',
    createdAt: '2 days ago',
    icon: BookOpen,
    color: '#4F46E5',
  },
  {
    id: 'activity-6',
    type: 'assignment_updated',
    description: 'Updated: DBMS Project submission',
    createdAt: '2 days ago',
    icon: TrendingUp,
    color: '#EF4444',
  },
  {
    id: 'activity-7',
    type: 'exam_added',
    description: 'Added: Thermodynamics Final Exam',
    createdAt: '3 days ago',
    icon: GraduationCap,
    color: '#EC4899',
  },
  {
    id: 'activity-8',
    type: 'favorite_added',
    description: 'Favorited: Calculus notes',
    createdAt: '3 days ago',
    icon: Star,
    color: '#FBBF24',
  },
];

const sectionLabels: Record<FavoriteSection, string> = {
  all: 'All Favorites',
  files: 'Favorite Files',
  notes: 'Favorite Notes',
  subjects: 'Favorite Subjects',
  tools: 'Favorite Tools',
  locations: 'Favorite Weather Locations',
};

const typeLabels: Record<FavoriteItemType, string> = {
  file: 'Files',
  note: 'Notes',
  subject: 'Subjects',
  tool: 'Tools',
  location: 'Locations',
};

function getStorageFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') {
    return defaultFavorites;
  }

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!stored) {
      return defaultFavorites;
    }

    const parsed = JSON.parse(stored) as FavoriteItem[];

    if (!Array.isArray(parsed)) {
      return defaultFavorites;
    }

    return parsed.map((item) => ({
      ...item,
      icon:
        item.type === 'file'
          ? FileText
          : item.type === 'note'
            ? StickyNote
            : item.type === 'subject'
              ? GraduationCap
              : item.type === 'tool'
                ? TrendingUp
                : Cloud,
    }));
  } catch {
    return defaultFavorites;
  }
}

function getActivityLabel(type: string) {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function FavoritesAndActivityPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(defaultFavorites);
  const [activeSection, setActiveSection] =
    useState<FavoriteSection>('all');
  const [search, setSearch] = useState('');
  const [showAllActivity, setShowAllActivity] = useState(false);

  useEffect(() => {
    setFavorites(getStorageFavorites());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(
          favorites.map(({ icon, ...item }) => item)
        )
      );
    } catch {
      // Ignore storage failures.
    }
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return favorites.filter((item) => {
      const sectionMatches =
        activeSection === 'all' ||
        item.type === activeSection.slice(0, -1);

      const searchMatches =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.subtitle.toLowerCase().includes(normalizedSearch) ||
        item.meta?.toLowerCase().includes(normalizedSearch);

      return sectionMatches && searchMatches;
    });
  }, [favorites, activeSection, search]);

  const visibleActivity = showAllActivity
    ? defaultActivity
    : defaultActivity.slice(0, 6);

  const counts = useMemo(() => {
    return {
      all: favorites.length,
      files: favorites.filter((item) => item.type === 'file').length,
      notes: favorites.filter((item) => item.type === 'note').length,
      subjects: favorites.filter((item) => item.type === 'subject').length,
      tools: favorites.filter((item) => item.type === 'tool').length,
      locations: favorites.filter((item) => item.type === 'location').length,
    };
  }, [favorites]);

  const removeFavorite = (id: string) => {
    setFavorites((current) => current.filter((item) => item.id !== id));
  };

  const clearCurrentSection = () => {
    if (activeSection === 'all') {
      setFavorites([]);
      return;
    }

    const targetType = activeSection.slice(0, -1);

    setFavorites((current) =>
      current.filter((item) => item.type !== targetType)
    );
  };

  const restoreDefaults = () => {
    setFavorites(defaultFavorites);
  };

  const sections: FavoriteSection[] = [
    'all',
    'files',
    'notes',
    'subjects',
    'tools',
    'locations',
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
                <Star size={20} className="fill-current" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Favorites & Recent Activity
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your saved items and activity history
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCurrentSection}
                className="gap-2"
              >
                <Trash2 size={14} />
                Clear {activeSection === 'all' ? 'All' : typeLabels[activeSection.slice(0, -1) as FavoriteItemType]}
              </Button>
            )}

            {favorites.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={restoreDefaults}
                className="gap-2"
              >
                <History size={14} />
                Restore Demo Data
              </Button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                activeSection === section
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {sectionLabels[section]}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  activeSection === section
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {counts[section]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search favorites..."
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        {/* Favorites column */}
        <div className="min-w-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  {sectionLabels[activeSection]}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {filteredFavorites.length} saved item
                  {filteredFavorites.length === 1 ? '' : 's'}
                </p>
              </div>

              <Badge>{filteredFavorites.length}</Badge>
            </CardHeader>

            <CardContent className="p-0">
              {filteredFavorites.length === 0 ? (
                <EmptyState
                  title={
                    search
                      ? 'No matching favorites'
                      : 'No favorites here'
                  }
                  description={
                    search
                      ? 'Try a different search term.'
                      : 'Star useful items to keep them available here.'
                  }
                />
              ) : (
                <div className="divide-y divide-border">
                  {filteredFavorites.map((item) => {
                    const Icon = item.icon;

                    const content = (
                      <div className="group flex items-center gap-3 p-3 transition-colors hover:bg-muted/50">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted',
                            item.type === 'note' &&
                              'bg-yellow-500/10 text-yellow-600',
                            item.type === 'tool' &&
                              'bg-primary/10 text-primary',
                            item.type === 'location' &&
                              'bg-blue-500/10 text-blue-600'
                          )}
                          style={
                            item.type === 'subject' && item.color
                              ? {
                                  backgroundColor: `${item.color}20`,
                                  color: item.color,
                                }
                              : undefined
                          }
                        >
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                            {item.meta ? ` · ${item.meta}` : ''}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          {item.href && (
                            <ChevronRight
                              size={16}
                              className="text-muted-foreground"
                            />
                          )}

                          <button
                            type="button"
                            aria-label={`Remove ${item.title} from favorites`}
                            title="Remove from favorites"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              removeFavorite(item.id);
                            }}
                            className="rounded-md p-2 text-yellow-500 opacity-100 transition-colors hover:bg-yellow-500/10 hover:text-yellow-600"
                          >
                            <Star
                              size={15}
                              className="fill-current"
                            />
                          </button>
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link key={item.id} href={item.href}>
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <div key={item.id}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity column */}
        <div className="min-w-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  Recent Activity
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your latest actions in NexaStudy
                </p>
              </div>

              <Badge>{defaultActivity.length} events</Badge>
            </CardHeader>

            <CardContent className="p-0">
              {visibleActivity.length === 0 ? (
                <EmptyState
                  title="No recent activity"
                  description="Your activity will appear here."
                />
              ) : (
                <div className="divide-y divide-border">
                  {visibleActivity.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: activity.color }}
                        >
                          <Icon size={14} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm">
                            {activity.description}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={10} />
                            {activity.createdAt}
                          </p>
                        </div>

                        <Badge className="hidden shrink-0 text-[10px] sm:inline-flex">
                          {getActivityLabel(activity.type)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              {defaultActivity.length > 6 && (
                <div className="border-t border-border p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      setShowAllActivity((current) => !current)
                    }
                  >
                    {showAllActivity
                      ? 'Show Less'
                      : `Show All ${defaultActivity.length} Events`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Star size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{counts.all}</p>
              <p className="text-xs text-muted-foreground">
                Total Favorites
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <FileText size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{counts.files}</p>
              <p className="text-xs text-muted-foreground">
                Saved Files
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600">
              <StickyNote size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{counts.notes}</p>
              <p className="text-xs text-muted-foreground">
                Saved Notes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <GraduationCap size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{counts.subjects}</p>
              <p className="text-xs text-muted-foreground">
                Saved Subjects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prototype notice */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Pin
            size={18}
            className="mt-0.5 shrink-0 text-muted-foreground"
          />

          <div>
            <p className="text-sm font-medium">
              Favorites are currently stored locally
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              This frontend version uses browser localStorage, so your
              favorite changes survive page refreshes on this device.
              A future database layer can replace this storage without
              changing the page UI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}