export interface ExamData {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'midterm' | 'final' | 'quiz' | 'practical' | 'viva';
  syllabus: string[];
  status: 'upcoming' | 'completed';
}

export const exams: ExamData[] = [
  {
    id: 'exam-001',
    subjectId: 'sub-001',
    title: 'Machine Learning Midterm',
    date: '2026-09-28',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Block A - 204',
    type: 'midterm',
    syllabus: ['Regression', 'Classification', 'Decision Trees'],
    status: 'upcoming',
  },
  {
    id: 'exam-002',
    subjectId: 'sub-002',
    title: 'DBMS Quiz',
    date: '2026-09-30',
    startTime: '11:00',
    endTime: '12:00',
    room: 'Block B - 301',
    type: 'quiz',
    syllabus: ['SQL', 'Joins', 'Transactions'],
    status: 'upcoming',
  },
  {
    id: 'exam-003',
    subjectId: 'sub-003',
    title: 'Web Technologies Practical',
    date: '2026-10-03',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Web Lab - 01',
    type: 'practical',
    syllabus: ['React', 'TypeScript', 'API Integration'],
    status: 'upcoming',
  },
];