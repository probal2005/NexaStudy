'use client';

import {
  CalendarCheck2,
  CalendarX2,
  Clock3,
  Percent,
} from 'lucide-react';

import { StatCard } from '@/components/analytics/StatCard';

interface AttendanceStatsProps {
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  lateClasses: number;
}

export function AttendanceStats({
  totalClasses,
  presentClasses,
  absentClasses,
  lateClasses,
}: AttendanceStatsProps) {
  const attendancePercentage =
    totalClasses > 0
      ? Math.round((presentClasses / totalClasses) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Attendance"
        value={`${attendancePercentage}%`}
        description="Overall attendance"
        icon={Percent}
        trend={attendancePercentage >= 75 ? 'up' : 'down'}
        trendValue={attendancePercentage >= 75 ? 'On track' : 'Below target'}
      />

      <StatCard
        title="Present"
        value={presentClasses}
        description="Classes attended"
        icon={CalendarCheck2}
        trend="up"
        trendValue={`${presentClasses} classes`}
      />

      <StatCard
        title="Absent"
        value={absentClasses}
        description="Classes missed"
        icon={CalendarX2}
        trend={absentClasses === 0 ? 'up' : 'down'}
        trendValue={absentClasses === 0 ? 'Perfect' : 'Needs attention'}
      />

      <StatCard
        title="Late"
        value={lateClasses}
        description="Late arrivals"
        icon={Clock3}
        trend={lateClasses === 0 ? 'up' : 'down'}
        trendValue={lateClasses === 0 ? 'None' : 'Recorded'}
      />
    </div>
  );
}