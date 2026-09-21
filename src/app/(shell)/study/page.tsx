'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Dialog,
  EmptyState,
  ProgressBar,
  InfoCard,
  Menu,
  MenuTrigger,
  MenuItem,
} from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Archive,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Target,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';

type SessionType = 'study' | 'revision' | 'assignment';
type GoalStatus = 'active' | 'completed' | 'overdue';

interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  achievedHours: number;
  subjectId: string | null;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
}

interface StudySession {
  id: string;
  subjectId: string | null;
  startTime: string;
  endTime: string | null;
  duration: number;
  type: SessionType;
  notes: string;
  completed: boolean;
  createdAt: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

const GOALS_STORAGE_KEY = 'nexastudy_study_goals_v1';
const SESSIONS_STORAGE_KEY = 'nexastudy_study_sessions_v1';

const subjects: Subject[] = [
  { id: 's1', name: 'DBMS', color: '#4F46E5' },
  { id: 's2', name: 'Thermodynamics', color: '#F59E0B' },
  { id: 's3', name: 'Calculus II', color: '#10B981' },
  { id: 's4', name: 'Physical Chemistry', color: '#EF4444' },
  { id: 's5', name: 'Economics', color: '#EC4899' },
];

const seedGoals: StudyGoal[] = [
  {
    id: 'goal-1',
    title: 'Complete DBMS Course',
    targetHours: 20,
    achievedHours: 12,
    subjectId: 's1',
    deadline: '2026-10-15',
    status: 'active',
    createdAt: '2026-09-01T00:00:00',
  },
  {
    id: 'goal-2',
    title: 'Master Thermodynamics',
    targetHours: 15,
    achievedHours: 8,
    subjectId: 's2',
    deadline: '2026-10-01',
    status: 'active',
    createdAt: '2026-09-01T00:00:00',
  },
  {
    id: 'goal-3',
    title: 'Calculus Problem Practice',
    targetHours: 10,
    achievedHours: 4,
    subjectId: 's3',
    deadline: '2026-09-30',
    status: 'active',
    createdAt: '2026-09-01T00:00:00',
  },
  {
    id: 'goal-4',
    title: 'Chemistry Review',
    targetHours: 8,
    achievedHours: 8,
    subjectId: 's4',
    deadline: '2026-09-15',
    status: 'completed',
    createdAt: '2026-08-01T00:00:00',
  },
];

const seedSessions: StudySession[] = [
  {
    id: 'session-1',
    subjectId: 's1',
    startTime: '2026-09-20T08:00:00',
    endTime: '2026-09-20T09:30:00',
    duration: 90,
    type: 'study',
    notes: 'DBMS normalization practice',
    completed: true,
    createdAt: '2026-09-20T08:00:00',
  },
  {
    id: 'session-2',
    subjectId: 's2',
    startTime: '2026-09-19T10:00:00',
    endTime: '2026-09-19T11:15:00',
    duration: 75,
    type: 'revision',
    notes: 'Thermodynamics revision',
    completed: true,
    createdAt: '2026-09-19T10:00:00',
  },
  {
    id: 'session-3',
    subjectId: 's3',
    startTime: '2026-09-18T15:00:00',
    endTime: '2026-09-18T16:30:00',
    duration: 90,
    type: 'assignment',
    notes: 'Calculus problem solving',
    completed: true,
    createdAt: '2026-09-18T15:00:00',
  },
  {
    id: 'session-4',
    subjectId: 's1',
    startTime: '2026-09-17T09:00:00',
    endTime: '2026-09-17T10:00:00',
    duration: 60,
    type: 'study',
    notes: 'SQL queries',
    completed: true,
    createdAt: '2026-09-17T09:00:00',
  },
  {
    id: 'session-5',
    subjectId: 's4',
    startTime: '2026-09-16T17:00:00',
    endTime: '2026-09-16T18:00:00',
    duration: 60,
    type: 'revision',
    notes: 'Chemistry revision',
    completed: true,
    createdAt: '2026-09-16T17:00:00',
  },
];

function createId(prefix: string) {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return parsed as T;
  } catch {
    return fallback;
  }
}

function formatHours(hours: number) {
  return `${hours.toFixed(1)}h`;
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return 'No deadline';
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatSessionDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStartOfWeek(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);

  return result;
}

function getWeekDayLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getSessionDateKey(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return getDateKey(date);
}

export default function StudyPlannerPage() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [mounted, setMounted] = useState(false);

  const [selectedTab, setSelectedTab] = useState<
    'goals' | 'sessions' | 'weekly'
  >('goals');

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(
    null,
  );

  const [showAddSession, setShowAddSession] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetHours: 5,
    subjectId: '',
    deadline: '',
  });

  const [newSession, setNewSession] = useState({
    subjectId: '',
    duration: 60,
    type: 'study' as SessionType,
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    setGoals(loadFromStorage(GOALS_STORAGE_KEY, seedGoals));
    setSessions(
      loadFromStorage(SESSIONS_STORAGE_KEY, seedSessions),
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(
      GOALS_STORAGE_KEY,
      JSON.stringify(goals),
    );
  }, [goals, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(
      SESSIONS_STORAGE_KEY,
      JSON.stringify(sessions),
    );
  }, [sessions, mounted]);

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === 'active'),
    [goals],
  );

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === 'completed'),
    [goals],
  );

  const overdueGoals = useMemo(
    () => goals.filter((goal) => goal.status === 'overdue'),
    [goals],
  );

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      ),
    [sessions],
  );

  const totalSessionHours = useMemo(
    () =>
      sessions
        .filter((session) => session.completed)
        .reduce(
          (total, session) => total + session.duration / 60,
          0,
        ),
    [sessions],
  );

  const weeklyData = useMemo(() => {
    const start = getStartOfWeek();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dateKey = getDateKey(date);

      const hours = sessions
        .filter(
          (session) =>
            session.completed &&
            getSessionDateKey(session.startTime) === dateKey,
        )
        .reduce(
          (total, session) => total + session.duration / 60,
          0,
        );

      return {
        date,
        day: getWeekDayLabel(date),
        hours,
      };
    });
  }, [sessions]);

  const totalWeeklyHours = useMemo(
    () =>
      weeklyData.reduce(
        (total, item) => total + item.hours,
        0,
      ),
    [weeklyData],
  );

  const averageDailyHours = totalWeeklyHours / 7;

  const nextDeadline = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...activeGoals]
      .filter((goal) => goal.deadline)
      .sort(
        (a, b) =>
          new Date(`${a.deadline}T00:00:00`).getTime() -
          new Date(`${b.deadline}T00:00:00`).getTime(),
      )[0];
  }, [activeGoals]);

  const examCountdown = 5;

  const updateGoalStatus = (
    goal: StudyGoal,
  ): GoalStatus => {
    if (goal.achievedHours >= goal.targetHours) {
      return 'completed';
    }

    if (goal.deadline) {
      const deadline = new Date(`${goal.deadline}T23:59:59`);
      if (deadline.getTime() < Date.now()) {
        return 'overdue';
      }
    }

    return 'active';
  };

  const handleAddGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newGoal.title.trim();

    if (!title) {
      return;
    }

    const targetHours = Number(newGoal.targetHours);

    if (!Number.isFinite(targetHours) || targetHours <= 0) {
      return;
    }

    const now = new Date().toISOString();

    const goal: StudyGoal = {
      id: createId('goal'),
      title,
      targetHours,
      achievedHours: 0,
      subjectId: newGoal.subjectId || null,
      deadline: newGoal.deadline || null,
      status: 'active',
      createdAt: now,
    };

    setGoals((current) => [goal, ...current]);

    setNewGoal({
      title: '',
      targetHours: 5,
      subjectId: '',
      deadline: '',
    });

    setShowAddGoal(false);
  };

  const openEditGoal = (goal: StudyGoal) => {
    setEditingGoal({ ...goal });
  };

  const handleSaveGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingGoal || !editingGoal.title.trim()) {
      return;
    }

    const targetHours = Number(editingGoal.targetHours);

    if (!Number.isFinite(targetHours) || targetHours <= 0) {
      return;
    }

    const updatedGoal: StudyGoal = {
      ...editingGoal,
      title: editingGoal.title.trim(),
      targetHours,
      achievedHours: Math.max(
        0,
        Number(editingGoal.achievedHours) || 0,
      ),
      status: updateGoalStatus({
        ...editingGoal,
        targetHours,
      }),
    };

    setGoals((current) =>
      current.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal,
      ),
    );

    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    const goal = goals.find((item) => item.id === id);

    if (!goal) {
      return;
    }

    if (
      !window.confirm(
        `Delete the study goal "${goal.title}"?`,
      )
    ) {
      return;
    }

    setGoals((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const handleArchiveGoal = (id: string) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status:
                goal.status === 'completed'
                  ? 'completed'
                  : 'overdue',
            }
          : goal,
      ),
    );
  };

  const handleRestoreGoal = (id: string) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status: updateGoalStatus(goal),
            }
          : goal,
      ),
    );
  };

  const handleAddSession = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const duration = Number(newSession.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const startTime = new Date(
      `${newSession.date}T09:00:00`,
    );

    const endTime = new Date(
      startTime.getTime() + duration * 60 * 1000,
    );

    const session: StudySession = {
      id: createId('session'),
      subjectId: newSession.subjectId || null,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      type: newSession.type,
      notes: newSession.notes.trim(),
      completed: true,
      createdAt: new Date().toISOString(),
    };

    setSessions((current) => [session, ...current]);

    if (newSession.subjectId) {
      setGoals((current) =>
        current.map((goal) => {
          if (goal.subjectId !== newSession.subjectId) {
            return goal;
          }

          const achievedHours =
            goal.achievedHours + duration / 60;

          return {
            ...goal,
            achievedHours,
            status: updateGoalStatus({
              ...goal,
              achievedHours,
            }),
          };
        }),
      );
    }

    setNewSession({
      subjectId: '',
      duration: 60,
      type: 'study',
      notes: '',
      date: new Date().toISOString().slice(0, 10),
    });

    setShowAddSession(false);
  };

  const handleDeleteSession = (id: string) => {
    const session = sessions.find((item) => item.id === id);

    if (!session) {
      return;
    }

    if (!window.confirm('Delete this study session?')) {
      return;
    }

    setSessions((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const handleToggleSession = (id: string) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              completed: !session.completed,
            }
          : session,
      ),
    );
  };

  const resetDemoData = () => {
    if (
      !window.confirm(
        'Reset Study Planner data to the default demo data?',
      )
    ) {
      return;
    }

    setGoals(seedGoals);
    setSessions(seedSessions);
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Study Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your study workspace...
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading study data...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Study Planner
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Set goals, record study sessions, and track your weekly
            progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={
              selectedTab === 'goals' ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => setSelectedTab('goals')}
          >
            <Target size={14} className="mr-1.5" />
            Goals
          </Button>

          <Button
            variant={
              selectedTab === 'sessions' ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => setSelectedTab('sessions')}
          >
            <Clock size={14} className="mr-1.5" />
            Sessions
          </Button>

          <Button
            variant={
              selectedTab === 'weekly' ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => setSelectedTab('weekly')}
          >
            <TrendingUp size={14} className="mr-1.5" />
            Weekly
          </Button>

          <Button
            onClick={() => setShowAddGoal(true)}
            size="sm"
          >
            <Plus size={14} className="mr-1.5" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Study Hours"
          icon={<Clock size={14} />}
          value={formatHours(totalWeeklyHours)}
          trend="+12%"
        />

        <InfoCard
          title="Sessions Completed"
          icon={<CheckCircle2 size={14} />}
          description={`${sessions.filter((s) => s.completed).length} total`}
        />

        <InfoCard
          title="Active Goals"
          icon={<Target size={14} />}
          description={`${activeGoals.length} active`}
        />

        <InfoCard
          title="Next Exam"
          icon={<Award size={14} />}
          description={`${examCountdown} days · Physics Mid-term`}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Keep your study momentum going
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {nextDeadline
              ? `Next goal deadline: ${nextDeadline.title} · ${formatDate(nextDeadline.deadline)}`
              : 'Create a goal to start planning your study time.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddSession(true)}
          >
            <Plus size={14} className="mr-1.5" />
            Log Session
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedTab('weekly')}
          >
            <TrendingUp size={14} className="mr-1.5" />
            View Progress
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Goals */}
        {selectedTab === 'goals' && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    Study Goals
                  </CardTitle>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeGoals.length} active ·{' '}
                    {completedGoals.length} completed
                    {overdueGoals.length > 0 &&
                      ` · ${overdueGoals.length} overdue`}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setShowAddGoal(true)}
                >
                  <Plus size={14} className="mr-1.5" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {goals.length === 0 ? (
                <EmptyState
                  icon={<Target size={24} />}
                  title="No study goals"
                  description="Create a goal to start tracking your progress."
                  action={{
                    label: 'New Goal',
                    onClick: () => setShowAddGoal(true),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {goals.map((goal) => {
                    const subject = subjects.find(
                      (item) => item.id === goal.subjectId,
                    );

                    const progress =
                      goal.targetHours > 0
                        ? Math.min(
                            (goal.achievedHours /
                              goal.targetHours) *
                              100,
                            100,
                          )
                        : 0;

                    const status = updateGoalStatus(goal);

                    return (
                      <div
                        key={goal.id}
                        className="rounded-xl border border-border bg-card p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            {subject ? (
                              <div
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                                style={{
                                  backgroundColor:
                                    subject.color,
                                }}
                              >
                                {subject.name.charAt(0)}
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <BookOpen size={18} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-foreground">
                                {goal.title}
                              </h3>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {subject?.name || 'General study'}
                                {' · '}
                                Target:{' '}
                                {formatHours(goal.targetHours)}
                                {' · '}
                                {goal.deadline
                                  ? formatDate(
                                      goal.deadline,
                                    )
                                  : 'No deadline'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                status === 'completed' &&
                                  'bg-green-100 text-green-700',
                                status === 'overdue' &&
                                  'bg-red-100 text-red-700',
                                status === 'active' &&
                                  'bg-blue-100 text-blue-700',
                              )}
                            >
                              {status}
                            </Badge>

                            <Menu>
                              <MenuTrigger>
                                <button
                                  type="button"
                                  className="rounded-md p-1.5 hover:bg-muted"
                                  aria-label="Goal actions"
                                >
                                  <MoreHorizontal
                                    size={15}
                                    className="text-muted-foreground"
                                  />
                                </button>
                              </MenuTrigger>

                              <MenuItem
                                onClick={() =>
                                  openEditGoal(goal)
                                }
                                icon={<Edit3 size={12} />}
                              >
                                Edit
                              </MenuItem>

                              {status === 'overdue' && (
                                <MenuItem
                                  onClick={() =>
                                    handleRestoreGoal(
                                      goal.id,
                                    )
                                  }
                                  icon={
                                    <RotateCcw size={12} />
                                  }
                                >
                                  Restore Status
                                </MenuItem>
                              )}

                              <MenuItem
                                onClick={() =>
                                  handleDeleteGoal(goal.id)
                                }
                                icon={<Trash2 size={12} />}
                                danger
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>

                            <span className="font-medium">
                              {formatHours(
                                goal.achievedHours,
                              )}{' '}
                              /{' '}
                              {formatHours(goal.targetHours)}
                            </span>
                          </div>

                          <ProgressBar
                            value={Math.min(
                              goal.achievedHours,
                              goal.targetHours,
                            )}
                            max={Math.max(
                              goal.targetHours,
                              1,
                            )}
                            showLabel
                            color="success"
                          />

                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {progress.toFixed(0)}% complete
                            </span>

                            <span>
                              {formatHours(
                                Math.max(
                                  goal.targetHours -
                                    goal.achievedHours,
                                  0,
                                ),
                              )}{' '}
                              remaining
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions */}
        {selectedTab === 'sessions' && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    Study Session History
                  </CardTitle>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatHours(totalSessionHours)} total completed
                    study time
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setShowAddSession(true)}
                >
                  <Plus size={14} className="mr-1.5" />
                  Log Session
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {sortedSessions.length === 0 ? (
                <EmptyState
                  icon={<Clock size={24} />}
                  title="No study sessions"
                  description="Log your first study session to start building your history."
                  action={{
                    label: 'Log Session',
                    onClick: () => setShowAddSession(true),
                  }}
                />
              ) : (
                <div className="space-y-2">
                  {sortedSessions.map((session) => {
                    const subject = subjects.find(
                      (item) =>
                        item.id === session.subjectId,
                    );

                    return (
                      <div
                        key={session.id}
                        className="flex flex-col gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 sm:flex-row sm:items-center"
                      >
                        <div
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{
                            backgroundColor:
                              subject?.color || '#6B7280',
                          }}
                        >
                          {subject?.name.charAt(0) || 'S'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {session.notes ||
                              subject?.name ||
                              'Study Session'}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatSessionDate(
                              session.startTime,
                            )}
                            {' · '}
                            {formatHours(
                              session.duration / 60,
                            )}
                            {subject
                              ? ` · ${subject.name}`
                              : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              session.type === 'study' &&
                                'bg-green-100 text-green-700',
                              session.type === 'revision' &&
                                'bg-purple-100 text-purple-700',
                              session.type === 'assignment' &&
                                'bg-orange-100 text-orange-700',
                            )}
                          >
                            {session.type}
                          </Badge>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleSession(
                                session.id,
                              )
                            }
                            className="rounded-md p-1.5 hover:bg-muted"
                            aria-label={
                              session.completed
                                ? 'Mark incomplete'
                                : 'Mark completed'
                            }
                          >
                            {session.completed ? (
                              <CheckCircle2
                                size={17}
                                className="text-green-500"
                              />
                            ) : (
                              <Clock
                                size={17}
                                className="text-muted-foreground"
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSession(
                                session.id,
                              )
                            }
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete session"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weekly */}
        {selectedTab === 'weekly' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                This Week&apos;s Study Progress
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Weekly values are calculated from completed study
                sessions.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {weeklyData.map((day) => (
                  <div
                    key={getDateKey(day.date)}
                    className="rounded-xl border border-border bg-card p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground">
                      {day.day}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-primary">
                      {day.hours.toFixed(1)}h
                    </p>

                    <div className="mt-3">
                      <ProgressBar
                        value={Math.min(day.hours, 6)}
                        max={6}
                        size="sm"
                        className="h-1.5"
                      />
                    </div>

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {new Intl.DateTimeFormat('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      }).format(day.date)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Total this week
                  </p>

                  <p className="mt-1 text-2xl font-bold text-primary">
                    {formatHours(totalWeeklyHours)}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Daily average
                  </p>

                  <p className="mt-1 text-2xl font-bold text-primary">
                    {formatHours(averageDailyHours)}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Weekly target
                  </p>

                  <p className="mt-1 text-2xl font-bold text-primary">
                    {Math.min(
                      Math.round(
                        (totalWeeklyHours / 20) * 100,
                      ),
                      100,
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Weekly target: 20h
                  </span>

                  <span className="text-sm font-medium">
                    {formatHours(totalWeeklyHours)} / 20.0h
                  </span>
                </div>

                <ProgressBar
                  value={Math.min(totalWeeklyHours, 20)}
                  max={20}
                  showLabel
                  color="success"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog
        open={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        title="New Study Goal"
      >
        <form
          onSubmit={handleAddGoal}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Goal title
            </label>

            <Input
              autoFocus
              placeholder="e.g. Complete DBMS revision"
              value={newGoal.title}
              onChange={(event) =>
                setNewGoal((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />

            {!newGoal.title.trim() && (
              <p className="mt-1 text-xs text-muted-foreground">
                Title is required.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Target hours
              </label>

              <Input
                type="number"
                min={0.5}
                max={100}
                step={0.5}
                value={newGoal.targetHours}
                onChange={(event) =>
                  setNewGoal((current) => ({
                    ...current,
                    targetHours:
                      Number(event.target.value) || 0,
                  }))
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Deadline
              </label>

              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(event) =>
                  setNewGoal((current) => ({
                    ...current,
                    deadline: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Subject
            </label>

            <select
              value={newGoal.subjectId}
              onChange={(event) =>
                setNewGoal((current) => ({
                  ...current,
                  subjectId: event.target.value,
                }))
              }
              className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">General study</option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddGoal(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !newGoal.title.trim() ||
                Number(newGoal.targetHours) <= 0
              }
            >
              <Plus size={14} className="mr-1.5" />
              Add Goal
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <Dialog
          open
          onClose={() => setEditingGoal(null)}
          title="Edit Study Goal"
        >
          <form
            onSubmit={handleSaveGoal}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Goal title
              </label>

              <Input
                autoFocus
                value={editingGoal.title}
                onChange={(event) =>
                  setEditingGoal((current) =>
                    current
                      ? {
                          ...current,
                          title: event.target.value,
                        }
                      : null,
                  )
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Target hours
                </label>

                <Input
                  type="number"
                  min={0.5}
                  max={100}
                  step={0.5}
                  value={editingGoal.targetHours}
                  onChange={(event) =>
                    setEditingGoal((current) =>
                      current
                        ? {
                            ...current,
                            targetHours:
                              Number(
                                event.target.value,
                              ) || 0,
                          }
                        : null,
                    )
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Achieved hours
                </label>

                <Input
                  type="number"
                  min={0}
                  max={1000}
                  step={0.5}
                  value={editingGoal.achievedHours}
                  onChange={(event) =>
                    setEditingGoal((current) =>
                      current
                        ? {
                            ...current,
                            achievedHours:
                              Number(
                                event.target.value,
                              ) || 0,
                          }
                        : null,
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Deadline
              </label>

              <Input
                type="date"
                value={editingGoal.deadline || ''}
                onChange={(event) =>
                  setEditingGoal((current) =>
                    current
                      ? {
                          ...current,
                          deadline:
                            event.target.value || null,
                        }
                      : null,
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Subject
              </label>

              <select
                value={editingGoal.subjectId || ''}
                onChange={(event) =>
                  setEditingGoal((current) =>
                    current
                      ? {
                          ...current,
                          subjectId:
                            event.target.value || null,
                        }
                      : null,
                  )
                }
                className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">General study</option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingGoal(null)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !editingGoal.title.trim() ||
                  Number(editingGoal.targetHours) <= 0
                }
              >
                <Save size={14} className="mr-1.5" />
                Save Changes
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Add Session Dialog */}
      <Dialog
        open={showAddSession}
        onClose={() => setShowAddSession(false)}
        title="Log Study Session"
      >
        <form
          onSubmit={handleAddSession}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Date
              </label>

              <Input
                type="date"
                value={newSession.date}
                onChange={(event) =>
                  setNewSession((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Duration (minutes)
              </label>

              <Input
                type="number"
                min={1}
                max={1440}
                value={newSession.duration}
                onChange={(event) =>
                  setNewSession((current) => ({
                    ...current,
                    duration:
                      Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Subject
            </label>

            <select
              value={newSession.subjectId}
              onChange={(event) =>
                setNewSession((current) => ({
                  ...current,
                  subjectId: event.target.value,
                }))
              }
              className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">General study</option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Session type
            </label>

            <select
              value={newSession.type}
              onChange={(event) =>
                setNewSession((current) => ({
                  ...current,
                  type: event.target
                    .value as SessionType,
                }))
              }
              className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="study">Study</option>
              <option value="revision">Revision</option>
              <option value="assignment">
                Assignment
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Notes
            </label>

            <textarea
              value={newSession.notes}
              onChange={(event) =>
                setNewSession((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="What did you study?"
              className="h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddSession(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                Number(newSession.duration) <= 0
              }
            >
              <Clock size={14} className="mr-1.5" />
              Log Session
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Local data reset */}
      <div className="flex justify-end border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetDemoData}
        >
          <RotateCcw size={14} className="mr-1.5" />
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
}