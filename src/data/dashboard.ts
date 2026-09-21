import { assignments } from './assignments';
import { attendanceRecords } from './attendance';
import { exams } from './exams';
import { studySessions } from './study';
import { subjects } from './subjects';
import { tasks } from './tasks';

export const dashboardStats = {
  totalSubjects: subjects.length,

  activeTasks: tasks.filter(
    (task) =>
      task.status !== 'completed' && task.status !== 'cancelled',
  ).length,

  pendingAssignments: assignments.filter(
    (assignment) =>
      assignment.status !== 'submitted' &&
      assignment.status !== 'graded',
  ).length,

  upcomingExams: exams.filter(
    (exam) => exam.status === 'upcoming',
  ).length,

  averageAttendance:
    subjects.reduce((sum, subject) => sum + subject.attendance, 0) /
    Math.max(subjects.length, 1),

  totalStudyMinutes: studySessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0,
  ),
};

export const dashboardTodayTasks = tasks.filter(
  (task) => task.status !== 'completed' && task.status !== 'cancelled',
);

export const dashboardUpcomingAssignments = assignments
  .filter(
    (assignment) =>
      assignment.status !== 'submitted' &&
      assignment.status !== 'graded',
  )
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

export const dashboardUpcomingExams = exams
  .filter((exam) => exam.status === 'upcoming')
  .sort((a, b) => a.date.localeCompare(b.date));