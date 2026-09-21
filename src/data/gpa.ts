export interface GpaCourseData {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterGpaData {
  id: string;
  semester: number;
  label: string;
  gpa: number;
  credits: number;
}

export const gpaCourses: GpaCourseData[] = [
  {
    id: 'gpa-course-001',
    code: 'CSP-301',
    name: 'Machine Learning',
    credits: 4,
    grade: 'A',
    gradePoint: 9,
  },
  {
    id: 'gpa-course-002',
    code: 'CSP-302',
    name: 'Advanced Database Management',
    credits: 4,
    grade: 'A',
    gradePoint: 9,
  },
  {
    id: 'gpa-course-003',
    code: 'CSP-303',
    name: 'Web Technologies',
    credits: 3,
    grade: 'A+',
    gradePoint: 10,
  },
  {
    id: 'gpa-course-004',
    code: 'CSP-304',
    name: 'Distributed Systems',
    credits: 3,
    grade: 'B+',
    gradePoint: 8,
  },
  {
    id: 'gpa-course-005',
    code: 'CSP-305',
    name: 'Software Engineering',
    credits: 3,
    grade: 'A',
    gradePoint: 9,
  },
];

export const semesterGpas: SemesterGpaData[] = [
  {
    id: 'semester-001',
    semester: 1,
    label: 'Semester 1',
    gpa: 8.2,
    credits: 24,
  },
  {
    id: 'semester-002',
    semester: 2,
    label: 'Semester 2',
    gpa: 8.5,
    credits: 24,
  },
  {
    id: 'semester-003',
    semester: 3,
    label: 'Semester 3',
    gpa: 8.7,
    credits: 24,
  },
  {
    id: 'semester-004',
    semester: 4,
    label: 'Semester 4',
    gpa: 8.9,
    credits: 24,
  },
];