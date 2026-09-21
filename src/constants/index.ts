/**
 * NexaStudy Constants
 *
 * Central export point for application constants and navigation config.
 *
 * Usage:
 *   import { NavigationConfig, sidebarGroups } from '@/constants';
 *   import type { NavItem, SidebarGroup } from '@/constants';
 *
 * Keep actual constants in dedicated files and re-export them here.
 */

/* -------------------------------------------------------------------------- */
/* Shared Types                                                                */
/* -------------------------------------------------------------------------- */

export type {
  Theme,
  ThemeName,
  ThemePreset,
  ThemeColors,
  SidebarGroup,
  NavItem,
  Subject,
  Task,
  Subtask,
  RecurringRule,
  Note,
  Document,
  DocumentVersion,
  NexaStudyFile,
  File,
  Folder,
  CalendarEvent,
  CalendarEventType,
  Assignment,
  AssignmentStatus,
  Exam,
  Attendance,
  StudySession,
  StudyGoal,
  PomodoroSession,
  Flashcard,
  FlashcardDeck,
  Favorite,
  RecentActivity,
  RecentActivityType,
  UserSettings,
  NotificationSettings,
  Preferences,
  PrivacySettings,
  UserProfile,
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AnalyticsData,
  SubjectStudyDistribution,
  ProductivityPoint,
  GPAEntry,
  SemesterGPA,
  CalculatorHistoryEntry,
  CalculatorState,
  ConversionResult,
  ApiError,
  ApiResponse,
  PaginatedResponse,
  ID,
  ISODateString,
  Priority,
  CompletionStatus,
} from '@/types';

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export {
  NavigationConfig,
  sidebarGroups,
} from './navigation';