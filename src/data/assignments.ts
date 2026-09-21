export type AssignmentStatus =
  | 'not-started'
  | 'in-progress'
  | 'submitted'
  | 'graded';

export type AssignmentPriority = 'low' | 'medium' | 'high';

export interface AssignmentData {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  progress: number;
  marks?: number;
  totalMarks?: number;
  submittedAt?: string;
}

export const assignments: AssignmentData[] = [
  {
    id: 'assignment-001',
    title: 'Ensemble Learning Implementation',
    subjectId: 'sub-001',
    description:
      'Implement and compare multiple ensemble learning techniques.',
    dueDate: '2026-09-24',
    status: 'in-progress',
    priority: 'high',
    progress: 70,
  },
  {
    id: 'assignment-002',
    title: 'Database Optimization',
    subjectId: 'sub-002',
    description: 'Analyze N+1 queries and implement query optimization.',
    dueDate: '2026-09-27',
    status: 'not-started',
    priority: 'medium',
    progress: 0,
  },
  {
    id: 'assignment-003',
    title: 'REST API Development',
    subjectId: 'sub-003',
    description: 'Build a REST API using Spring Boot.',
    dueDate: '2026-09-29',
    status: 'submitted',
    priority: 'high',
    progress: 100,
    marks: 18,
    totalMarks: 20,
    submittedAt: '2026-09-19T16:30:00',
  },
  {
    id: 'assignment-004',
    title: 'Software Design Document',
    subjectId: 'sub-005',
    description: 'Prepare architecture and design documentation.',
    dueDate: '2026-10-02',
    status: 'graded',
    priority: 'medium',
    progress: 100,
    marks: 17,
    totalMarks: 20,
    submittedAt: '2026-09-18T11:00:00',
  },
];