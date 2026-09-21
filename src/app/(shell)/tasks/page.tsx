'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Flag,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  EmptyState,
  ProgressBar,
} from '@/components/ui/Header';
import { cn } from '@/utils';

type Priority = 'urgent' | 'high' | 'medium' | 'low';

type View =
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'priority'
  | 'kanban';

type KanbanColumn =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'completed';

interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  subjectId: string | null;
  tags: string[];
  subtasks: Subtask[];
  recurring: string | null;
  reminder: boolean;
  createdAt: string;
  updatedAt: string;
  kanbanStatus: KanbanColumn;
}

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  dueTime: string;
  subjectId: string;
  tags: string;
  reminder: boolean;
  recurring: string;
  kanbanStatus: KanbanColumn;
}

const STORAGE_KEY = 'nexastudy_tasks_v1';

const SUBJECTS: SubjectOption[] = [
  { id: 's1', name: 'Database Management System', code: 'DBMS' },
  { id: 's2', name: 'Physics', code: 'PHY' },
  { id: 's3', name: 'Mathematics', code: 'MATH' },
  { id: 's4', name: 'Chemistry', code: 'CHEM' },
  { id: 's5', name: 'Artificial Intelligence', code: 'AI' },
];

const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete DBMS Assignment - Query Optimization',
    description:
      'Implement query optimization for the given database schema. Include multiple approaches with benchmarks.',
    completed: false,
    priority: 'urgent',
    dueDate: '2026-09-21',
    dueTime: '23:59',
    subjectId: 's1',
    tags: ['assignment', 'dbms'],
    subtasks: [
      {
        id: 'sub-1',
        title: 'Research query optimization techniques',
        completed: true,
      },
      {
        id: 'sub-2',
        title: 'Implement index-based optimization',
        completed: false,
      },
      {
        id: 'sub-3',
        title: 'Benchmark results',
        completed: false,
      },
    ],
    recurring: null,
    reminder: true,
    createdAt: '2026-09-15T10:00:00',
    updatedAt: '2026-09-18T14:30:00',
    kanbanStatus: 'in_progress',
  },
  {
    id: 'task-2',
    title: 'Review Thermodynamics Chapter 5',
    description:
      'Read and summarize the key concepts from Chapter 5: Second Law of Thermodynamics.',
    completed: false,
    priority: 'high',
    dueDate: '2026-09-20',
    dueTime: '10:00',
    subjectId: 's2',
    tags: ['study', 'physics'],
    subtasks: [],
    recurring: null,
    reminder: false,
    createdAt: '2026-09-17T09:00:00',
    updatedAt: '2026-09-17T09:00:00',
    kanbanStatus: 'todo',
  },
  {
    id: 'task-3',
    title: 'Physics Lab Report',
    description:
      'Write the report for the optics experiment conducted last week.',
    completed: false,
    priority: 'medium',
    dueDate: '2026-09-23',
    dueTime: '17:00',
    subjectId: 's2',
    tags: ['lab', 'report'],
    subtasks: [
      { id: 'sub-4', title: 'Data analysis', completed: true },
      { id: 'sub-5', title: 'Write methodology', completed: false },
      { id: 'sub-6', title: 'Results and conclusion', completed: false },
    ],
    recurring: null,
    reminder: true,
    createdAt: '2026-09-16T15:00:00',
    updatedAt: '2026-09-17T11:00:00',
    kanbanStatus: 'todo',
  },
  {
    id: 'task-4',
    title: 'Mathematics Problem Set 4',
    description:
      'Solve problems 1-15 from the calculus problem set. Focus on integration techniques.',
    completed: false,
    priority: 'medium',
    dueDate: '2026-09-25',
    dueTime: '23:59',
    subjectId: 's3',
    tags: ['assignment', 'math', 'calculus'],
    subtasks: [],
    recurring: null,
    reminder: false,
    createdAt: '2026-09-18T08:00:00',
    updatedAt: '2026-09-18T08:00:00',
    kanbanStatus: 'backlog',
  },
  {
    id: 'task-5',
    title: 'Chemistry Lab Preparation',
    description:
      'Prepare for the titration experiment. Read the lab manual and prepare the worksheet.',
    completed: false,
    priority: 'low',
    dueDate: '2026-09-22',
    dueTime: '09:00',
    subjectId: 's4',
    tags: ['lab', 'chemistry'],
    subtasks: [],
    recurring: null,
    reminder: true,
    createdAt: '2026-09-18T09:30:00',
    updatedAt: '2026-09-18T09:30:00',
    kanbanStatus: 'review',
  },
  {
    id: 'task-6',
    title: 'Read Research Paper on Neural Networks',
    description:
      'Read and take notes on an attention mechanism research paper.',
    completed: false,
    priority: 'low',
    dueDate: null,
    dueTime: null,
    subjectId: 's5',
    tags: ['reading', 'study'],
    subtasks: [],
    recurring: null,
    reminder: false,
    createdAt: '2026-09-14T12:00:00',
    updatedAt: '2026-09-14T12:00:00',
    kanbanStatus: 'backlog',
  },
  {
    id: 'task-7',
    title: 'Complete Economics Essay',
    description:
      'Write a 2000-word essay on supply-side economics vs demand-side economics.',
    completed: true,
    priority: 'high',
    dueDate: '2026-09-16',
    dueTime: '23:59',
    subjectId: null,
    tags: ['essay', 'economics'],
    subtasks: [
      { id: 'sub-7', title: 'Research and outline', completed: true },
      { id: 'sub-8', title: 'Write first draft', completed: true },
      { id: 'sub-9', title: 'Edit and finalize', completed: true },
    ],
    recurring: null,
    reminder: false,
    createdAt: '2026-09-01T10:00:00',
    updatedAt: '2026-09-16T23:55:00',
    kanbanStatus: 'completed',
  },
  {
    id: 'task-8',
    title: 'Prepare for Physics Midterm',
    description:
      'Review chapters 1-6, solve practice problems, and take the mock test.',
    completed: true,
    priority: 'urgent',
    dueDate: '2026-09-12',
    dueTime: '14:00',
    subjectId: 's2',
    tags: ['exam', 'physics', 'study'],
    subtasks: [
      { id: 'sub-10', title: 'Review chapter notes', completed: true },
      { id: 'sub-11', title: 'Solve practice problems', completed: true },
      { id: 'sub-12', title: 'Take mock test', completed: true },
    ],
    recurring: null,
    reminder: true,
    createdAt: '2026-09-01T09:00:00',
    updatedAt: '2026-09-12T14:00:00',
    kanbanStatus: 'completed',
  },
];

const priorityOrder: Priority[] = [
  'urgent',
  'high',
  'medium',
  'low',
];

const priorityColors: Record<Priority, string> = {
  urgent:
    'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
  high:
    'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
  medium:
    'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
  low:
    'text-green-600 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
};

const kanbanColumns: {
  key: KanbanColumn;
  label: string;
  color: string;
}[] = [
  {
    key: 'backlog',
    label: 'Backlog',
    color:
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  {
    key: 'todo',
    label: 'To Do',
    color:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  },
  {
    key: 'review',
    label: 'Review',
    color:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  },
  {
    key: 'completed',
    label: 'Completed',
    color:
      'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  },
];

const kanbanDropZones: Record<KanbanColumn, string> = {
  backlog:
    'bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800',
  todo:
    'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  in_progress:
    'bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
  review:
    'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
  completed:
    'bg-green-50/30 dark:bg-green-950/20 border-green-200 dark:border-green-800',
};

const emptyForm: TaskForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  dueTime: '',
  subjectId: '',
  tags: '',
  reminder: false,
  recurring: '',
  kanbanStatus: 'todo',
};

function makeId(prefix = 'task') {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function getTodayStart() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
}

function parseTaskDate(value: string | null) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string | null) {
  const date = parseTaskDate(value);

  if (!date) return '';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getSubjectName(subjectId: string | null) {
  if (!subjectId) return null;

  return (
    SUBJECTS.find(subject => subject.id === subjectId)?.name ??
    null
  );
}

function isTaskOverdue(task: Task) {
  const date = parseTaskDate(task.dueDate);

  return Boolean(
    date &&
      date.getTime() < getTodayStart().getTime() &&
      !task.completed,
  );
}

function isTaskToday(task: Task) {
  const date = parseTaskDate(task.dueDate);

  if (!date) return false;

  return date.getTime() === getTodayStart().getTime();
}

function getSubtaskProgress(task: Task) {
  if (!task.subtasks.length) return null;

  const completed = task.subtasks.filter(
    subtask => subtask.completed,
  ).length;

  return Math.round(
    (completed / task.subtasks.length) * 100,
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [view, setView] = useState<View>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<
    Priority | 'all'
  >('all');

  const [hydrated, setHydrated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(
    null,
  );
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(
    null,
  );

  const [formData, setFormData] =
    useState<TaskForm>(emptyForm);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch {
      // Keep seed data if localStorage is unavailable/corrupt.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks),
    );
  }, [tasks, hydrated]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(task => {
        const subjectName =
          getSubjectName(task.subjectId)?.toLowerCase() ?? '';

        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag =>
            tag.toLowerCase().includes(query),
          ) ||
          subjectName.includes(query)
        );
      });
    }

    if (priorityFilter !== 'all') {
      result = result.filter(
        task => task.priority === priorityFilter,
      );
    }

    return result;
  }, [tasks, searchQuery, priorityFilter]);

  const tasksByView = useMemo(() => {
    const today = getTodayStart();

    switch (view) {
      case 'today':
        return filteredTasks.filter(
          task => isTaskToday(task) && !task.completed,
        );

      case 'upcoming':
        return filteredTasks
          .filter(task => {
            const date = parseTaskDate(task.dueDate);

            return Boolean(
              date &&
                date.getTime() > today.getTime() &&
                !task.completed,
            );
          })
          .sort((a, b) => {
            return (
              parseTaskDate(a.dueDate)!.getTime() -
              parseTaskDate(b.dueDate)!.getTime()
            );
          });

      case 'overdue':
        return filteredTasks
          .filter(task => isTaskOverdue(task))
          .sort((a, b) => {
            return (
              parseTaskDate(a.dueDate)!.getTime() -
              parseTaskDate(b.dueDate)!.getTime()
            );
          });

      case 'completed':
        return filteredTasks
          .filter(task => task.completed)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime(),
          );

      case 'priority':
        return [...filteredTasks]
          .filter(task => !task.completed)
          .sort(
            (a, b) =>
              priorityOrder.indexOf(a.priority) -
              priorityOrder.indexOf(b.priority),
          );

      default:
        return filteredTasks;
    }
  }, [filteredTasks, view]);

  const completedCount = tasks.filter(
    task => task.completed,
  ).length;

  const overdueCount = tasks.filter(task =>
    isTaskOverdue(task),
  ).length;

  const todayCount = tasks.filter(
    task => isTaskToday(task) && !task.completed,
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const openDialog = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);

      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ?? '',
        dueTime: task.dueTime ?? '',
        subjectId: task.subjectId ?? '',
        tags: task.tags.join(', '),
        reminder: task.reminder,
        recurring: task.recurring ?? '',
        kanbanStatus: task.kanbanStatus,
      });
    } else {
      setEditingTaskId(null);
      setFormData(emptyForm);
    }

    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingTaskId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) return;

    const now = new Date().toISOString();

    const normalizedTags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .filter(
        (tag, index, array) =>
          array.indexOf(tag) === index,
      );

    if (editingTaskId) {
      setTasks(previous =>
        previous.map(task =>
          task.id === editingTaskId
            ? {
                ...task,
                title,
                description: formData.description.trim(),
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                dueTime: formData.dueTime || null,
                subjectId:
                  formData.subjectId || null,
                tags: normalizedTags,
                reminder: formData.reminder,
                recurring:
                  formData.recurring || null,
                kanbanStatus:
                  formData.kanbanStatus,
                completed:
                  formData.kanbanStatus === 'completed'
                    ? true
                    : formData.kanbanStatus ===
                        'backlog' ||
                      formData.kanbanStatus === 'todo' ||
                      formData.kanbanStatus ===
                        'in_progress' ||
                      formData.kanbanStatus === 'review'
                    ? false
                    : task.completed,
                updatedAt: now,
              }
            : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: makeId(),
        title,
        description: formData.description.trim(),
        completed:
          formData.kanbanStatus === 'completed',
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        dueTime: formData.dueTime || null,
        subjectId: formData.subjectId || null,
        tags: normalizedTags,
        subtasks: [],
        recurring: formData.recurring || null,
        reminder: formData.reminder,
        createdAt: now,
        updatedAt: now,
        kanbanStatus: formData.kanbanStatus,
      };

      setTasks(previous => [...previous, newTask]);
    }

    closeDialog();
  };

  const handleToggleComplete = (id: string) => {
    const now = new Date().toISOString();

    setTasks(previous =>
      previous.map(task => {
        if (task.id !== id) return task;

        const completed = !task.completed;

        return {
          ...task,
          completed,
          kanbanStatus: completed
            ? 'completed'
            : task.kanbanStatus === 'completed'
            ? 'todo'
            : task.kanbanStatus,
          updatedAt: now,
        };
      }),
    );
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    const confirmed = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!confirmed) return;

    setTasks(previous =>
      previous.filter(item => item.id !== id),
    );
  };

  const handleMoveTask = (
    taskId: string,
    column: KanbanColumn,
  ) => {
    const now = new Date().toISOString();

    setTasks(previous =>
      previous.map(task =>
        task.id === taskId
          ? {
              ...task,
              kanbanStatus: column,
              completed: column === 'completed',
              updatedAt: now,
            }
          : task,
      ),
    );

    setDraggedTaskId(null);
  };

  const handleSubtaskToggle = (
    taskId: string,
    subtaskId: string,
  ) => {
    const now = new Date().toISOString();

    setTasks(previous =>
      previous.map(task => {
        if (task.id !== taskId) return task;

        const subtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId
            ? {
                ...subtask,
                completed: !subtask.completed,
              }
            : subtask,
        );

        const allCompleted =
          subtasks.length > 0 &&
          subtasks.every(subtask => subtask.completed);

        return {
          ...task,
          subtasks,
          completed: allCompleted
            ? true
            : task.completed,
          kanbanStatus: allCompleted
            ? 'completed'
            : task.kanbanStatus,
          updatedAt: now,
        };
      }),
    );
  };

  const getViewCount = (targetView: View) => {
    const today = getTodayStart();

    switch (targetView) {
      case 'today':
        return tasks.filter(
          task => isTaskToday(task) && !task.completed,
        ).length;

      case 'upcoming':
        return tasks.filter(task => {
          const date = parseTaskDate(task.dueDate);

          return Boolean(
            date &&
              date.getTime() > today.getTime() &&
              !task.completed,
          );
        }).length;

      case 'overdue':
        return overdueCount;

      case 'completed':
        return completedCount;

      case 'priority':
        return tasks.filter(task => !task.completed).length;

      default:
        return tasks.length;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">
            Tasks
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {tasks.length} total · {completedCount}{' '}
            completed · {overdueCount} overdue
          </p>
        </div>

        <Button onClick={() => openDialog()}>
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Today
                </p>
                <p className="text-xl font-bold">
                  {todayCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                <AlertCircle size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Overdue
                </p>
                <p className="text-xl font-bold">
                  {overdueCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Completed
                </p>
                <p className="text-xl font-bold">
                  {completedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <Flag size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  Completion
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">
                    {completionRate}%
                  </p>
                  <div className="flex-1">
                    <ProgressBar
                      value={completionRate}
                      max={100}
                      showLabel={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 pb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search tasks, tags or subjects..."
            value={searchQuery}
            onChange={event =>
              setSearchQuery(event.target.value)
            }
            className="pl-9"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={event =>
            setPriorityFilter(
              event.target.value as Priority | 'all',
            )
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm cursor-pointer"
        >
          <option value="all">
            All priorities
          </option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <Button
          variant="outline"
          onClick={() =>
            setView(
              view === 'kanban'
                ? 'today'
                : 'kanban',
            )
          }
        >
          {view === 'kanban'
            ? 'List View'
            : 'Kanban Board'}
        </Button>
      </div>

      {/* List View */}
      {view !== 'kanban' && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto">
              {(
                [
                  'today',
                  'upcoming',
                  'overdue',
                  'completed',
                  'priority',
                ] as const
              ).map(tab => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={cn(
                    'flex-1 min-w-[90px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                    view === tab
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span>{tab.replace('_', ' ')}</span>
                  <span className="ml-1 text-[10px] opacity-70">
                    {getViewCount(tab)}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {tasksByView.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 size={24} />}
                title={
                  view === 'completed'
                    ? 'No completed tasks yet'
                    : view === 'overdue'
                    ? 'No overdue tasks'
                    : 'No tasks found'
                }
                description={
                  view === 'overdue'
                    ? 'You are all caught up!'
                    : 'Create a task to get started.'
                }
                action={
                  view !== 'completed'
                    ? {
                        label: 'Add Task',
                        onClick: () =>
                          openDialog(),
                      }
                    : undefined
                }
              />
            ) : (
              <div className="divide-y divide-border">
                {tasksByView.map(task => {
                  const subtaskProgress =
                    getSubtaskProgress(task);

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'px-4 py-3 hover:bg-muted/40 transition-colors',
                        task.completed &&
                          'opacity-70',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          className={cn(
                            'flex h-5 w-5 mt-0.5 items-center justify-center rounded-full border-2 flex-shrink-0 transition-all',
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-muted-foreground/30 hover:border-primary',
                          )}
                          onClick={() =>
                            handleToggleComplete(
                              task.id,
                            )
                          }
                          aria-label={
                            task.completed
                              ? 'Mark incomplete'
                              : 'Mark complete'
                          }
                        >
                          {task.completed && (
                            <Check size={12} />
                          )}
                        </button>

                        {/* Task content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'text-sm font-medium',
                                task.completed &&
                                  'line-through text-muted-foreground',
                              )}
                            >
                              {task.title}
                            </span>

                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-1.5 py-0',
                                priorityColors[
                                  task.priority
                                ],
                              )}
                            >
                              {task.priority}
                            </Badge>

                            {task.reminder && (
                              <span
                                className="text-muted-foreground"
                                title="Reminder enabled"
                              >
                                <Clock size={13} />
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1',
                                  isTaskOverdue(
                                    task,
                                  ) &&
                                    'text-red-600 font-medium',
                                  isTaskToday(
                                    task.dueDate
                                      ? task
                                      : task,
                                  ) &&
                                    'text-primary font-medium',
                                )}
                              >
                                <Calendar size={12} />
                                {formatDate(
                                  task.dueDate,
                                )}

                                {task.dueTime &&
                                  ` · ${task.dueTime}`}
                              </span>
                            )}

                            {task.subjectId && (
                              <span>
                                {getSubjectName(
                                  task.subjectId,
                                )}
                              </span>
                            )}

                            {task.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {task.tags
                                  .slice(0, 3)
                                  .map(tag => (
                                    <span
                                      key={tag}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted"
                                    >
                                      #{tag}
                                    </span>
                                  ))}

                                {task.tags.length >
                                  3 && (
                                  <span className="text-[10px]">
                                    +
                                    {task.tags.length -
                                      3}
                                  </span>
                                )}
                              </div>
                            )}

                            {task.subtasks.length >
                              0 && (
                              <span>
                                {task.subtasks.filter(
                                  subtask =>
                                    subtask.completed,
                                ).length}
                                /
                                {task.subtasks.length}{' '}
                                subtasks
                              </span>
                            )}
                          </div>

                          {/* Subtask progress */}
                          {subtaskProgress !== null && (
                            <div className="max-w-xs mt-2">
                              <ProgressBar
                                value={
                                  subtaskProgress
                                }
                                max={100}
                                showLabel={false}
                              />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              openDialog(task)
                            }
                            title="Edit task"
                          >
                            <Edit3 size={14} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleDeleteTask(
                                task.id,
                              )
                            }
                            title="Delete task"
                          >
                            <Trash2
                              size={14}
                              className="text-red-500"
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Subtasks */}
                      {task.subtasks.length > 0 && (
                        <div className="ml-8 mt-3 space-y-1">
                          {task.subtasks.map(
                            subtask => (
                              <button
                                key={subtask.id}
                                type="button"
                                onClick={() =>
                                  handleSubtaskToggle(
                                    task.id,
                                    subtask.id,
                                  )
                                }
                                className="flex items-center gap-2 text-xs text-left hover:text-primary transition-colors"
                              >
                                <span
                                  className={cn(
                                    'h-3.5 w-3.5 rounded border flex items-center justify-center',
                                    subtask.completed
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-muted-foreground/40',
                                  )}
                                >
                                  {subtask.completed && (
                                    <Check size={9} />
                                  )}
                                </span>

                                <span
                                  className={cn(
                                    subtask.completed &&
                                      'line-through text-muted-foreground',
                                  )}
                                >
                                  {subtask.title}
                                </span>
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Kanban */}
      {view === 'kanban' && (
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-4">
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-5 gap-3 min-w-[1100px]">
                {kanbanColumns.map(column => {
                  const columnTasks =
                    filteredTasks.filter(
                      task =>
                        task.kanbanStatus ===
                        column.key,
                    );

                  return (
                    <div
                      key={column.key}
                      onDragOver={event =>
                        event.preventDefault()
                      }
                      onDrop={() => {
                        if (draggedTaskId) {
                          handleMoveTask(
                            draggedTaskId,
                            column.key,
                          );
                        }
                      }}
                      className="flex flex-col min-h-[420px]"
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg mb-2',
                          column.color,
                        )}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider flex-1">
                          {column.label}
                        </span>

                        <span className="text-xs bg-background/60 px-1.5 py-0.5 rounded">
                          {columnTasks.length}
                        </span>
                      </div>

                      <div
                        className={cn(
                          'flex-1 rounded-lg p-2 space-y-2 border transition-colors',
                          kanbanDropZones[
                            column.key
                          ],
                          draggedTaskId &&
                            'ring-1 ring-primary/20',
                        )}
                      >
                        {columnTasks.map(task => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() =>
                              setDraggedTaskId(
                                task.id,
                              )
                            }
                            onDragEnd={() =>
                              setDraggedTaskId(
                                null,
                              )
                            }
                            className={cn(
                              'p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing transition-shadow hover:shadow-sm',
                              task.completed &&
                                'opacity-60',
                              draggedTaskId ===
                                task.id &&
                                'opacity-50',
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <GripVertical
                                size={13}
                                className="mt-0.5 text-muted-foreground flex-shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleComplete(
                                      task.id,
                                    )
                                  }
                                  className="text-left w-full"
                                >
                                  <p
                                    className={cn(
                                      'text-xs font-medium',
                                      task.completed &&
                                        'line-through text-muted-foreground',
                                    )}
                                  >
                                    {task.title}
                                  </p>
                                </button>

                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[9px] px-1 py-0',
                                      priorityColors[
                                        task.priority
                                      ],
                                    )}
                                  >
                                    {task.priority}
                                  </Badge>

                                  {task.dueDate && (
                                    <span className="text-[9px] text-muted-foreground">
                                      {formatDate(
                                        task.dueDate,
                                      )}
                                    </span>
                                  )}
                                </div>

                                {task.subjectId && (
                                  <p className="text-[9px] text-muted-foreground mt-2 truncate">
                                    {getSubjectName(
                                      task.subjectId,
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="flex items-center justify-center min-h-[120px] text-xs text-muted-foreground text-center">
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              closeDialog();
            }
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingTaskId
                    ? 'Edit Task'
                    : 'Create Task'}
                </h2>

                <p className="text-xs text-muted-foreground mt-1">
                  Manage your task details and
                  workflow.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={closeDialog}
                type="button"
              >
                <X size={16} />
              </Button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >
              <div>
                <label className="text-xs font-medium mb-1.5 block">
                  Task title *
                </label>

                <Input
                  autoFocus
                  placeholder="e.g. Complete DBMS assignment"
                  value={formData.title}
                  onChange={event =>
                    setFormData(previous => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block">
                  Description
                </label>

                <textarea
                  placeholder="Add useful details about this task..."
                  value={formData.description}
                  onChange={event =>
                    setFormData(previous => ({
                      ...previous,
                      description:
                        event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Priority
                  </label>

                  <select
                    value={formData.priority}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        priority:
                          event.target
                            .value as Priority,
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="urgent">
                      Urgent
                    </option>
                    <option value="high">
                      High
                    </option>
                    <option value="medium">
                      Medium
                    </option>
                    <option value="low">
                      Low
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Subject
                  </label>

                  <select
                    value={formData.subjectId}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        subjectId:
                          event.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">
                      No subject
                    </option>

                    {SUBJECTS.map(subject => (
                      <option
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.code} —{' '}
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Due date
                  </label>

                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        dueDate:
                          event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Due time
                  </label>

                  <Input
                    type="time"
                    value={formData.dueTime}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        dueTime:
                          event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block">
                  Tags
                </label>

                <Input
                  placeholder="assignment, exam, study"
                  value={formData.tags}
                  onChange={event =>
                    setFormData(previous => ({
                      ...previous,
                      tags: event.target.value,
                    }))
                  }
                />

                <p className="text-[11px] text-muted-foreground mt-1">
                  Separate multiple tags with commas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Workflow status
                  </label>

                  <select
                    value={formData.kanbanStatus}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        kanbanStatus:
                          event.target
                            .value as KanbanColumn,
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {kanbanColumns.map(
                      column => (
                        <option
                          key={column.key}
                          value={column.key}
                        >
                          {column.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Recurring
                  </label>

                  <select
                    value={formData.recurring}
                    onChange={event =>
                      setFormData(previous => ({
                        ...previous,
                        recurring:
                          event.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">
                      Does not repeat
                    </option>
                    <option value="daily">
                      Daily
                    </option>
                    <option value="weekly">
                      Weekly
                    </option>
                    <option value="monthly">
                      Monthly
                    </option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={event =>
                    setFormData(previous => ({
                      ...previous,
                      reminder:
                        event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />

                <div>
                  <p className="text-sm font-medium">
                    Enable reminder
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Store this preference with the
                    task.
                  </p>
                </div>
              </label>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!formData.title.trim()}
                >
                  {editingTaskId
                    ? 'Save Changes'
                    : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}