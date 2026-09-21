'use client';

import {
  Award,
  BarChart2,
  CheckCircle2,
  Clock,
  Flame,
  XCircle,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { InfoCard, ProgressBar } from '@/components/ui/Header';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface WeeklyData {
  day: string;
  hours: number;
  tasks: number;
}

interface MonthlyData {
  month: string;
  hours: number;
  tasks: number;
}

interface SubjectDistribution {
  subject: string;
  hours: number;
  color: string;
}

interface TaskStatusData {
  status: string;
  count: number;
  color: string;
}

/* -------------------------------------------------------------------------- */
/* Mock Analytics Data                                                        */
/* -------------------------------------------------------------------------- */

const weeklyData: WeeklyData[] = [
  { day: 'Mon', hours: 2.5, tasks: 3 },
  { day: 'Tue', hours: 3.0, tasks: 4 },
  { day: 'Wed', hours: 1.5, tasks: 2 },
  { day: 'Thu', hours: 4.0, tasks: 5 },
  { day: 'Fri', hours: 2.0, tasks: 1 },
  { day: 'Sat', hours: 5.5, tasks: 3 },
  { day: 'Sun', hours: 1.5, tasks: 0 },
];

const monthlyData: MonthlyData[] = [
  { month: 'Jul', hours: 28, tasks: 35 },
  { month: 'Aug', hours: 32, tasks: 42 },
  { month: 'Sep', hours: 22, tasks: 28 },
];

const subjectDistribution: SubjectDistribution[] = [
  { subject: 'DBMS', hours: 18, color: '#4F46E5' },
  { subject: 'Physics', hours: 12, color: '#F59E0B' },
  { subject: 'Calculus', hours: 8, color: '#10B981' },
  { subject: 'Chemistry', hours: 6, color: '#EF4444' },
  { subject: 'Economics', hours: 4, color: '#EC4899' },
];

const taskStatusData: TaskStatusData[] = [
  { status: 'Completed', count: 48, color: '#10B981' },
  { status: 'In Progress', count: 12, color: '#3B82F6' },
  { status: 'Overdue', count: 3, color: '#EF4444' },
  { status: 'Pending', count: 8, color: '#F59E0B' },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const totalStudyHours = weeklyData.reduce(
    (total, day) => total + day.hours,
    0,
  );

  const totalWeeklyTasks = weeklyData.reduce(
    (total, day) => total + day.tasks,
    0,
  );

  const completedTasks =
    taskStatusData.find((item) => item.status === 'Completed')?.count ?? 0;

  const inProgressTasks =
    taskStatusData.find((item) => item.status === 'In Progress')?.count ?? 0;

  const overdueTasks =
    taskStatusData.find((item) => item.status === 'Overdue')?.count ?? 0;

  const pendingTasks =
    taskStatusData.find((item) => item.status === 'Pending')?.count ?? 0;

  const trackedTasks =
    completedTasks + inProgressTasks + overdueTasks + pendingTasks;

  const taskCompletionRate =
    trackedTasks > 0
      ? Math.round((completedTasks / trackedTasks) * 100)
      : 0;

  const weeklyTaskCompletionRate =
    totalWeeklyTasks > 0
      ? Math.round(
          (Math.min(completedTasks, totalWeeklyTasks) / totalWeeklyTasks) * 100,
        )
      : 0;

  const currentStreak = 7;

  const totalSubjectHours = subjectDistribution.reduce(
    (total, subject) => total + subject.hours,
    0,
  );

  return (
    <div className="flex h-full flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Analytics
          </h1>

          <p className="text-sm text-muted-foreground">
            Your study productivity insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm"
          >
            <Flame
              size={12}
              className="mr-1"
              aria-hidden="true"
            />
            {currentStreak} day streak
          </Badge>

          <Badge
            variant="success"
            className="px-3 py-1 text-sm"
          >
            <Award
              size={12}
              className="mr-1"
              aria-hidden="true"
            />
            All-time high
          </Badge>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Top Statistics                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-4 pb-6 lg:grid-cols-4">
        <InfoCard
          title="Study Hours This Week"
          value={`${totalStudyHours.toFixed(1)}h`}
          icon={<Clock size={14} />}
          trend="+8% vs last week"
        />

        <InfoCard
          title="Tasks Completed"
          value={`${completedTasks}`}
          icon={<CheckCircle2 size={14} />}
          trend="+5 this week"
        />

        <InfoCard
          title="Overdue Tasks"
          value={`${overdueTasks}`}
          icon={<XCircle size={14} />}
          trend="-2 vs last week"
        />

        <InfoCard
          title="Task Completion Rate"
          value={`${taskCompletionRate}%`}
          icon={<CheckCircle2 size={14} />}
          trend={`${weeklyTaskCompletionRate}% weekly activity`}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Charts                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Study Hours */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Weekly Study Hours
              </CardTitle>

              <Badge variant="outline">
                This week
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/50"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <YAxis
                    stroke="currentColor"
                    className="text-xs"
                    unit="h"
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.2}
                    name="Study Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Study by Subject */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Study by Subject
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-1/3">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="hours"
                      nameKey="subject"
                    >
                      {subjectDistribution.map((entry) => (
                        <Cell
                          key={entry.subject}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-2/3 space-y-2">
                {subjectDistribution.map((subject) => (
                  <div
                    key={subject.subject}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: subject.color,
                        }}
                      />

                      <span className="truncate text-sm">
                        {subject.subject}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <ProgressBar
                        value={subject.hours}
                        max={totalSubjectHours}
                        size="sm"
                        className="w-20"
                      />

                      <span className="w-10 text-right text-sm font-semibold">
                        {subject.hours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Task Status Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-1/3">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="status"
                    >
                      {taskStatusData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-2/3 space-y-2">
                {taskStatusData.map((status) => (
                  <div
                    key={status.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: status.color,
                        }}
                      />

                      <span className="text-sm">
                        {status.status}
                      </span>
                    </div>

                    <span className="text-sm font-semibold">
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Productivity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Monthly Productivity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/50"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <YAxis
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="hours"
                    fill="var(--color-primary)"
                    name="Study Hours"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="tasks"
                    fill="var(--color-success)"
                    name="Tasks"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Study Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Daily Study Trend
              </CardTitle>

              <Badge variant="outline">
                This week
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/50"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <YAxis
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{
                      fill: 'var(--color-primary)',
                      strokeWidth: 2,
                    }}
                    name="Study Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Daily Tasks
              </CardTitle>

              <Badge variant="outline">
                This week
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/50"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <YAxis
                    stroke="currentColor"
                    className="text-xs"
                  />

                  <Tooltip
                    contentStyle={{
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />

                  <Bar
                    dataKey="tasks"
                    fill="var(--color-success)"
                    name="Tasks"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Productivity Insight                                               */}
      {/* ------------------------------------------------------------------ */}

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BarChart2
              size={20}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-medium">
              Productivity Tip
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Your best study days are Thursday and Saturday. Consider
              scheduling challenging subjects on these days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}