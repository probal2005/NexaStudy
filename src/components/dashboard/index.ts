export { default as DashboardHeader } from './DashboardHeader';
export { default as DashboardStats } from './DashboardStats';
export { default as DashboardStatCard } from './DashboardStatCard';
export { default as QuickActions } from './QuickActions';
export { default as TodayOverview } from './TodayOverview';
export { default as TodayTasks } from './TodayTasks';
export { default as UpcomingAssignments } from './UpcomingAssignments';
export { default as UpcomingExams } from './UpcomingExams';
export { default as AttendanceOverview } from './AttendanceOverview';
export { default as StudyProgress } from './StudyProgress';
export { default as WeeklyStudyChart } from './WeeklyStudyChart';
export { default as RecentActivity } from './RecentActivity';
export { default as DashboardEmptyState } from './DashboardEmptyState';

export type {
  DashboardStatsData,
} from './DashboardStats';

export type {
  TodayEvent,
} from './TodayOverview';

export type {
  DashboardTask,
} from './TodayTasks';

export type {
  DashboardAssignment,
} from './UpcomingAssignments';

export type {
  DashboardExam,
} from './UpcomingExams';

export type {
  DashboardActivity,
  ActivityType,
} from './RecentActivity';