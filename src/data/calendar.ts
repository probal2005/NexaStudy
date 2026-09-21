export type CalendarEventType =
  | 'class'
  | 'assignment'
  | 'exam'
  | 'study'
  | 'personal'
  | 'meeting';

export interface CalendarEventData {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: CalendarEventType;
  subjectId?: string;
  location?: string;
  description?: string;
  reminder?: boolean;
  color?: string;
}

export const calendarEvents: CalendarEventData[] = [
  {
    id: 'event-001',
    title: 'Machine Learning Class',
    date: '2026-09-21',
    startTime: '09:00',
    endTime: '10:00',
    type: 'class',
    subjectId: 'sub-001',
    location: 'Block A - 204',
  },
  {
    id: 'event-002',
    title: 'DBMS Revision',
    date: '2026-09-21',
    startTime: '17:00',
    endTime: '18:30',
    type: 'study',
    subjectId: 'sub-002',
  },
  {
    id: 'event-003',
    title: 'ML Assignment Deadline',
    date: '2026-09-24',
    type: 'assignment',
    subjectId: 'sub-001',
    reminder: true,
  },
  {
    id: 'event-004',
    title: 'ML Midterm',
    date: '2026-09-28',
    startTime: '10:00',
    endTime: '12:00',
    type: 'exam',
    subjectId: 'sub-001',
    location: 'Block A - 204',
  },
];