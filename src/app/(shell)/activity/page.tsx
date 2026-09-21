'use client';

import type { ElementType } from 'react';
import {
  Award,
  BookOpen,
  BookMarked,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  Timer,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { cn } from '@/utils';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ActivityType =
  | 'assignment'
  | 'exam'
  | 'task'
  | 'study'
  | 'subject';

interface ActivityItem {
  id: string;
  type: ActivityType;
  action: string;
  title: string;
  detail: string;
  time: string;
  icon: ActivityIconName;
}

type ActivityIconName =
  | 'CheckCircle2'
  | 'CalendarIcon'
  | 'FileText'
  | 'Timer'
  | 'BookOpen'
  | 'Award';

/* -------------------------------------------------------------------------- */
/* Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'task',
    action: 'completed',
    title: 'Calculus Problem Set 4',
    detail: 'All 15 problems solved correctly',
    time: '2 hours ago',
    icon: 'CheckCircle2',
  },
  {
    id: '2',
    type: 'exam',
    action: 'scheduled',
    title: 'Physics Mid-term',
    detail: 'Wed, Sep 24 2026 at 10:00 AM',
    time: '3 hours ago',
    icon: 'CalendarIcon',
  },
  {
    id: '3',
    type: 'assignment',
    action: 'submitted',
    title: 'Data Structures Assignment 3',
    detail: 'Submitted before deadline — Grade: A',
    time: '5 hours ago',
    icon: 'FileText',
  },
  {
    id: '4',
    type: 'study',
    action: 'completed',
    title: 'Study Session: DBMS',
    detail: '1.5 hours — Covered normalization and ER diagrams',
    time: 'Yesterday',
    icon: 'Timer',
  },
  {
    id: '5',
    type: 'subject',
    action: 'updated',
    title: 'Chemistry Notes',
    detail: 'Added chapter 5 notes on organic chemistry',
    time: 'Yesterday',
    icon: 'BookOpen',
  },
  {
    id: '6',
    type: 'assignment',
    action: 'created',
    title: 'Chemistry Research Paper',
    detail: 'New assignment added: 1500 words due Sep 15',
    time: '2 days ago',
    icon: 'FileText',
  },
  {
    id: '7',
    type: 'exam',
    action: 'completed',
    title: 'Calculus Mid-term',
    detail: 'Scored 87/100 — Rank: 5th in class',
    time: '3 days ago',
    icon: 'Award',
  },
  {
    id: '8',
    type: 'study',
    action: 'completed',
    title: 'Study Session: Physics',
    detail: '2 hours — Optics chapter revision',
    time: '3 days ago',
    icon: 'Timer',
  },
];

/* -------------------------------------------------------------------------- */
/* Activity Styling                                                           */
/* -------------------------------------------------------------------------- */

const typeColors: Record<ActivityType, string> = {
  assignment: 'bg-blue-100 text-blue-700',
  exam: 'bg-purple-100 text-purple-700',
  task: 'bg-green-100 text-green-700',
  study: 'bg-orange-100 text-orange-700',
  subject: 'bg-yellow-100 text-yellow-700',
};

const iconMap: Record<ActivityIconName, ElementType> = {
  CheckCircle2,
  CalendarIcon,
  FileText,
  Timer,
  BookOpen,
  Award,
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Recent Activity
        </h1>

        <p className="mt-1 text-muted-foreground">
          Your recent activity across all NexaStudy features
        </p>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>

        <CardContent className="space-y-1">
          {mockActivity.length === 0 ? (
            <div className="py-10 text-center">
              <BookMarked
                size={32}
                className="mx-auto text-muted-foreground"
              />

              <p className="mt-3 text-sm font-medium text-foreground">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your recent actions will appear here.
              </p>
            </div>
          ) : (
            mockActivity.map((item, index) => {
              const Icon = iconMap[item.icon];

              return (
                <div
                  key={item.id}
                  className="relative flex gap-4"
                >
                  {/* Timeline connector */}
                  {index < mockActivity.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-[19px] top-6 w-px bg-border"
                    />
                  )}

                  {/* Activity Icon */}
                  <div
                    className={cn(
                      'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      typeColors[item.type],
                    )}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>

                  {/* Activity Content */}
                  <div className="min-w-0 flex-1 pb-5">
                    <p className="text-sm font-medium">
                      <span className="text-muted-foreground">
                        {item.action}
                      </span>{' '}
                      <span className="text-foreground">
                        {item.title}
                      </span>
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.detail}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} aria-hidden="true" />
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}