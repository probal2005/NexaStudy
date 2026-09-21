'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart2,
  BookMarked,
  BookOpen,
  Calendar,
  Calculator,
  CheckCircle2,
  CloudRain,
  FileEdit,
  FileText,
  GraduationCap,
  History,
  Home,
  LayoutDashboard,
  Menu,
  FileText as NotesIcon,
  Ruler,
  Settings,
  Star,
  StickyNote,
  TestTubes,
  Timer,
  TrendingUp,
  User,
  UserCheck,
  X,
} from 'lucide-react';

import { cn } from '@/utils';
import { NavigationConfig } from '@/constants/navigation';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  StickyNote,
  FileText,
  CheckSquare: CheckCircle2,
  Calendar,
  GraduationCap,
  Timer,
  Notes: NotesIcon,
  BookMarked,
  ClipboardList: FileText,
  TestTubes,
  UserCheck,
  TrendingUp,
  Calculator,
  Ruler,
  FileEdit,
  CloudRain,
  BarChart2,
  Star,
  History,
  Settings,
  User,
  Home,
};

const groups = [
  {
    key: 'workspace',
    label: 'Workspace',
  },
  {
    key: 'productivity',
    label: 'Productivity',
  },
  {
    key: 'academic',
    label: 'Academic',
  },
  {
    key: 'tools',
    label: 'Tools',
  },
  {
    key: 'insights',
    label: 'Insights',
  },
  {
    key: 'system',
    label: 'System',
  },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  const groupedItems = useMemo(() => {
    return NavigationConfig.reduce(
      (acc, item) => {
        const group = item.group;

        if (!acc[group]) {
          acc[group] = [];
        }

        acc[group].push(item);

        return acc;
      },
      {} as Record<
        string,
        typeof NavigationConfig
      >,
    );
  }, []);

  /*
   * Close the drawer whenever navigation changes.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
   * Close with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [open]);

  /*
   * Prevent background page scrolling
   * while the drawer is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /*
   * Close when clicking outside the drawer.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target = event.target;

      if (
        target instanceof Node &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );
    };
  }, [open]);

  const isActiveRoute = (
    href: string,
  ): boolean => {
    if (pathname === href) {
      return true;
    }

    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile top bar */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40',
          'border-b border-border',
          'bg-card/95 backdrop-blur-md',
          'md:hidden',
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2"
            aria-label="NexaStudy dashboard"
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0',
                'items-center justify-center',
                'rounded-lg bg-primary',
                'text-primary-foreground',
              )}
            >
              <GraduationCap
                size={17}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <span className="truncate text-base font-bold tracking-tight">
              NexaStudy
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'inline-flex items-center gap-2',
              'rounded-lg px-3 py-2',
              'text-sm font-medium',
              'text-muted-foreground',
              'transition-colors',
              'hover:bg-accent hover:text-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-primary',
            )}
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation-drawer"
          >
            <Menu
              size={20}
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              Menu
            </span>
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          'transition-[visibility,opacity]',
          'duration-200',
          open
            ? 'visible opacity-100'
            : 'invisible opacity-0',
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0',
            'cursor-default',
            'bg-black/50',
          )}
        />

        {/* Navigation drawer */}
        <nav
          id="mobile-navigation-drawer"
          ref={navRef}
          aria-label="Mobile navigation"
          className={cn(
            'absolute right-0 top-0 h-full',
            'w-[min(300px,calc(100%-48px))]',
            'overflow-y-auto',
            'border-l border-border',
            'bg-card shadow-2xl',
            'transition-transform duration-200',
            open
              ? 'translate-x-0'
              : 'translate-x-full',
          )}
        >
          {/* Drawer header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 p-4 backdrop-blur-md">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Navigation
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground/70">
                Explore NexaStudy
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg p-2',
                'text-muted-foreground',
                'transition-colors',
                'hover:bg-accent',
                'hover:text-foreground',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary',
              )}
              aria-label="Close navigation menu"
            >
              <X
                size={20}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Navigation groups */}
          <div className="p-3 pb-8">
            {groups.map(
              ({ key, label }) => {
                const items =
                  groupedItems[key] ?? [];

                if (items.length === 0) {
                  return null;
                }

                return (
                  <section
                    key={key}
                    className="mb-5 last:mb-0"
                    aria-labelledby={`mobile-nav-${key}`}
                  >
                    <h2
                      id={`mobile-nav-${key}`}
                      className={cn(
                        'px-3 py-2',
                        'text-[11px] font-semibold',
                        'uppercase tracking-[0.12em]',
                        'text-muted-foreground/70',
                      )}
                    >
                      {label}
                    </h2>

                    <div className="space-y-1">
                      {items.map((item) => {
                        const Icon =
                          iconMap[item.icon] ??
                          Home;

                        const active =
                          isActiveRoute(
                            item.href,
                          );

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() =>
                              setOpen(false)
                            }
                            aria-current={
                              active
                                ? 'page'
                                : undefined
                            }
                            className={cn(
                              'group flex items-center gap-3',
                              'rounded-xl px-3 py-2.5',
                              'text-sm font-medium',
                              'transition-colors',
                              'focus-visible:outline-none',
                              'focus-visible:ring-2',
                              'focus-visible:ring-primary',
                              active
                                ? [
                                    'bg-primary/10',
                                    'text-primary',
                                  ]
                                : [
                                    'text-muted-foreground',
                                    'hover:bg-accent',
                                    'hover:text-foreground',
                                  ],
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-8 w-8 shrink-0',
                                'items-center justify-center',
                                'rounded-lg',
                                active
                                  ? 'bg-primary/10'
                                  : 'bg-muted/60',
                              )}
                            >
                              <Icon
                                size={17}
                                strokeWidth={
                                  active
                                    ? 2.3
                                    : 2
                                }
                                aria-hidden="true"
                              />
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>

                            {active && (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                aria-hidden="true"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              },
            )}
          </div>
        </nav>
      </div>
    </>
  );
}