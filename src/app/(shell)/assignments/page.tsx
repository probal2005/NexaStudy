'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  BookMarked,
  ChevronRight,
  Clock,
  Search,
} from 'lucide-react';

type AssignmentStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'overdue';

type AssignmentPriority = 'low' | 'medium' | 'high';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: AssignmentStatus;
  deadline: string;
  priority: AssignmentPriority;
  grade: string | null;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'DBMS Project Proposal',
    description:
      'Write a 2-page proposal for the semester DBMS project covering schema design and normalization.',
    subject: 'CS201 - DBMS',
    status: 'in_progress',
    deadline: 'Mon, Sep 22 2026',
    priority: 'high',
    grade: null,
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    description:
      'Report on the Optics experiment conducted in Lab Session 4. Include graphs and error analysis.',
    subject: 'PH201 - Physics',
    status: 'not_started',
    deadline: 'Wed, Sep 24 2026',
    priority: 'medium',
    grade: null,
  },
  {
    id: '3',
    title: 'Data Structures Assignment 3',
    description:
      'Implement AVL tree with insertion, deletion, and rotation operations in C++.',
    subject: 'CS202 - DS',
    status: 'submitted',
    deadline: 'Fri, Sep 19 2026',
    priority: 'medium',
    grade: 'A',
  },
  {
    id: '4',
    title: 'Chemistry Research Paper',
    description:
      'Review paper on green chemistry applications in pharmaceutical industry (1500 words).',
    subject: 'CH201 - Chemistry',
    status: 'completed',
    deadline: 'Mon, Sep 15 2026',
    priority: 'low',
    grade: 'A+',
  },
  {
    id: '5',
    title: 'Calculus Problem Set 5',
    description:
      'Solve problems 1-20 from Chapter 7 on multiple integrals.',
    subject: 'MA201 - Calculus',
    status: 'overdue',
    deadline: 'Sun, Sep 14 2026',
    priority: 'high',
    grade: null,
  },
];

const statusLabels: Record<AssignmentStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  completed: 'Completed',
  overdue: 'Overdue',
};

const statusColors: Record<AssignmentStatus, string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  submitted: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

const statusIndicatorColors: Record<AssignmentStatus, string> = {
  not_started: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  submitted: 'bg-orange-500',
  completed: 'bg-green-500',
  overdue: 'bg-red-500',
};

const priorityColors: Record<AssignmentPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<AssignmentPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

type StatusFilter = 'all' | AssignmentStatus;

export default function AssignmentsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockAssignments.filter((assignment) => {
      const matchesSearch =
        query.length === 0 ||
        assignment.title.toLowerCase().includes(query) ||
        assignment.subject.toLowerCase().includes(query) ||
        assignment.description.toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'all' || assignment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: mockAssignments.length,
      completed: mockAssignments.filter(
        (assignment) => assignment.status === 'completed',
      ).length,
      inProgress: mockAssignments.filter(
        (assignment) => assignment.status === 'in_progress',
      ).length,
      overdue: mockAssignments.filter(
        (assignment) => assignment.status === 'overdue',
      ).length,
    };
  }, []);

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      valueClassName: 'text-foreground',
    },
    {
      label: 'Completed',
      value: stats.completed,
      valueClassName: 'text-green-600',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      valueClassName: 'text-blue-600',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      valueClassName: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Assignments
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track and manage all your course assignments
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  'text-3xl font-bold',
                  stat.valueClassName,
                )}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assignment List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />

              <Input
                aria-label="Search assignments"
                placeholder="Search assignments..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              aria-label="Filter assignments by status"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value as StatusFilter)
              }
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <EmptyState
              title="No assignments found"
              description="Try a different search or filter."
            />
          ) : (
            <div className="space-y-2">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/30"
                >
                  {/* Status Indicator */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'h-12 w-1 shrink-0 rounded-full',
                      statusIndicatorColors[assignment.status],
                    )}
                  />

                  {/* Assignment Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {assignment.title}
                      </h3>

                      <Badge
                        className={cn(
                          'shrink-0 text-xs',
                          priorityColors[assignment.priority],
                        )}
                      >
                        {priorityLabels[assignment.priority]}
                      </Badge>
                    </div>

                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {assignment.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {/* Subject */}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BookMarked size={12} aria-hidden="true" />
                        {assignment.subject}
                      </span>

                      {/* Status */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                          statusColors[assignment.status],
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-current"
                        />
                        {statusLabels[assignment.status]}
                      </span>

                      {/* Deadline */}
                      {assignment.deadline && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} aria-hidden="true" />
                          {assignment.deadline}
                        </span>
                      )}

                      {/* Grade */}
                      {assignment.grade && (
                        <Badge className="bg-green-100 text-xs font-semibold text-green-700">
                          Grade: {assignment.grade}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Open ${assignment.title}`}
                    className="shrink-0"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}