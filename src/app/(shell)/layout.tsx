'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { cn } from '@/utils';

const PROFILE_STORAGE_KEY = 'nexastudy_profile_v1';

interface StoredProfile {
  name?: string;
  avatar?: string;
  email?: string;
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  activity: 'Activity',
  analytics: 'Analytics',
  assignments: 'Assignments',
  attendance: 'Attendance',
  calculators: 'Calculators',
  calendar: 'Calendar',
  'code-editor': 'Code Editor',
  converters: 'Converters',
  documents: 'Documents',
  exams: 'Exams',
  favorites: 'Favorites',
  'file-tools': 'File Tools',
  gpa: 'GPA Calculator',
  library: 'Library',
  notes: 'Notes',
  pomodoro: 'Pomodoro',
  profile: 'Profile',
  settings: 'Settings',
  'sticky-notes': 'Sticky Notes',
  study: 'Study',
  subjects: 'Subjects',
  tasks: 'Tasks',
  weather: 'Weather',
};

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'NS';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) {
    return 'Dashboard';
  }

  return (
    pageTitles[lastSegment] ||
    lastSegment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const [profile, setProfile] = useState<StoredProfile>({
    name: 'Student',
    avatar: '',
    email: '',
  });

  /*
   * Load profile information from localStorage.
   */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as StoredProfile;

      setProfile({
        name: parsed.name?.trim() || 'Student',
        avatar: parsed.avatar || '',
        email: parsed.email || '',
      });
    } catch (error) {
      console.warn(
        'Unable to load NexaStudy profile:',
        error,
      );
    }
  }, []);

  /*
   * Synchronize profile changes made elsewhere in the app.
   */
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== PROFILE_STORAGE_KEY ||
        !event.newValue
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(
          event.newValue,
        ) as StoredProfile;

        setProfile({
          name: parsed.name?.trim() || 'Student',
          avatar: parsed.avatar || '',
          email: parsed.email || '',
        });
      } catch (error) {
        console.warn(
          'Unable to synchronize NexaStudy profile:',
          error,
        );
      }
    };

    window.addEventListener(
      'storage',
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage,
      );
    };
  }, []);

  /*
   * Close mobile navigation after route change.
   */
  useEffect(() => {
    setSidebarMobileOpen(false);
  }, [pathname]);

  /*
   * Lock background scrolling while mobile drawer is open.
   */
  useEffect(() => {
    if (!sidebarMobileOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [sidebarMobileOpen]);

  const pageTitle = useMemo(
    () => getPageTitle(pathname),
    [pathname],
  );

  const initials = useMemo(
    () => getInitials(profile.name || 'Student'),
    [profile.name],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ================================================== */}
      {/* DESKTOP SIDEBAR                                   */}
      {/* ================================================== */}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden lg:block',
          'transition-[width] duration-200 ease-out',
          sidebarCollapsed
            ? 'w-[72px]'
            : 'w-[260px]',
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() =>
            setSidebarCollapsed(
              (current) => !current,
            )
          }
        />
      </aside>

      {/* ================================================== */}
      {/* MOBILE SIDEBAR OVERLAY                             */}
      {/* ================================================== */}

      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
            onClick={() =>
              setSidebarMobileOpen(false)
            }
          />

          {/* Drawer */}
          <div className="relative z-10 h-full w-[280px] max-w-[85vw] bg-card shadow-2xl">
            <div className="flex h-14 items-center justify-end border-b border-border px-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarMobileOpen(false)
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-[calc(100%-56px)] overflow-y-auto">
              <Sidebar
                collapsed={false}
                onToggle={() =>
                  setSidebarMobileOpen(false)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MAIN APPLICATION AREA                             */}
      {/* ================================================== */}

      <main
        id="main-content"
        className={cn(
          'min-h-screen transition-[margin] duration-200',
          'lg:ml-[260px]',
          sidebarCollapsed && 'lg:ml-[72px]',
        )}
      >
        {/* ================================================== */}
        {/* TOP APPLICATION HEADER                             */}
        {/* ================================================== */}

        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md lg:px-6">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setSidebarMobileOpen(true)
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Open navigation"
              aria-expanded={sidebarMobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page title */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Theme */}
            <ThemeSwitcher />

            {/* Profile */}
            <div className="ml-1 flex items-center gap-2 border-l border-border pl-3">
              <div className="hidden max-w-[160px] sm:block">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile.name || 'Student'}
                </p>

                {profile.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {profile.email}
                  </p>
                )}
              </div>

              {/* Avatar */}
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.name || 'Student'} profile`}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm"
                  aria-label={`${profile.name || 'Student'} avatar`}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* PAGE CONTENT                                       */}
        {/* ================================================== */}

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}