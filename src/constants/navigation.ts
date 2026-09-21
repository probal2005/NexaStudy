/**
 * NexaStudy Navigation Configuration
 *
 * Central source of truth for:
 * - Main application navigation
 * - Navigation groups
 * - Sidebar group metadata
 *
 * Keep navigation labels, routes, icons, and groups here.
 */

import type { NavItem, SidebarGroup } from '@/types';

/* -------------------------------------------------------------------------- */
/* Navigation Groups                                                          */
/* -------------------------------------------------------------------------- */

export type NavigationGroup = SidebarGroup;

/* -------------------------------------------------------------------------- */
/* Navigation Configuration                                                   */
/* -------------------------------------------------------------------------- */

export const NavigationConfig: NavItem[] = [
  /* ================================ WORKSPACE ================================ */

  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    group: 'workspace',
  },
  {
    label: 'Library',
    href: '/library',
    icon: 'BookOpen',
    group: 'workspace',
  },
  {
    label: 'Notes',
    href: '/notes',
    icon: 'StickyNote',
    group: 'workspace',
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: 'FileText',
    group: 'workspace',
  },

  /* ============================== PRODUCTIVITY ============================== */

  {
    label: 'Tasks',
    href: '/tasks',
    icon: 'CheckCircle2',
    group: 'productivity',
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: 'Calendar',
    group: 'productivity',
  },
  {
    label: 'Study Planner',
    href: '/study',
    icon: 'GraduationCap',
    group: 'productivity',
  },
  {
    label: 'Pomodoro',
    href: '/pomodoro',
    icon: 'Timer',
    group: 'productivity',
  },
  {
    label: 'Sticky Notes',
    href: '/sticky-notes',
    icon: 'StickyNote',
    group: 'productivity',
  },

  /* ================================= ACADEMIC ================================= */

  {
    label: 'Subjects',
    href: '/subjects',
    icon: 'BookMarked',
    group: 'academic',
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: 'Clipboard',
    group: 'academic',
  },
  {
    label: 'Exams',
    href: '/exams',
    icon: 'FlaskConical',
    group: 'academic',
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: 'UserPlus',
    group: 'academic',
  },
  {
    label: 'GPA / CGPA',
    href: '/gpa',
    icon: 'TrendingUp',
    group: 'academic',
  },

  /* ================================== TOOLS ================================== */

  {
    label: 'Calculators',
    href: '/calculators',
    icon: 'Calculator',
    group: 'tools',
  },
  {
    label: 'Converters',
    href: '/converters',
    icon: 'Ruler',
    group: 'tools',
  },
  {
    label: 'File Tools',
    href: '/file-tools',
    icon: 'FileEdit',
    group: 'tools',
  },
  {
    label: 'Weather',
    href: '/weather',
    icon: 'CloudRain',
    group: 'tools',
  },
  {
    label: 'Code Editor',
    href: '/code-editor',
    icon: 'FileEdit',
    group: 'tools',
  },

  /* ================================= INSIGHTS ================================= */

  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'BarChart2',
    group: 'insights',
  },
  {
    label: 'Favorites',
    href: '/favorites',
    icon: 'Star',
    group: 'insights',
  },
  {
    label: 'Recent Activity',
    href: '/activity',
    icon: 'History',
    group: 'insights',
  },

  /* ================================== SYSTEM ================================== */

  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
    group: 'system',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'User',
    group: 'system',
  },
];

/* -------------------------------------------------------------------------- */
/* Sidebar Groups                                                             */
/* -------------------------------------------------------------------------- */

export const sidebarGroups: Record<
  NavigationGroup,
  {
    label: string;
    icon: string;
  }
> = {
  workspace: {
    label: 'Workspace',
    icon: 'Home',
  },

  productivity: {
    label: 'Productivity',
    icon: 'Zap',
  },

  academic: {
    label: 'Academic',
    icon: 'GraduationCap',
  },

  tools: {
    label: 'Tools',
    icon: 'Wrench',
  },

  insights: {
    label: 'Insights',
    icon: 'BarChart2',
  },

  system: {
    label: 'System',
    icon: 'Settings',
  },
};