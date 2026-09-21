export interface StudyGoalData {
  id: string;
  title: string;
  subjectId?: string;
  targetHours: number;
  completedHours: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

export interface StudySessionData {
  id: string;
  subjectId?: string;
  title: string;
  durationMinutes: number;
  date: string;
  startTime?: string;
  endTime?: string;
  technique?: 'pomodoro' | 'deep-work' | 'revision' | 'practice' | 'other';
  notes?: string;
}

export interface WeeklyStudyData {
  day: string;
  date: string;
  minutes: number;
  sessions: number;
}

export const studyGoals: StudyGoalData[] = [
  {
    id: 'goal-001',
    title: 'Master supervised learning',
    subjectId: 'sub-001',
    targetHours: 20,
    completedHours: 13,
    deadline: '2026-09-30',
    priority: 'high',
    status: 'active',
  },
  {
    id: 'goal-002',
    title: 'Complete React revision',
    subjectId: 'sub-003',
    targetHours: 12,
    completedHours: 8,
    deadline: '2026-10-05',
    priority: 'medium',
    status: 'active',
  },
  {
    id: 'goal-003',
    title: 'Practice SQL queries',
    subjectId: 'sub-002',
    targetHours: 10,
    completedHours: 10,
    deadline: '2026-09-25',
    priority: 'medium',
    status: 'completed',
  },
];

export const studySessions: StudySessionData[] = [
  {
    id: 'session-001',
    subjectId: 'sub-001',
    title: 'Classification revision',
    durationMinutes: 50,
    date: '2026-09-20',
    startTime: '18:00',
    endTime: '18:50',
    technique: 'pomodoro',
  },
  {
    id: 'session-002',
    subjectId: 'sub-003',
    title: 'React hooks practice',
    durationMinutes: 90,
    date: '2026-09-20',
    startTime: '20:00',
    endTime: '21:30',
    technique: 'deep-work',
  },
  {
    id: 'session-003',
    subjectId: 'sub-002',
    title: 'SQL practice',
    durationMinutes: 60,
    date: '2026-09-19',
    technique: 'practice',
  },
];

export const weeklyStudyData: WeeklyStudyData[] = [
  { day: 'Mon', date: '2026-09-15', minutes: 120, sessions: 3 },
  { day: 'Tue', date: '2026-09-16', minutes: 90, sessions: 2 },
  { day: 'Wed', date: '2026-09-17', minutes: 150, sessions: 4 },
  { day: 'Thu', date: '2026-09-18', minutes: 75, sessions: 2 },
  { day: 'Fri', date: '2026-09-19', minutes: 135, sessions: 3 },
  { day: 'Sat', date: '2026-09-20', minutes: 140, sessions: 3 },
  { day: 'Sun', date: '2026-09-21', minutes: 60, sessions: 1 },
];