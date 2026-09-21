'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart2,
  BookMarked,
  BookOpen,
  Calendar,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  CloudRain,
  Clipboard,
  FileEdit,
  FileText,
  Flame,
  FlaskConical,
  GraduationCap,
  History,
  Home,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  Ruler,
  Settings,
  Sparkles,
  Star,
  StickyNote,
  Timer,
  TrendingUp,
  User,
  UserPlus,
  Wrench,
  Zap,
} from 'lucide-react';

import { cn } from '@/utils';
import {
  NavigationConfig,
  sidebarGroups,
  type NavigationGroup,
} from '@/constants/navigation';

import type { NavItem } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  StickyNote,
  FileText,

  // Navigation config compatibility
  CheckSquare: CheckCircle2,

  Calendar,
  GraduationCap,
  Timer,
  Notes: FileText,
  BookMarked,
  ClipboardList: Clipboard,
  Clipboard,

  FlaskConical,
  UserPlus,
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
  Zap,
  Wrench,
  Flame,
  Sparkles,
  PenTool,
};

const groupColors: Record<
  string,
  {
    from: string;
    to: string;
    text: string;
  }
> = {
  workspace: {
    from: 'from-blue-500/15',
    to: 'to-cyan-500/15',
    text: 'text-blue-500',
  },
  productivity: {
    from: 'from-violet-500/15',
    to: 'to-purple-500/15',
    text: 'text-violet-500',
  },
  academic: {
    from: 'from-emerald-500/15',
    to: 'to-teal-500/15',
    text: 'text-emerald-500',
  },
  tools: {
    from: 'from-amber-500/15',
    to: 'to-orange-500/15',
    text: 'text-amber-500',
  },
  insights: {
    from: 'from-pink-500/15',
    to: 'to-rose-500/15',
    text: 'text-pink-500',
  },
  system: {
    from: 'from-slate-500/15',
    to: 'to-gray-500/15',
    text: 'text-slate-500',
  },
};

const groupIcons: Record<string, LucideIcon> = {
  workspace: BookOpen,
  productivity: Sparkles,
  academic: GraduationCap,
  tools: Wrench,
  insights: BarChart2,
  system: Settings,
};

function isRouteActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const groupedItems = useMemo(() => {
    return NavigationConfig.reduce(
      (groups, item) => {
        const groupKey = item.group;

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }

        groups[groupKey].push(item);

        return groups;
      },
      {} as Record<NavigationGroup, NavItem[]>,
    );
  }, []);

  const renderIcon = (iconName: string, size = 20) => {
    const Icon = iconMap[iconName] ?? Home;

    return (
      <Icon
        size={size}
        className="shrink-0"
        aria-hidden="true"
      />
    );
  };

  const renderGroup = (
  groupKey: NavigationGroup,
  items: NavItem[],
) => {
    const group = sidebarGroups[groupKey];

    if (!group) {
      return null;
    }

    const colors = groupColors[groupKey] ?? groupColors.system;
    const GroupIcon = groupIcons[groupKey] ?? Home;

    return (
      <section
        key={groupKey}
        className="mb-4 last:mb-0"
        aria-labelledby={`sidebar-group-${groupKey}`}
      >
        {/* Group heading */}
        {!collapsed && (
          <div
            className={cn(
              'mb-1.5 flex items-center gap-2 rounded-lg px-3 py-2',
              'bg-gradient-to-r',
              colors.from,
              colors.to,
            )}
          >
            <GroupIcon
              size={14}
              className={cn('shrink-0', colors.text)}
              aria-hidden="true"
            />

            <h2
              id={`sidebar-group-${groupKey}`}
              className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {group.label}
            </h2>
          </div>
        )}

        {/* Collapsed group separator */}
        {collapsed && (
          <div
            className="mx-2 mb-2 h-px bg-border/70"
            aria-hidden="true"
          />
        )}

        <div className="space-y-0.5">
          {items.map((item) => {
            const active = isRouteActive(pathname, item.href);
            const Icon = iconMap[item.icon] ?? Home;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg',
                  'px-3 py-2.5 text-sm font-medium',
                  'transition-colors duration-150',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-primary',
                  collapsed && 'justify-center px-2',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {/* Active indicator */}
                {active && (
                  <span
                    className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    'flex shrink-0 items-center justify-center',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.3 : 2}
                    aria-hidden="true"
                  />
                </span>

                {/* Label + badge */}
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'ml-auto shrink-0 rounded-full',
                          'bg-primary px-1.5 py-0.5',
                          'text-[10px] font-semibold leading-none',
                          'text-primary-foreground',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col',
        'overflow-hidden border-r border-border bg-card',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
      aria-label="Sidebar navigation"
    >
      {/* Decorative left rail */}
      <div
        className="pointer-events-none absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"
        aria-hidden="true"
      />

      {/* Header / Logo */}
      <div
        className={cn(
          'relative z-10 flex h-14 shrink-0 items-center',
          'border-b border-border',
          collapsed
            ? 'justify-center px-2'
            : 'justify-between px-4',
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            'group flex min-w-0 items-center',
            collapsed ? 'justify-center' : 'gap-3',
          )}
          aria-label="NexaStudy dashboard"
        >
          <span
            className={cn(
              'flex shrink-0 items-center justify-center rounded-lg',
              'bg-gradient-to-br from-primary to-accent',
              'text-primary-foreground',
              'shadow-md shadow-primary/15',
              'transition-transform duration-200',
              'group-hover:scale-105',
              collapsed ? 'h-9 w-9' : 'h-9 w-9',
            )}
          >
            <GraduationCap
              size={20}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          {!collapsed && (
            <span className="truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-lg font-bold tracking-tight text-transparent">
              NexaStudy
            </span>
          )}
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'rounded-md p-1.5',
              'text-muted-foreground',
              'transition-colors',
              'hover:bg-accent hover:text-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-primary',
            )}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose
              size={17}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto p-2 scrollbar-thin"
        aria-label="Main navigation"
      >
        {(Object.keys(sidebarGroups) as NavigationGroup[]).map((groupKey) => {
          const items = groupedItems[groupKey] ?? [];

          if (items.length === 0) {
            return null;
          }

          return renderGroup(groupKey, items);
        })}
      </nav>

      {/* Bottom controls */}
      <div className="relative z-10 shrink-0 border-t border-border/70 p-2">
        <div
          className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'group flex w-full items-center gap-3 rounded-lg',
            'px-3 py-2.5 text-sm font-medium',
            'text-muted-foreground',
            'transition-colors',
            'hover:bg-accent hover:text-foreground',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary',
            collapsed && 'justify-center px-2',
          )}
          aria-label={
            collapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
          title={collapsed ? 'Expand sidebar' : undefined}
        >
          {collapsed ? (
            <PanelLeftOpen
              size={18}
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />
          ) : (
            <>
              <ChevronLeft
                size={18}
                className="shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>

      {/* Small decorative glow */}
      {!collapsed && (
        <div
          className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-primary/20 blur-xl"
          aria-hidden="true"
        />
      )}
    </aside>
  );
}