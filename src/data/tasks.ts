export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  subjectId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
  tags: string[];
  progress: number;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  reminder?: boolean;
}

export const tasks: TaskData[] = [
  {
    id: 'task-001',
    title: 'Complete ML assignment',
    description: 'Finish the supervised learning implementation.',
    subjectId: 'sub-001',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-22',
    dueTime: '18:00',
    tags: ['ML', 'Assignment'],
    progress: 65,
    subtasks: [
      { id: 'st-001', title: 'Prepare dataset', completed: true },
      { id: 'st-002', title: 'Train models', completed: true },
      { id: 'st-003', title: 'Evaluate results', completed: false },
      { id: 'st-004', title: 'Write report', completed: false },
    ],
    reminder: true,
  },
  {
    id: 'task-002',
    title: 'Revise DBMS queries',
    description: 'Practice JOIN, GROUP BY and subqueries.',
    subjectId: 'sub-002',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-23',
    tags: ['DBMS', 'Revision'],
    progress: 0,
    subtasks: [],
  },
  {
    id: 'task-003',
    title: 'Build portfolio section',
    description: 'Implement the projects section of the portfolio.',
    subjectId: 'sub-003',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-25',
    tags: ['React', 'Portfolio'],
    progress: 40,
    subtasks: [],
    reminder: true,
  },
  {
    id: 'task-004',
    title: 'Submit software engineering report',
    description: 'Final report submission.',
    subjectId: 'sub-005',
    status: 'completed',
    priority: 'urgent',
    dueDate: '2026-09-20',
    tags: ['Report', 'Submission'],
    progress: 100,
    subtasks: [],
  },
];