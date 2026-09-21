export interface AnalyticsDailyData {
  day: string;
  date: string;
  studyMinutes: number;
  tasksCompleted: number;
  tasksCreated: number;
  sessions: number;
}

export interface SubjectPerformanceData {
  subjectId: string;
  studyHours: number;
  taskCompletionRate: number;
  attendance: number;
  gradePoint: number;
}

export interface AnalyticsData {
  totalStudyMinutes: number;
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  averageStudyMinutes: number;
  dailyActivity: AnalyticsDailyData[];
  subjectPerformance: SubjectPerformanceData[];
}

export const analytics: AnalyticsData = {
  totalStudyMinutes: 770,
  totalTasks: 18,
  completedTasks: 13,
  currentStreak: 6,
  longestStreak: 12,
  averageStudyMinutes: 110,
  dailyActivity: [
    {
      day: 'Mon',
      date: '2026-09-15',
      studyMinutes: 120,
      tasksCompleted: 2,
      tasksCreated: 3,
      sessions: 3,
    },
    {
      day: 'Tue',
      date: '2026-09-16',
      studyMinutes: 90,
      tasksCompleted: 2,
      tasksCreated: 2,
      sessions: 2,
    },
    {
      day: 'Wed',
      date: '2026-09-17',
      studyMinutes: 150,
      tasksCompleted: 3,
      tasksCreated: 4,
      sessions: 4,
    },
    {
      day: 'Thu',
      date: '2026-09-18',
      studyMinutes: 75,
      tasksCompleted: 1,
      tasksCreated: 2,
      sessions: 2,
    },
    {
      day: 'Fri',
      date: '2026-09-19',
      studyMinutes: 135,
      tasksCompleted: 3,
      tasksCreated: 3,
      sessions: 3,
    },
    {
      day: 'Sat',
      date: '2026-09-20',
      studyMinutes: 140,
      tasksCompleted: 2,
      tasksCreated: 2,
      sessions: 3,
    },
    {
      day: 'Sun',
      date: '2026-09-21',
      studyMinutes: 60,
      tasksCompleted: 0,
      tasksCreated: 2,
      sessions: 1,
    },
  ],
  subjectPerformance: [
    {
      subjectId: 'sub-001',
      studyHours: 13,
      taskCompletionRate: 82,
      attendance: 86,
      gradePoint: 9,
    },
    {
      subjectId: 'sub-002',
      studyHours: 9,
      taskCompletionRate: 76,
      attendance: 82,
      gradePoint: 9,
    },
    {
      subjectId: 'sub-003',
      studyHours: 11,
      taskCompletionRate: 91,
      attendance: 91,
      gradePoint: 10,
    },
    {
      subjectId: 'sub-004',
      studyHours: 7,
      taskCompletionRate: 68,
      attendance: 78,
      gradePoint: 8,
    },
    {
      subjectId: 'sub-005',
      studyHours: 8,
      taskCompletionRate: 88,
      attendance: 88,
      gradePoint: 9,
    },
  ],
};