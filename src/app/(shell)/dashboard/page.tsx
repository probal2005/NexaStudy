'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  Flame,
  GraduationCap,
  Play,
  Plus,
  Search,
  StickyNote,
  Timer,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Header';
import { cn } from '@/utils';

type Priority = 'urgent' | 'high' | 'medium' | 'low';

type Task = {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  time: string;
  completed: boolean;
};

type Deadline = {
  id: string;
  title: string;
  date: string;
  subject: string;
  priority: Priority;
};

type Exam = {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  subject: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'exam' | 'assignment' | 'study' | 'personal' | 'reminder' | 'holiday';
};

type RecentNote = {
  id: string;
  title: string;
  updatedAt: string;
  favorite: boolean;
};

const mockData = {
  studyStreak: 7,

  todayTasks: [
    {
      id: 'task-1',
      title: 'Complete DBMS assignment',
      subject: 'CS 301',
      priority: 'high' as Priority,
      time: '2h 30m',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Review Thermodynamics notes',
      subject: 'PH 201',
      priority: 'medium' as Priority,
      time: '1h',
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Prepare presentation for Physics lab',
      subject: 'PH 201',
      priority: 'high' as Priority,
      time: '45m',
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Read Chapter 5 of Operating Systems',
      subject: 'CS 302',
      priority: 'low' as Priority,
      time: '1h 30m',
      completed: true,
    },
  ] satisfies Task[],

  upcomingDeadlines: [
    {
      id: 'deadline-1',
      title: 'DBMS Project Submission',
      date: 'Mon, Sep 22',
      subject: 'CS 301',
      priority: 'urgent' as Priority,
    },
    {
      id: 'deadline-2',
      title: 'Physics Mid-term',
      date: 'Wed, Sep 24',
      subject: 'PH 201',
      priority: 'high' as Priority,
    },
    {
      id: 'deadline-3',
      title: 'Chemistry Lab Report',
      date: 'Fri, Sep 26',
      subject: 'CH 201',
      priority: 'medium' as Priority,
    },
  ] satisfies Deadline[],

  upcomingExams: [
    {
      id: 'exam-1',
      title: 'Data Structures Final',
      date: 'Oct 15, 2026',
      daysLeft: 26,
      subject: 'CS 301',
    },
    {
      id: 'exam-2',
      title: 'Thermodynamics Mid-term',
      date: 'Sep 24, 2026',
      daysLeft: 5,
      subject: 'PH 201',
    },
    {
      id: 'exam-3',
      title: 'Calculus II Exam',
      date: 'Nov 2, 2026',
      daysLeft: 44,
      subject: 'MA 202',
    },
  ] satisfies Exam[],

  studyHours: {
    today: 3.5,
    todayTarget: 4,
    weekTarget: 15,
    weekAchieved: 10.5,
    avgDaily: 2.1,
    longestSession: '2h 15m',
  },

  libraryStats: {
    totalFiles: 48,
    pdfs: 22,
    documents: 12,
    notes: 14,
    storageUsed: 2.4,
    storageTotal: 10,
  },

  recentNotes: [
    {
      id: 'note-1',
      title: 'DBMS Indexing Techniques',
      updatedAt: '2 hours ago',
      favorite: true,
    },
    {
      id: 'note-2',
      title: 'Thermodynamics Laws Summary',
      updatedAt: '5 hours ago',
      favorite: false,
    },
    {
      id: 'note-3',
      title: 'OS Paging and Segmentation',
      updatedAt: 'Yesterday',
      favorite: false,
    },
  ] satisfies RecentNote[],

  calendarEvents: [
    {
      id: 'event-1',
      title: 'Physics Lab',
      time: '10:00 AM - 12:00 PM',
      type: 'class' as const,
    },
    {
      id: 'event-2',
      title: 'Study Group Meeting',
      time: '3:00 PM - 4:30 PM',
      type: 'study' as const,
    },
    {
      id: 'event-3',
      title: 'Maths Tutorial',
      time: 'Tomorrow, 9:00 AM',
      type: 'class' as const,
    },
  ] satisfies CalendarEvent[],

  subjectProgress: [
    { subject: 'CS 301 - DBMS', progress: 65, color: '#4F46E5' },
    { subject: 'PH 201 - Thermodynamics', progress: 80, color: '#F59E0B' },
    { subject: 'MA 202 - Calculus II', progress: 45, color: '#10B981' },
    { subject: 'CH 201 - Physical Chemistry', progress: 72, color: '#EF4444' },
  ],

  attendance: {
    total: 64,
    attended: 58,
    percentage: 90.6,
    target: 75,
  },
};

const priorityColors: Record<Priority, string> = {
  urgent: 'from-red-500 to-red-600 text-white',
  high: 'from-orange-500 to-orange-600 text-white',
  medium: 'from-yellow-500 to-yellow-600 text-white',
  low: 'from-green-500 to-green-600 text-white',
};

const eventColors: Record<CalendarEvent['type'], string> = {
  class: 'from-blue-500 to-blue-600',
  exam: 'from-red-500 to-red-600',
  assignment: 'from-amber-500 to-amber-600',
  study: 'from-emerald-500 to-emerald-600',
  personal: 'from-purple-500 to-purple-600',
  reminder: 'from-pink-500 to-pink-600',
  holiday: 'from-teal-500 to-teal-600',
};

const eventIcons: Record<CalendarEvent['type'], LucideIcon> = {
  class: GraduationCap,
  exam: AlertTriangle,
  assignment: FileText,
  study: BookOpen,
  personal: UserCheck,
  reminder: Clock,
  holiday: Calendar,
};

const formatToday = () =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockData.todayTasks);

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const taskCompletionPercentage =
    tasks.length > 0
      ? Math.round((completedTaskCount / tasks.length) * 100)
      : 0;

  const studyWeekPercentage =
    mockData.studyHours.weekTarget > 0
      ? Math.min(
          100,
          Math.round(
            (mockData.studyHours.weekAchieved / mockData.studyHours.weekTarget) *
              100,
          ),
        )
      : 0;

  const todayStudyPercentage =
    mockData.studyHours.todayTarget > 0
      ? Math.min(
          100,
          Math.round(
            (mockData.studyHours.today / mockData.studyHours.todayTarget) * 100,
          ),
        )
      : 0;

  const storagePercentage =
    mockData.libraryStats.storageTotal > 0
      ? Math.min(
          100,
          Math.round(
            (mockData.libraryStats.storageUsed /
              mockData.libraryStats.storageTotal) *
              100,
          ),
        )
      : 0;

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  };

  const statCards = [
    {
      label: 'Study Hours',
      value: `${mockData.studyHours.today}h`,
      sub: 'Today',
      icon: Timer,
      color: 'from-blue-500 to-cyan-500',
      href: '/study',
    },
    {
      label: 'Tasks Done',
      value: `${completedTaskCount}/${tasks.length}`,
      sub: `${taskCompletionPercentage}% completed`,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      href: '/tasks',
    },
    {
      label: 'Attendance',
      value: `${mockData.attendance.percentage}%`,
      sub: 'Current',
      icon: CalendarCheck,
      color: 'from-purple-500 to-violet-500',
      href: '/attendance',
    },
    {
      label: 'Library Files',
      value: String(mockData.libraryStats.totalFiles),
      sub: 'Total items',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-500',
      href: '/library',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h1 className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
              {greeting}, Ram 👋
            </h1>

            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm animate-pulse-glow">
              <Flame size={12} />
              {mockData.studyStreak}-day streak
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{formatToday()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search size={14} />
              Quick Search
            </Button>
          </Link>

          <Link href="/tasks">
            <Button size="sm" className="gap-1.5">
              <Plus size={14} />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-primary/5">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>

                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-110',
                      stat.color,
                    )}
                  >
                    <stat.icon size={16} />
                  </div>
                </div>

                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tasks + Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
                <Flag size={16} />
              </div>

              <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
            </div>

            <Link href="/tasks">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                View all
                <ChevronRight size={14} />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'group flex items-center gap-3 rounded-lg border p-3 transition-all',
                  task.completed
                    ? 'border-green-200/50 bg-green-50/30 dark:border-green-800/30 dark:bg-green-950/20'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    task.completed
                      ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                      : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5',
                  )}
                  aria-label={
                    task.completed
                      ? `Mark ${task.title} incomplete`
                      : `Mark ${task.title} complete`
                  }
                  aria-pressed={task.completed}
                >
                  {task.completed && (
                    <CheckCircle2 size={13} strokeWidth={3} />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      task.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground',
                    )}
                  >
                    {task.title}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {task.subject}
                    </span>

                    <span className="text-xs text-muted-foreground">·</span>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} />
                      {task.time}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    'shrink-0 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold capitalize',
                    priorityColors[task.priority],
                  )}
                >
                  {task.priority}
                </span>
              </div>
            ))}

            <Link href="/tasks" className="block">
              <Button variant="outline" className="mt-2 w-full gap-2" size="sm">
                <Plus size={14} />
                Add Task
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Deadlines + Calendar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                    <AlertTriangle size={16} />
                  </div>

                  <CardTitle className="text-base">
                    Upcoming Deadlines
                  </CardTitle>
                </div>

                <Link href="/tasks">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    View all
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {mockData.upcomingDeadlines.map((item) => (
                <Link
                  key={item.id}
                  href="/tasks"
                  className="group flex items-center justify-between rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-accent/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.subject}
                    </p>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        item.priority === 'urgent'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : item.priority === 'high'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
                      )}
                    >
                      {item.date}
                    </span>

                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Calendar Events */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-sm">
                    <Calendar size={16} />
                  </div>

                  <CardTitle className="text-base">
                    Today&apos;s Calendar
                  </CardTitle>
                </div>

                <Link href="/calendar">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    View
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {mockData.calendarEvents.map((event) => {
                const Icon = eventIcons[event.type];

                return (
                  <Link
                    key={event.id}
                    href="/calendar"
                    className="group flex items-center gap-3 rounded-lg border border-border p-2.5 transition-all hover:border-primary/30 hover:bg-accent/30"
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm',
                        eventColors[event.type],
                      )}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {event.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {event.time}
                      </p>
                    </div>

                    <ChevronRight
                      size={15}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exams + Subject Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-sm">
                  <Award size={16} />
                </div>

                <CardTitle className="text-base">Upcoming Exams</CardTitle>
              </div>

              <Link href="/exams">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  View all
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {mockData.upcomingExams.map((exam) => (
              <Link
                key={exam.id}
                href="/exams"
                className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-red-300/50 hover:bg-red-50/30 dark:hover:bg-red-950/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-sm">
                  <Award size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{exam.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {exam.subject}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      exam.daysLeft <= 7
                        ? 'text-red-600'
                        : exam.daysLeft <= 14
                          ? 'text-orange-600'
                          : 'text-foreground',
                    )}
                  >
                    {exam.daysLeft} days
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {exam.date}
                  </p>
                </div>

                <ChevronRight
                  size={15}
                  className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                  <TrendingUp size={16} />
                </div>

                <CardTitle className="text-base">Subject Progress</CardTitle>
              </div>

              <Link href="/subjects">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  Manage
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {mockData.subjectProgress.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex-1 truncate font-medium text-foreground">
                    {subject.subject}
                  </span>

                  <span className="ml-2 font-semibold text-muted-foreground">
                    {subject.progress}%
                  </span>
                </div>

                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, subject.progress))}%`,
                      background: `linear-gradient(90deg, ${subject.color}, ${subject.color}dd)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Study + Library */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Study Progress */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
                  <Timer size={16} />
                </div>

                <CardTitle className="text-base">
                  Weekly Study Progress
                </CardTitle>
              </div>

              <Link href="/study">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  Planner
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              {/* Circular progress */}
              <div className="relative shrink-0">
                <svg
                  className="h-24 w-24 -rotate-90"
                  viewBox="0 0 100 100"
                  aria-label={`${studyWeekPercentage}% weekly study goal completed`}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted"
                    strokeWidth="10"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#dashboardProgressGradient)"
                    strokeWidth="10"
                    strokeDasharray={`${(studyWeekPercentage / 100) * 251} 251`}
                    strokeLinecap="round"
                  />

                  <defs>
                    <linearGradient
                      id="dashboardProgressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-accent)"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {mockData.studyHours.weekAchieved}h
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    of {mockData.studyHours.weekTarget}h
                  </span>
                </div>
              </div>

              <div className="w-full flex-1 space-y-3">
                {[
                  {
                    label: 'Daily average',
                    value: `${mockData.studyHours.avgDaily}h/day`,
                  },
                  {
                    label: "Today's goal",
                    value: `${mockData.studyHours.today}h / ${mockData.studyHours.todayTarget}h`,
                  },
                  {
                    label: 'Longest session',
                    value: mockData.studyHours.longestSession,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <span className="text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}

                <ProgressBar
                  label=""
                  value={mockData.studyHours.weekAchieved}
                  max={mockData.studyHours.weekTarget}
                  showLabel
                  color="success"
                />

                <p className="text-right text-[11px] text-muted-foreground">
                  {todayStudyPercentage}% of today&apos;s study goal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Library */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                  <BookOpen size={16} />
                </div>

                <CardTitle className="text-base">Library</CardTitle>
              </div>

              <Link href="/library">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  Open
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  count: mockData.libraryStats.pdfs,
                  label: 'PDFs',
                  color: 'from-red-400 to-red-600',
                },
                {
                  count: mockData.libraryStats.documents,
                  label: 'Docs',
                  color: 'from-blue-400 to-blue-600',
                },
                {
                  count: mockData.libraryStats.notes,
                  label: 'Notes',
                  color: 'from-yellow-400 to-yellow-600',
                },
                {
                  count: mockData.libraryStats.totalFiles,
                  label: 'Total',
                  color: 'from-green-400 to-green-600',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <p
                    className={cn(
                      'bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent',
                      stat.color,
                    )}
                  >
                    {stat.count}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>

                <span className="font-medium">
                  {mockData.libraryStats.storageUsed} GB /{' '}
                  {mockData.libraryStats.storageTotal} GB
                </span>
              </div>

              <ProgressBar
                value={mockData.libraryStats.storageUsed}
                max={mockData.libraryStats.storageTotal}
                showLabel
                size="sm"
              />

              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {storagePercentage}% used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Recent Notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm">
                <Play size={16} />
              </div>

              <CardTitle className="text-base">Quick Actions</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  label: 'New Task',
                  href: '/tasks',
                  color: 'from-blue-500 to-blue-600',
                  icon: Plus,
                },
                {
                  label: 'New Note',
                  href: '/notes',
                  color: 'from-yellow-500 to-amber-500',
                  icon: StickyNote,
                },
                {
                  label: 'New Doc',
                  href: '/documents',
                  color: 'from-green-500 to-emerald-500',
                  icon: FileText,
                },
                {
                  label: 'Calendar',
                  href: '/calendar',
                  color: 'from-purple-500 to-violet-500',
                  icon: Calendar,
                },
                {
                  label: 'Pomodoro',
                  href: '/pomodoro',
                  color: 'from-red-500 to-rose-500',
                  icon: Timer,
                },
                {
                  label: 'Study',
                  href: '/study',
                  color: 'from-indigo-500 to-indigo-600',
                  icon: GraduationCap,
                },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div
                    className={cn(
                      'group flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all',
                      'hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/30 hover:shadow-md',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm transition-transform group-hover:scale-110',
                        `bg-gradient-to-br ${action.color}`,
                      )}
                    >
                      <action.icon size={18} />
                    </div>

                    <span className="text-center text-xs font-medium text-foreground">
                      {action.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-sm">
                  <StickyNote size={16} />
                </div>

                <CardTitle className="text-base">Recent Notes</CardTitle>
              </div>

              <Link href="/notes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  View all
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {mockData.recentNotes.map((note) => (
              <Link
                key={note.id}
                href="/notes"
                className={cn(
                  'group flex items-center justify-between rounded-lg border p-3 transition-all',
                  note.favorite
                    ? 'border-yellow-200/50 bg-yellow-50/30 dark:border-yellow-800/30 dark:bg-yellow-950/20'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30',
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      note.favorite
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <StickyNote size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {note.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {note.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {note.favorite && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-yellow-900">
                      ★
                    </span>
                  )}

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Attendance */}
      <Card className="border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:border-green-800/30 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
            <UserCheck size={22} />
          </div>

          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">
              Attendance:{' '}
              <span className="text-green-600">
                {mockData.attendance.percentage}%
              </span>{' '}
              — On track!
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Attended {mockData.attendance.attended} of{' '}
              {mockData.attendance.total} classes. Target:{' '}
              {mockData.attendance.target}%.
            </p>
          </div>

          <Link href="/attendance" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View Attendance
              <ChevronRight size={14} />
            </Button>
          </Link>

          <ProgressBar
            value={mockData.attendance.percentage}
            max={100}
            showLabel
            color="success"
            size="sm"
            className="w-full flex-shrink-0 sm:w-40"
          />
        </CardContent>
      </Card>
    </div>
  );
}