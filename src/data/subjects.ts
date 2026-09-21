export interface SubjectData {
  id: string;
  code: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
  credits: number;
  attendance: number;
  targetAttendance: number;
  currentGrade: string;
  gradePoint: number;
  weeklyHours: number;
}

export const subjects: SubjectData[] = [
  {
    id: 'sub-001',
    code: 'CSP-301',
    name: 'Machine Learning',
    teacher: 'Dr. Ananya Sharma',
    room: 'Block A - 204',
    color: '#6366f1',
    credits: 4,
    attendance: 86,
    targetAttendance: 75,
    currentGrade: 'A',
    gradePoint: 9,
    weeklyHours: 5,
  },
  {
    id: 'sub-002',
    code: 'CSP-302',
    name: 'Advanced Database Management',
    teacher: 'Dr. Rahul Verma',
    room: 'Block B - 301',
    color: '#0ea5e9',
    credits: 4,
    attendance: 82,
    targetAttendance: 75,
    currentGrade: 'A',
    gradePoint: 9,
    weeklyHours: 4,
  },
  {
    id: 'sub-003',
    code: 'CSP-303',
    name: 'Web Technologies',
    teacher: 'Prof. Neha Kapoor',
    room: 'Block C - 105',
    color: '#8b5cf6',
    credits: 3,
    attendance: 91,
    targetAttendance: 75,
    currentGrade: 'A+',
    gradePoint: 10,
    weeklyHours: 4,
  },
  {
    id: 'sub-004',
    code: 'CSP-304',
    name: 'Distributed Systems',
    teacher: 'Dr. Arjun Mehta',
    room: 'Block A - 305',
    color: '#f59e0b',
    credits: 3,
    attendance: 78,
    targetAttendance: 75,
    currentGrade: 'B+',
    gradePoint: 8,
    weeklyHours: 3,
  },
  {
    id: 'sub-005',
    code: 'CSP-305',
    name: 'Software Engineering',
    teacher: 'Prof. Priya Singh',
    room: 'Block B - 205',
    color: '#10b981',
    credits: 3,
    attendance: 88,
    targetAttendance: 75,
    currentGrade: 'A',
    gradePoint: 9,
    weeklyHours: 3,
  },
  {
    id: 'sub-006',
    code: 'CSP-306',
    name: 'Artificial Intelligence',
    teacher: 'Dr. Vikram Rao',
    room: 'AI Lab - 02',
    color: '#ec4899',
    credits: 4,
    attendance: 84,
    targetAttendance: 75,
    currentGrade: 'A',
    gradePoint: 9,
    weeklyHours: 5,
  },
];

export const subjectMap = Object.fromEntries(
  subjects.map((subject) => [subject.id, subject]),
);

export const subjectOptions = subjects.map((subject) => ({
  id: subject.id,
  label: `${subject.code} — ${subject.name}`,
}));