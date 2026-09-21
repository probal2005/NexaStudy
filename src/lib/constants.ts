export const APP_NAME = 'NexaStudy';

export const STORAGE_KEYS = {
  profile: 'nexastudy_profile_v1',
  settings: 'nexastudy_settings_v1',
  tasks: 'nexastudy_tasks_v1',
  assignments: 'nexastudy_assignments_v1',
  attendance: 'nexastudy_attendance_v1',
  calendar: 'nexastudy_calendar_v1',
  studyGoals: 'nexastudy_study_goals_v1',
  studySessions: 'nexastudy_study_sessions_v1',
  notes: 'nexastudy_notes_v1',
  stickyNotes: 'nexastudy_sticky_notes_v1',
  pomodoro: 'nexastudy_pomodoro_v1',
  favorites: 'nexastudy_favorites_v1',
  recentCities: 'nexastudy_recent_cities_v1',
  library: 'nexastudy_library_v1',
} as const;

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  forgotPassword: '/auth/forgot-password',

  dashboard: '/dashboard',
  tasks: '/tasks',
  assignments: '/assignments',
  calendar: '/calendar',
  study: '/study',
  notes: '/notes',
  stickyNotes: '/sticky-notes',
  subjects: '/subjects',
  attendance: '/attendance',
  exams: '/exams',
  gpa: '/gpa',
  library: '/library',

  calculators: '/calculators',
  converters: '/converters',
  fileTools: '/file-tools',
  pomodoro: '/pomodoro',
  weather: '/weather',
  documents: '/documents',
  codeEditor: '/code-editor',

  analytics: '/analytics',
  activity: '/activity',
  favorites: '/favorites',

  profile: '/profile',
  settings: '/settings',
} as const;

export const DATE_FORMATS = {
  short: 'short',
  medium: 'medium',
  long: 'long',
  time: 'time',
  dateTime: 'dateTime',
} as const;

export const DEFAULTS = {
  taskPageSize: 10,
  assignmentPageSize: 10,
  libraryPageSize: 12,

  pomodoroFocusMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  pomodoroSessionsBeforeLongBreak: 4,

  targetAttendance: 75,

  maxUploadSizeMB: 20,
  maxAvatarSizeMB: 2,
} as const;

export const FILE_TYPES = {
  images: [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],

  documents: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  pdf: ['application/pdf'],

  common: [
    'image/*',
    'application/pdf',
    'text/plain',
    'application/json',
  ],
} as const;

export const GRADE_POINTS: Record<string, number> = {
  'A+': 10,
  A: 9,
  'B+': 8,
  B: 7,
  'C+': 6,
  C: 5,
  D: 4,
  F: 0,
};

export const ATTENDANCE_STATUS = {
  present: 'present',
  absent: 'absent',
  late: 'late',
  excused: 'excused',
} as const;

export const TASK_STATUS = {
  todo: 'todo',
  inProgress: 'in-progress',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export const TASK_PRIORITY = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  urgent: 'urgent',
} as const;