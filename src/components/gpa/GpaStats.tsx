import {
  Award,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

import { StatCard } from '@/components/analytics/StatCard';

interface GpaStatsProps {
  gpa: number;
  credits: number;
  courses: number;
  highestGradePoint?: number;
}

export function GpaStats({
  gpa,
  credits,
  courses,
  highestGradePoint = 0,
}: GpaStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Semester GPA"
        value={gpa.toFixed(2)}
        description="Current calculated GPA"
        icon={TrendingUp}
      />

      <StatCard
        title="Total Credits"
        value={credits}
        description="Credits included"
        icon={BookOpen}
      />

      <StatCard
        title="Courses"
        value={courses}
        description="Courses included"
        icon={GraduationCap}
      />

      <StatCard
        title="Highest Grade Point"
        value={highestGradePoint.toFixed(2)}
        description="Best grade point"
        icon={Award}
      />
    </div>
  );
}