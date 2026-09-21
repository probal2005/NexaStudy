export type LibraryResourceType =
  | 'book'
  | 'pdf'
  | 'video'
  | 'article'
  | 'link';

export interface LibraryResourceData {
  id: string;
  title: string;
  description: string;
  type: LibraryResourceType;
  subjectId?: string;
  author?: string;
  url?: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

export const libraryResources: LibraryResourceData[] = [
  {
    id: 'resource-001',
    title: 'Hands-On Machine Learning',
    description: 'Reference book for practical machine learning.',
    type: 'book',
    subjectId: 'sub-001',
    author: 'Aurélien Géron',
    tags: ['ML', 'Python', 'Reference'],
    favorite: true,
    createdAt: '2026-09-10T10:00:00',
  },
  {
    id: 'resource-002',
    title: 'SQL Revision Notes',
    description: 'Quick reference for SQL concepts.',
    type: 'pdf',
    subjectId: 'sub-002',
    tags: ['SQL', 'DBMS'],
    favorite: true,
    createdAt: '2026-09-12T11:00:00',
  },
  {
    id: 'resource-003',
    title: 'React Documentation',
    description: 'Official React learning and API documentation.',
    type: 'link',
    subjectId: 'sub-003',
    url: 'https://react.dev/',
    tags: ['React', 'Documentation'],
    favorite: false,
    createdAt: '2026-09-15T12:00:00',
  },
];