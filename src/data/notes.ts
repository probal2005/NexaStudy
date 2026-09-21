export interface NoteData {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notes: NoteData[] = [
  {
    id: 'note-001',
    title: 'Machine Learning — Decision Trees',
    content:
      'Decision trees recursively split data using features that provide the best information gain or impurity reduction.',
    subjectId: 'sub-001',
    tags: ['ML', 'Decision Tree'],
    pinned: true,
    createdAt: '2026-09-18T10:00:00',
    updatedAt: '2026-09-20T15:30:00',
  },
  {
    id: 'note-002',
    title: 'SQL JOIN Quick Revision',
    content:
      'INNER JOIN returns matching records. LEFT JOIN keeps all records from the left table.',
    subjectId: 'sub-002',
    tags: ['SQL', 'Revision'],
    pinned: false,
    createdAt: '2026-09-19T12:00:00',
    updatedAt: '2026-09-19T12:00:00',
  },
  {
    id: 'note-003',
    title: 'React Hooks',
    content:
      'useState manages local state while useEffect handles synchronization with external systems.',
    subjectId: 'sub-003',
    tags: ['React', 'Hooks'],
    pinned: true,
    createdAt: '2026-09-17T09:00:00',
    updatedAt: '2026-09-18T09:30:00',
  },
];