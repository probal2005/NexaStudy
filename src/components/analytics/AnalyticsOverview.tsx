'use client';

import {
  BookOpen,
  CheckCircle2,
  Clock3,
  ListTodo,
} from 'lucide-react';

import { StatCard } from './StatCard';
import { WeeklyActivityChart } from './WeeklyActivityChart';
import { TaskCompletionChart } from './TaskCompletionChart';
import { SubjectPerformance } from './SubjectPerformance';
import { StudyTimeChart } from './StudyTimeChart';
import { StreakCard } from './StreakCard';

export interface AnalyticsOverviewData {
  totalStudyHours: number;
  studyHoursChange: string;
  completedTasks: number;
  completedTasksChange: string;
  averageAttendance: number;
  attendanceChange: string;
  subjectsTracked: number;

  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;

  weeklyActivity: {
    day: string;
    studyHours: number;
    tasksCompleted: number;
  }[];

  taskCompletion: {
    completed: number;
    pending: number;
    overdue: number;
  };

  subjectPerformance: {
    id: string;
    name: string;
    score: number;
  }[];

  studyTime: {
    label: string;
    minutes: number;
  }[];
}

interface AnalyticsOverviewProps {
  data: AnalyticsOverviewData;
}

export function AnalyticsOverview({
  data,
}: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Study Hours"
          value={`${data.totalStudyHours}h`}
          description="Total focused study time"
          icon={Clock3}
          trend="up"
          trendValue={data.studyHoursChange}
        />

        <StatCard
          title="Tasks Completed"
          value={String(data.completedTasks)}
          description="Completed tasks"
          icon={CheckCircle2}
          trend="up"
          trendValue={data.completedTasksChange}
        />

        <StatCard
          title="Attendance"
          value={`${data.averageAttendance}%`}
          description="Average attendance"
          icon={BookOpen}
          trend="up"
          trendValue={data.attendanceChange}
        />

        <StatCard
          title="Subjects"
          value={String(data.subjectsTracked)}
          description="Subjects being tracked"
          icon={ListTodo}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <WeeklyActivityChart data={data.weeklyActivity} />
        <TaskCompletionChart {...data.taskCompletion} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <StudyTimeChart data={data.studyTime} />
        <StreakCard
          currentStreak={data.currentStreak}
          longestStreak={data.longestStreak}
          weeklyGoal={data.weeklyGoal}
          weeklyProgress={data.weeklyProgress}
        />
      </div>

      <SubjectPerformance
        subjects={data.subjectPerformance}
      />
    </div>
  );
}