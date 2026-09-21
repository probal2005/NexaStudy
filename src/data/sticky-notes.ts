export interface StickyNoteData {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const stickyNotes: StickyNoteData[] = [
  {
    id: 'sticky-001',
    title: 'Important',
    content: 'Finish ML assignment before Thursday.',
    color: 'yellow',
    pinned: true,
    archived: false,
    createdAt: '2026-09-20T09:00:00',
    updatedAt: '2026-09-20T09:00:00',
  },
  {
    id: 'sticky-002',
    title: 'Project Idea',
    content: 'Add AI-powered study insights later.',
    color: 'blue',
    pinned: false,
    archived: false,
    createdAt: '2026-09-19T18:00:00',
    updatedAt: '2026-09-19T18:00:00',
  },
  {
    id: 'sticky-003',
    title: 'Reminder',
    content: 'Review DBMS before the quiz.',
    color: 'green',
    pinned: false,
    archived: false,
    createdAt: '2026-09-18T14:00:00',
    updatedAt: '2026-09-18T14:00:00',
  },
];