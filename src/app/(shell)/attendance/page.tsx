'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
} from 'lucide-react';

type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'excused';

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  subject: string;
  notes: string;
  classHours: number;
}

type StatusFilter = 'all' | AttendanceStatus;

const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    date: 'Mon, Sep 15 2026',
    status: 'present',
    subject: 'CS201 - DBMS',
    notes: '',
    classHours: 3,
  },
  {
    id: '2',
    date: 'Tue, Sep 16 2026',
    status: 'present',
    subject: 'PH201 - Physics',
    notes: '',
    classHours: 2,
  },
  {
    id: '3',
    date: 'Wed, Sep 17 2026',
    status: 'late',
    subject: 'MA201 - Calculus',
    notes: 'Arrived 15 min late',
    classHours: 3,
  },
  {
    id: '4',
    date: 'Thu, Sep 18 2026',
    status: 'present',
    subject: 'CH201 - Chemistry',
    notes: '',
    classHours: 2,
  },
  {
    id: '5',
    date: 'Fri, Sep 19 2026',
    status: 'present',
    subject: 'CS202 - DS',
    notes: '',
    classHours: 3,
  },
  {
    id: '6',
    date: 'Mon, Sep 22 2026',
    status: 'absent',
    subject: 'CS201 - DBMS',
    notes: 'Sick leave',
    classHours: 3,
  },
  {
    id: '7',
    date: 'Tue, Sep 23 2026',
    status: 'present',
    subject: 'PH201 - Physics',
    notes: '',
    classHours: 2,
  },
  {
    id: '8',
    date: 'Wed, Sep 24 2026',
    status: 'present',
    subject: 'MA201 - Calculus',
    notes: '',
    classHours: 3,
  },
];

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

const statusColors: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-yellow-100 text-yellow-700',
  excused: 'bg-blue-100 text-blue-700',
};

const statusIndicatorColors: Record<AttendanceStatus, string> = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  excused: 'bg-blue-500',
};

const statusIcons: Record<
  AttendanceStatus,
  typeof CheckCircle2
> = {
  present: CheckCircle2,
  absent: AlertCircle,
  late: Clock,
  excused: CalendarIcon,
};

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] =
    useState<StatusFilter>('all');

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockAttendance.filter((record) => {
      const matchesSearch =
        query.length === 0 ||
        record.subject.toLowerCase().includes(query) ||
        record.notes.toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'all' ||
        record.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus]);

  const stats = useMemo(() => {
    const total = mockAttendance.length;

    const present = mockAttendance.filter(
      (record) => record.status === 'present',
    ).length;

    const late = mockAttendance.filter(
      (record) => record.status === 'late',
    ).length;

    const absent = mockAttendance.filter(
      (record) => record.status === 'absent',
    ).length;

    const excused = mockAttendance.filter(
      (record) => record.status === 'excused',
    ).length;

    const totalHours = mockAttendance.reduce(
      (sum, record) => sum + record.classHours,
      0,
    );

    const presentHours = mockAttendance
      .filter((record) => record.status === 'present')
      .reduce(
        (sum, record) => sum + record.classHours,
        0,
      );

    // Preserve the existing project behavior:
    // only "present" records count toward the attendance rate.
    const attendanceRate =
      total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      late,
      absent,
      excused,
      totalHours,
      presentHours,
      attendanceRate,
    };
  }, []);

  const trendData = [
    {
      label: 'Present',
      count: stats.present,
      color: 'bg-green-500',
    },
    {
      label: 'Late',
      count: stats.late,
      color: 'bg-yellow-500',
    },
    {
      label: 'Absent',
      count: stats.absent,
      color: 'bg-red-500',
    },
    {
      label: 'Excused',
      count: stats.excused,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Attendance
        </h1>

        <p className="mt-1 text-muted-foreground">
          Track your class attendance and monitor your attendance rate
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.attendanceRate}%
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {stats.present}/{stats.total} classes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes Attended
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.present}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes Missed
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.absent}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Logged
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalHours}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <ProgressBar
        value={stats.attendanceRate}
        max={100}
        label={`Attendance Rate: ${stats.attendanceRate}%`}
      />

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />

              <Input
                aria-label="Search attendance records"
                placeholder="Search subjects or notes..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              aria-label="Filter attendance by status"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(
                  event.target.value as StatusFilter,
                )
              }
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {filteredAttendance.length === 0 ? (
            <EmptyState
              title="No records found"
              description="Try a different search or filter."
            />
          ) : (
            <div className="space-y-2">
              {filteredAttendance.map((record) => {
                const Icon = statusIcons[record.status];

                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/30"
                  >
                    {/* Status Indicator */}
                    <div
                      aria-hidden="true"
                      className={cn(
                        'h-12 w-1 shrink-0 rounded-full',
                        statusIndicatorColors[record.status],
                      )}
                    />

                    {/* Record Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {record.subject}
                        </h3>

                        <Badge
                          className={cn(
                            'inline-flex items-center gap-1 text-xs',
                            statusColors[record.status],
                          )}
                        >
                          <Icon
                            size={12}
                            aria-hidden="true"
                          />
                          {statusLabels[record.status]}
                        </Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon
                            size={14}
                            aria-hidden="true"
                          />
                          {record.date}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock
                            size={14}
                            aria-hidden="true"
                          />
                          {record.classHours}h class
                        </span>
                      </div>

                      {record.notes && (
                        <p className="mt-1.5 text-xs italic text-muted-foreground">
                          {record.notes}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Open attendance record for ${record.subject}`}
                      className="shrink-0"
                    >
                      <ChevronRight
                        size={18}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {trendData.map((item) => {
              const percentage =
                stats.total > 0
                  ? Math.round(
                      (item.count / stats.total) * 100,
                    )
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          item.color,
                        )}
                      />
                      {item.label}
                    </span>

                    <span className="text-muted-foreground">
                      {item.count} classes ({percentage}%)
                    </span>
                  </div>

                  <ProgressBar
                    value={percentage}
                    max={100}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}