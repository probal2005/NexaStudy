// Type definitions for NexaStudy
// Updated: 2026-09-21

/* -------------------------------------------------------------------------- */
/* Primitive / Common Types                                                   */
/* -------------------------------------------------------------------------- */

export type ID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export type SortDirection = 'asc' | 'desc';

export type ViewMode = 'grid' | 'list';

export type DateRange = {
  start: ISODateString;
  end: ISODateString;
};

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

export type Theme =
  | 'light'
  | 'dark'
  | 'system'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'midnight';

export type ThemeName = Theme;

export type ResolvedTheme = Exclude<Theme, 'system'>;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
  muted: string;
  ring: string;
}

export interface ThemePreset {
  name: ThemeName;
  label: string;
  icon: string;
  colors: ThemeColors;
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export type SidebarGroup =
  | 'workspace'
  | 'productivity'
  | 'academic'
  | 'tools'
  | 'insights'
  | 'system';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  group: SidebarGroup;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Common Entity                                                              */
/* -------------------------------------------------------------------------- */

export interface BaseEntity {
  id: ID;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

/* -------------------------------------------------------------------------- */
/* Priority / Status                                                          */
/* -------------------------------------------------------------------------- */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type CompletionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'overdue';

/* -------------------------------------------------------------------------- */
/* Subjects                                                                   */
/* -------------------------------------------------------------------------- */

export interface Subject extends BaseEntity {
  name: string;
  code: string;
  teacher: string;
  credits: number;
  semester: number;
  color: string;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                      */
/* -------------------------------------------------------------------------- */

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: ISODateString;
  dueTime?: string;
  subjectId?: ID;
  tags?: string[];
  subtasks?: Subtask[];
  recurring?: RecurringRule;
  reminder?: ISODateString;
}

export interface Subtask {
  id: ID;
  title: string;
  completed: boolean;
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  endDate?: ISODateString;
  interval?: number;
  daysOfWeek?: number[];
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                      */
/* -------------------------------------------------------------------------- */

export interface Note extends BaseEntity {
  title: string;
  content: string;
  subjectId?: ID;
  tags?: string[];
  favorite: boolean;
  archived: boolean;
  wordCount: number;
  charCount: number;
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                  */
/* -------------------------------------------------------------------------- */

export interface StudyDocument extends BaseEntity {
  title: string;
  content: string;
  subjectId?: ID;
  tags?: string[];
  favorite: boolean;
  wordCount: number;
  version: number;
  versions?: DocumentVersion[];
}

/**
 * Backward-compatible alias.
 */
export type Document = StudyDocument;

export interface DocumentVersion {
  id: ID;
  content: string;
  createdAt: ISODateString;
  createdBy?: ID;
}

/* -------------------------------------------------------------------------- */
/* Files                                                                      */
/* -------------------------------------------------------------------------- */

export interface NexaStudyFile extends BaseEntity {
  name: string;
  size: number;
  type: string;
  mimeType: string;
  folderId?: ID;
  tags?: string[];
  favorite: boolean;
  trashed: boolean;
  uploadedAt: ISODateString;
  modifiedAt: ISODateString;
}

export type File = NexaStudyFile;

export interface Folder extends BaseEntity {
  name: string;
  parentId?: ID;
}

/* -------------------------------------------------------------------------- */
/* Calendar                                                                   */
/* -------------------------------------------------------------------------- */

export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  start: ISODateString;
  end?: ISODateString;
  allDay?: boolean;
  type: CalendarEventType;
  color?: string;
  subjectId?: ID;
  taskId?: ID;
  recurring?: RecurringRule;
  reminder?: number;
}

export type CalendarEventType =
  | 'class'
  | 'exam'
  | 'assignment'
  | 'study'
  | 'personal'
  | 'reminder'
  | 'holiday';

/**
 * Calendar reminder value is expressed in minutes before the event.
 */
export type ReminderMinutes = number;

/* -------------------------------------------------------------------------- */
/* Assignments                                                                */
/* -------------------------------------------------------------------------- */

export interface Assignment extends BaseEntity {
  title: string;
  description?: string;
  subjectId?: ID;
  status: AssignmentStatus;
  deadline: ISODateString;
  priority: Exclude<Priority, 'urgent'>;
  attachmentUrl?: string;
  completionPercentage: number;
}

export type AssignmentStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'overdue';

/* -------------------------------------------------------------------------- */
/* Exams                                                                      */
/* -------------------------------------------------------------------------- */

export interface Exam extends BaseEntity {
  title: string;
  subjectId?: ID;
  date: ISODateString;
  time?: string;
  venue?: string;
  preparationProgress: number;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* Attendance                                                                 */
/* -------------------------------------------------------------------------- */

export interface Attendance extends BaseEntity {
  subjectId: ID;
  totalClasses: number;
  attended: number;
  absent: number;
  targetPercentage: number;
}

/* -------------------------------------------------------------------------- */
/* Study                                                                      */
/* -------------------------------------------------------------------------- */

export interface StudySession extends BaseEntity {
  subjectId?: ID;
  startTime: ISODateString;
  endTime?: ISODateString;
  duration: number;
  type: 'pomodoro' | 'study' | 'revision';
  notes?: string;
  completed: boolean;
}

export interface StudyGoal extends BaseEntity {
  title: string;
  targetHours: number;
  achievedHours: number;
  subjectId?: ID;
  deadline?: ISODateString;
}

export interface PomodoroSession extends BaseEntity {
  subjectId?: ID;
  type: 'work' | 'short_break' | 'long_break';
  duration: number;
  completed: boolean;
  startedAt: ISODateString;
  finishedAt?: ISODateString;
}

/* -------------------------------------------------------------------------- */
/* Flashcards                                                                 */
/* -------------------------------------------------------------------------- */

export interface Flashcard extends BaseEntity {
  question: string;
  answer: string;
  deckId: ID;
}

export interface FlashcardDeck extends BaseEntity {
  name: string;
  subjectId?: ID;
}

/* -------------------------------------------------------------------------- */
/* Favorites & Activity                                                       */
/* -------------------------------------------------------------------------- */

export type FavoriteType =
  | 'file'
  | 'note'
  | 'document'
  | 'subject'
  | 'tool'
  | 'weather_location';

export interface Favorite extends BaseEntity {
  type: FavoriteType;
  itemId: ID;
  label?: string;
}

export interface RecentActivity extends BaseEntity {
  type: RecentActivityType;
  description: string;
  itemId?: ID;
}

export type RecentActivityType =
  | 'file_uploaded'
  | 'note_created'
  | 'task_completed'
  | 'document_edited'
  | 'study_session_completed'
  | 'assignment_updated'
  | 'exam_added'
  | 'favorite_added';

/* -------------------------------------------------------------------------- */
/* User Settings                                                              */
/* -------------------------------------------------------------------------- */

export interface UserSettings extends BaseEntity {
  theme: Theme;
  notifications: NotificationSettings;
  preferences: Preferences;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  taskReminders: boolean;
  assignmentReminders: boolean;
  examReminders: boolean;
  studyReminders: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface Preferences {
  language: string;
  dateFormat: string;
  timeFormat: string;
  defaultUnits: string;
  startOfWeek?: 'sunday' | 'monday';
}

export interface PrivacySettings {
  allowDataExport: boolean;
  allowAccountDeletion: boolean;
  analyticsEnabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/* User Profile                                                               */
/* -------------------------------------------------------------------------- */

export interface UserProfile extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  department?: string;
  semester?: number;
  academicYear?: string;
  bio?: string;
}

/* -------------------------------------------------------------------------- */
/* Weather                                                                    */
/* -------------------------------------------------------------------------- */

export interface WeatherData {
  city: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  sunrise?: ISODateString;
  sunset?: ISODateString;
  timezone?: string;
  lastUpdated?: ISODateString;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  visibility: number;
  pressure: number;
  description: string;
  icon: string;
}

export interface HourlyForecast {
  time: ISODateString;
  temp: number;
  icon: string;
  precipitation?: number;
}

export interface DailyForecast {
  date: ISODateString;
  tempMax: number;
  tempMin: number;
  icon: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/* Analytics                                                                  */
/* -------------------------------------------------------------------------- */

export interface AnalyticsData {
  studyHours: number;
  completedTasks: number;
  overdueTasks: number;
  pomodoroSessions: number;
  subjectStudyDistribution: SubjectStudyDistribution[];
  attendanceRate: number;
  assignmentCompletionRate: number;
  weeklyProductivity: ProductivityPoint[];
  monthlyProductivity: ProductivityPoint[];
  studyStreak: number;
}

export interface SubjectStudyDistribution {
  subject: string;
  hours: number;
}

export interface ProductivityPoint {
  day?: string;
  month?: string;
  hours: number;
  tasks: number;
}

/* -------------------------------------------------------------------------- */
/* GPA                                                                        */
/* -------------------------------------------------------------------------- */

export interface GPAEntry {
  id?: ID;
  subject: string;
  subjectId?: ID;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterGPA {
  id?: ID;
  semester: number;
  gpa: number;
  credits: number;
}

/* -------------------------------------------------------------------------- */
/* Calculator                                                                 */
/* -------------------------------------------------------------------------- */

export interface CalculatorHistoryEntry {
  id?: ID;
  expression: string;
  result: string;
  createdAt?: ISODateString;
}

export interface CalculatorState {
  expression?: string;
  result?: string;
  history?: CalculatorHistoryEntry[];
}

export interface ConversionResult {
  from: string;
  to: string;
  fromValue: number;
  toValue: number;
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ApiError[];
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/* API Request Types                                                          */
/* -------------------------------------------------------------------------- */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface SearchParams {
  search?: string;
}

export interface ListParams
  extends PaginationParams,
    SortParams,
    SearchParams {
  filters?: Record<string, string | number | boolean | undefined>;
}