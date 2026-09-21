import {
  getTasks,
} from './tasks.service';

import {
  getAssignments,
} from './assignments.service';

import {
  getStudySessions,
} from './study.service';

import {
  getAttendance,
} from './attendance.service';

export interface DashboardSummary {
  tasks: Awaited<ReturnType<typeof getTasks>>;
  assignments: Awaited<
    ReturnType<typeof getAssignments>
  >;
  studySessions: Awaited<
    ReturnType<typeof getStudySessions>
  >;
  attendance: Awaited<
    ReturnType<typeof getAttendance>
  >;
}

export async function getDashboardSummary(): Promise<
  DashboardSummary
> {
  const [
    tasks,
    assignments,
    studySessions,
    attendance,
  ] = await Promise.all([
    getTasks(),
    getAssignments(),
    getStudySessions(),
    getAttendance(),
  ]);

  return {
    tasks,
    assignments,
    studySessions,
    attendance,
  };
}