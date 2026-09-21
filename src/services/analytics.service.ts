import { getDashboardSummary } from './dashboard.service';

export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  totalAssignments: number;
  totalStudyMinutes: number;
  attendanceRecords: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const {
    tasks,
    assignments,
    studySessions,
    attendance,
  } = await getDashboardSummary();

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed',
  ).length;

  const totalStudyMinutes = studySessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  const taskCompletionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return {
    totalTasks: tasks.length,
    completedTasks,
    taskCompletionRate,
    totalAssignments: assignments.length,
    totalStudyMinutes,
    attendanceRecords: attendance.length,
  };
}