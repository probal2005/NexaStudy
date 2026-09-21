'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  User,
  Award,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Save,
  GraduationCap,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';

type Tab = 'subjects' | 'assignments' | 'exams' | 'attendance';

type AssignmentStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'overdue';

type Priority = 'low' | 'medium' | 'high';

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  credits: number;
  semester: number;
  color: string;
  notes: string;
  createdAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string | null;
  status: AssignmentStatus;
  deadline: string;
  priority: Priority;
  attachmentUrl: string | null;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

interface Exam {
  id: string;
  title: string;
  subjectId: string | null;
  date: string;
  time: string | null;
  venue: string | null;
  preparationProgress: number;
  notes: string;
  createdAt: string;
}

interface AttendanceRecord {
  id: string;
  subjectId: string;
  totalClasses: number;
  attended: number;
  absent: number;
  targetPercentage: number;
}

type ModalType =
  | 'subject'
  | 'assignment'
  | 'exam'
  | 'attendance'
  | null;

const STORAGE_KEYS = {
  subjects: 'nexastudy_subjects_v1',
  assignments: 'nexastudy_assignments_v1',
  exams: 'nexastudy_exams_v1',
  attendance: 'nexastudy_attendance_v1',
} as const;

const SUBJECT_COLORS = [
  '#4F46E5',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
];

const seedSubjects: Subject[] = [
  {
    id: 's1',
    name: 'Database Management Systems',
    code: 'CS 301',
    teacher: 'Course Instructor',
    credits: 4,
    semester: 5,
    color: '#4F46E5',
    notes: 'Focus on normalization, indexing, SQL queries and transactions.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 's2',
    name: 'Thermodynamics',
    code: 'PH 201',
    teacher: 'Course Instructor',
    credits: 4,
    semester: 5,
    color: '#F59E0B',
    notes: 'Study laws, processes, entropy and practical applications.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 's3',
    name: 'Calculus II',
    code: 'MA 202',
    teacher: 'Course Instructor',
    credits: 4,
    semester: 5,
    color: '#10B981',
    notes: 'Focus on integration techniques, sequences and series.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 's4',
    name: 'Physical Chemistry',
    code: 'CH 201',
    teacher: 'Course Instructor',
    credits: 3,
    semester: 5,
    color: '#EF4444',
    notes: 'Cover thermodynamics, kinetics and core chemistry concepts.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 's5',
    name: 'Microeconomics',
    code: 'EC 201',
    teacher: 'Course Instructor',
    credits: 3,
    semester: 5,
    color: '#EC4899',
    notes: 'Study market structures, pricing and basic economic models.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
];

const seedAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'DBMS Project - Query Optimization',
    description:
      'Implement and benchmark query optimization approaches and submit a performance analysis report.',
    subjectId: 's1',
    status: 'in_progress',
    deadline: '2026-09-22T23:59:00',
    priority: 'high',
    attachmentUrl: null,
    completionPercentage: 65,
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-18T14:30:00.000Z',
  },
  {
    id: 'a2',
    title: 'Physics Lab Report - Optics',
    description:
      'Prepare the optics lab report with observations, calculations and error analysis.',
    subjectId: 's2',
    status: 'not_started',
    deadline: '2026-09-23T17:00:00',
    priority: 'medium',
    attachmentUrl: null,
    completionPercentage: 0,
    createdAt: '2026-09-16T09:00:00.000Z',
    updatedAt: '2026-09-16T09:00:00.000Z',
  },
  {
    id: 'a3',
    title: 'Calculus Problem Set 4',
    description:
      'Solve the assigned integration problems with proper working and explanations.',
    subjectId: 's3',
    status: 'in_progress',
    deadline: '2026-09-25T23:59:00',
    priority: 'medium',
    attachmentUrl: null,
    completionPercentage: 30,
    createdAt: '2026-09-18T08:00:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'a4',
    title: 'Chemistry Worksheet - Periodic Trends',
    description:
      'Complete the periodic trends worksheet with detailed explanations.',
    subjectId: 's4',
    status: 'submitted',
    deadline: '2026-09-18T11:59:00',
    priority: 'low',
    attachmentUrl: null,
    completionPercentage: 100,
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-17T22:00:00.000Z',
  },
  {
    id: 'a5',
    title: 'Economics Essay - Market Structures',
    description:
      'Write an essay comparing major market structures and their characteristics.',
    subjectId: 's5',
    status: 'overdue',
    deadline: '2026-09-16T23:59:00',
    priority: 'high',
    attachmentUrl: null,
    completionPercentage: 10,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
];

const seedExams: Exam[] = [
  {
    id: 'e1',
    title: 'DBMS Mid-term Exam',
    subjectId: 's1',
    date: '2026-10-01',
    time: '09:00',
    venue: 'Room 301, Block A',
    preparationProgress: 40,
    notes: 'Focus on SQL queries, normalization and indexing.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'e2',
    title: 'Thermodynamics Final',
    subjectId: 's2',
    date: '2026-10-15',
    time: '14:00',
    venue: 'Main Hall',
    preparationProgress: 25,
    notes: 'Review all major laws and applications.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'e3',
    title: 'Calculus II Mid-term',
    subjectId: 's3',
    date: '2026-09-24',
    time: '10:00',
    venue: 'Room 205, Block B',
    preparationProgress: 55,
    notes: 'Chapters 1-6 with emphasis on integration and series.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
];

const seedAttendance: AttendanceRecord[] = [
  {
    id: 'at1',
    subjectId: 's1',
    totalClasses: 24,
    attended: 22,
    absent: 2,
    targetPercentage: 75,
  },
  {
    id: 'at2',
    subjectId: 's2',
    totalClasses: 20,
    attended: 17,
    absent: 3,
    targetPercentage: 75,
  },
  {
    id: 'at3',
    subjectId: 's3',
    totalClasses: 18,
    attended: 14,
    absent: 4,
    targetPercentage: 75,
  },
  {
    id: 'at4',
    subjectId: 's4',
    totalClasses: 16,
    attended: 13,
    absent: 3,
    targetPercentage: 75,
  },
  {
    id: 'at5',
    subjectId: 's5',
    totalClasses: 14,
    attended: 11,
    absent: 3,
    targetPercentage: 75,
  },
];

const statusColors: Record<
  AssignmentStatus,
  { bg: string; text: string; border: string }
> = {
  not_started: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
  in_progress: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  submitted: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  overdue: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

const statusLabels: Record<AssignmentStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  completed: 'Completed',
  overdue: 'Overdue',
};

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage may be unavailable or full.
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatExamDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysUntil(value: string) {
  const target = new Date(`${value}T23:59:59`);
  const today = new Date();

  target.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function getAttendancePercentage(record: AttendanceRecord) {
  if (record.totalClasses <= 0) {
    return 0;
  }

  return (record.attended / record.totalClasses) * 100;
}

function getRequiredClasses(
  attended: number,
  totalClasses: number,
  targetPercentage: number,
) {
  if (totalClasses <= 0) {
    return 0;
  }

  if (attended / totalClasses >= targetPercentage / 100) {
    return 0;
  }

  let additionalClasses = 0;

  while (
    (attended + additionalClasses) /
      (totalClasses + additionalClasses) <
    targetPercentage / 100
  ) {
    additionalClasses += 1;

    if (additionalClasses > 1000) {
      break;
    }
  }

  return additionalClasses;
}

function getProjectedAttendance(
  record: AttendanceRecord,
  additionalAttended: number,
) {
  const futureTotal = record.totalClasses + additionalAttended;
  const futureAttended = record.attended + additionalAttended;

  if (futureTotal <= 0) {
    return 0;
  }

  return (futureAttended / futureTotal) * 100;
}

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<Tab>('subjects');

  const [subjects, setSubjects] = useState<Subject[]>(seedSubjects);
  const [assignments, setAssignments] =
    useState<Assignment[]>(seedAssignments);
  const [exams, setExams] = useState<Exam[]>(seedExams);
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(seedAttendance);

  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState('');
  const [assignmentFilter, setAssignmentFilter] =
    useState<'all' | AssignmentStatus>('all');

  const [expandedSubject, setExpandedSubject] =
    useState<string | null>(null);

  const [modal, setModal] = useState<ModalType>(null);
  const [editingSubjectId, setEditingSubjectId] =
    useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] =
    useState<string | null>(null);
  const [editingExamId, setEditingExamId] =
    useState<string | null>(null);

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    teacher: '',
    credits: '3',
    semester: '5',
    color: SUBJECT_COLORS[0],
    notes: '',
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subjectId: '',
    status: 'not_started' as AssignmentStatus,
    deadline: '',
    priority: 'medium' as Priority,
    completionPercentage: '0',
  });

  const [examForm, setExamForm] = useState({
    title: '',
    subjectId: '',
    date: '',
    time: '',
    venue: '',
    preparationProgress: '0',
    notes: '',
  });

  const [attendanceForm, setAttendanceForm] = useState({
    subjectId: '',
    totalClasses: '0',
    attended: '0',
    absent: '0',
    targetPercentage: '75',
  });

  useEffect(() => {
    setSubjects(safeRead(STORAGE_KEYS.subjects, seedSubjects));
    setAssignments(safeRead(STORAGE_KEYS.assignments, seedAssignments));
    setExams(safeRead(STORAGE_KEYS.exams, seedExams));
    setAttendance(safeRead(STORAGE_KEYS.attendance, seedAttendance));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveData(STORAGE_KEYS.subjects, subjects);
  }, [subjects, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveData(STORAGE_KEYS.assignments, assignments);
  }, [assignments, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveData(STORAGE_KEYS.exams, exams);
  }, [exams, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveData(STORAGE_KEYS.attendance, attendance);
  }, [attendance, hydrated]);

  const subjectMap = useMemo(
    () => new Map(subjects.map(subject => [subject.id, subject])),
    [subjects],
  );

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return subjects;
    }

    return subjects.filter(subject =>
      [
        subject.name,
        subject.code,
        subject.teacher,
        subject.notes,
      ].some(value => value.toLowerCase().includes(query)),
    );
  }, [subjects, search]);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments
      .filter(assignment => {
        if (
          assignmentFilter !== 'all' &&
          assignment.status !== assignmentFilter
        ) {
          return false;
        }

        if (!query) {
          return true;
        }

        const subject = assignment.subjectId
          ? subjectMap.get(assignment.subjectId)
          : undefined;

        return [
          assignment.title,
          assignment.description,
          subject?.name ?? '',
          subject?.code ?? '',
        ].some(value => value.toLowerCase().includes(query));
      })
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime(),
      );
  }, [assignments, assignmentFilter, search, subjectMap]);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...exams]
      .filter(exam => {
        if (!query) {
          return true;
        }

        const subject = exam.subjectId
          ? subjectMap.get(exam.subjectId)
          : undefined;

        return [
          exam.title,
          exam.notes,
          exam.venue ?? '',
          subject?.name ?? '',
          subject?.code ?? '',
        ].some(value => value.toLowerCase().includes(query));
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [exams, search, subjectMap]);

  const overdueCount = useMemo(
    () =>
      assignments.filter(assignment => {
        const deadlinePassed =
          new Date(assignment.deadline).getTime() < Date.now();

        return (
          deadlinePassed &&
          assignment.status !== 'completed' &&
          assignment.status !== 'submitted'
        );
      }).length,
    [assignments],
  );

  const completedCount = useMemo(
    () =>
      assignments.filter(
        assignment => assignment.status === 'completed',
      ).length,
    [assignments],
  );

  const upcomingExamCount = useMemo(
    () =>
      exams.filter(exam => {
        const days = daysUntil(exam.date);
        return days >= 0 && days <= 14;
      }).length,
    [exams],
  );

  const overallAttendance = useMemo(() => {
    const totalClasses = attendance.reduce(
      (sum, record) => sum + Math.max(0, record.totalClasses),
      0,
    );

    const attendedClasses = attendance.reduce(
      (sum, record) => sum + Math.max(0, record.attended),
      0,
    );

    if (totalClasses === 0) {
      return 0;
    }

    return (attendedClasses / totalClasses) * 100;
  }, [attendance]);

  const atRiskSubjects = useMemo(() => {
    return attendance.filter(record => {
      const percentage = getAttendancePercentage(record);

      return percentage < record.targetPercentage;
    });
  }, [attendance]);

  function openNewSubject() {
    setEditingSubjectId(null);
    setSubjectForm({
      name: '',
      code: '',
      teacher: '',
      credits: '3',
      semester: '5',
      color: SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length],
      notes: '',
    });
    setModal('subject');
  }

  function openEditSubject(subject: Subject) {
    setEditingSubjectId(subject.id);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      teacher: subject.teacher,
      credits: String(subject.credits),
      semester: String(subject.semester),
      color: subject.color,
      notes: subject.notes,
    });
    setModal('subject');
  }

  function deleteSubject(subjectId: string) {
    const subject = subjectMap.get(subjectId);

    if (!subject) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${subject.name}"? Related assignments, exams and attendance records will remain but become unlinked.`,
    );

    if (!confirmed) {
      return;
    }

    setSubjects(current =>
      current.filter(item => item.id !== subjectId),
    );

    setAssignments(current =>
      current.map(item =>
        item.subjectId === subjectId
          ? { ...item, subjectId: null }
          : item,
      ),
    );

    setExams(current =>
      current.map(item =>
        item.subjectId === subjectId
          ? { ...item, subjectId: null }
          : item,
      ),
    );

    setAttendance(current =>
      current.filter(item => item.subjectId !== subjectId),
    );

    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    }
  }

  function handleSubjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = subjectForm.name.trim();
    const code = subjectForm.code.trim();

    if (!name || !code) {
      window.alert('Subject name and subject code are required.');
      return;
    }

    const credits = Number(subjectForm.credits);
    const semester = Number(subjectForm.semester);

    if (
      !Number.isFinite(credits) ||
      credits <= 0 ||
      credits > 20 ||
      !Number.isInteger(semester) ||
      semester <= 0 ||
      semester > 20
    ) {
      window.alert('Enter valid credits and semester values.');
      return;
    }

    if (editingSubjectId) {
      setSubjects(current =>
        current.map(subject =>
          subject.id === editingSubjectId
            ? {
                ...subject,
                name,
                code,
                teacher: subjectForm.teacher.trim(),
                credits,
                semester,
                color: subjectForm.color,
                notes: subjectForm.notes.trim(),
              }
            : subject,
        ),
      );
    } else {
      const newSubject: Subject = {
        id: generateId('subject'),
        name,
        code,
        teacher: subjectForm.teacher.trim(),
        credits,
        semester,
        color: subjectForm.color,
        notes: subjectForm.notes.trim(),
        createdAt: new Date().toISOString(),
      };

      setSubjects(current => [newSubject, ...current]);

      setAttendance(current => [
        ...current,
        {
          id: generateId('attendance'),
          subjectId: newSubject.id,
          totalClasses: 0,
          attended: 0,
          absent: 0,
          targetPercentage: 75,
        },
      ]);
    }

    setModal(null);
  }

  function openNewAssignment() {
    setEditingAssignmentId(null);

    setAssignmentForm({
      title: '',
      description: '',
      subjectId: subjects[0]?.id ?? '',
      status: 'not_started',
      deadline: '',
      priority: 'medium',
      completionPercentage: '0',
    });

    setModal('assignment');
  }

  function openEditAssignment(assignment: Assignment) {
    setEditingAssignmentId(assignment.id);

    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      subjectId: assignment.subjectId ?? '',
      status: assignment.status,
      deadline: assignment.deadline.slice(0, 16),
      priority: assignment.priority,
      completionPercentage: String(assignment.completionPercentage),
    });

    setModal('assignment');
  }

  function deleteAssignment(id: string) {
    if (!window.confirm('Delete this assignment?')) {
      return;
    }

    setAssignments(current =>
      current.filter(assignment => assignment.id !== id),
    );
  }

  function handleAssignmentSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title = assignmentForm.title.trim();

    if (!title || !assignmentForm.deadline) {
      window.alert('Assignment title and deadline are required.');
      return;
    }

    const completion = clamp(
      Number(assignmentForm.completionPercentage) || 0,
    );

    let status = assignmentForm.status;

    if (completion >= 100) {
      status = 'completed';
    } else if (
      status === 'completed' &&
      completion < 100
    ) {
      status = 'in_progress';
    }

    const deadline = new Date(assignmentForm.deadline);

    if (Number.isNaN(deadline.getTime())) {
      window.alert('Please enter a valid deadline.');
      return;
    }

    if (editingAssignmentId) {
      setAssignments(current =>
        current.map(assignment =>
          assignment.id === editingAssignmentId
            ? {
                ...assignment,
                title,
                description: assignmentForm.description.trim(),
                subjectId:
                  assignmentForm.subjectId || null,
                status,
                deadline: deadline.toISOString(),
                priority: assignmentForm.priority,
                completionPercentage: completion,
                updatedAt: new Date().toISOString(),
              }
            : assignment,
        ),
      );
    } else {
      const newAssignment: Assignment = {
        id: generateId('assignment'),
        title,
        description: assignmentForm.description.trim(),
        subjectId: assignmentForm.subjectId || null,
        status,
        deadline: deadline.toISOString(),
        priority: assignmentForm.priority,
        attachmentUrl: null,
        completionPercentage: completion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAssignments(current => [newAssignment, ...current]);
    }

    setModal(null);
  }

  function openNewExam() {
    setEditingExamId(null);

    setExamForm({
      title: '',
      subjectId: subjects[0]?.id ?? '',
      date: '',
      time: '',
      venue: '',
      preparationProgress: '0',
      notes: '',
    });

    setModal('exam');
  }

  function openEditExam(exam: Exam) {
    setEditingExamId(exam.id);

    setExamForm({
      title: exam.title,
      subjectId: exam.subjectId ?? '',
      date: exam.date,
      time: exam.time ?? '',
      venue: exam.venue ?? '',
      preparationProgress: String(exam.preparationProgress),
      notes: exam.notes,
    });

    setModal('exam');
  }

  function deleteExam(id: string) {
    if (!window.confirm('Delete this exam?')) {
      return;
    }

    setExams(current => current.filter(exam => exam.id !== id));
  }

  function handleExamSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!examForm.title.trim() || !examForm.date) {
      window.alert('Exam title and date are required.');
      return;
    }

    const progress = clamp(
      Number(examForm.preparationProgress) || 0,
    );

    if (editingExamId) {
      setExams(current =>
        current.map(exam =>
          exam.id === editingExamId
            ? {
                ...exam,
                title: examForm.title.trim(),
                subjectId: examForm.subjectId || null,
                date: examForm.date,
                time: examForm.time || null,
                venue: examForm.venue.trim() || null,
                preparationProgress: progress,
                notes: examForm.notes.trim(),
              }
            : exam,
        ),
      );
    } else {
      const newExam: Exam = {
        id: generateId('exam'),
        title: examForm.title.trim(),
        subjectId: examForm.subjectId || null,
        date: examForm.date,
        time: examForm.time || null,
        venue: examForm.venue.trim() || null,
        preparationProgress: progress,
        notes: examForm.notes.trim(),
        createdAt: new Date().toISOString(),
      };

      setExams(current => [newExam, ...current]);
    }

    setModal(null);
  }

  function openAttendance(record: AttendanceRecord) {
    setAttendanceForm({
      subjectId: record.subjectId,
      totalClasses: String(record.totalClasses),
      attended: String(record.attended),
      absent: String(record.absent),
      targetPercentage: String(record.targetPercentage),
    });

    setModal('attendance');
  }

  function handleAttendanceSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const total = Math.max(
      0,
      Math.floor(Number(attendanceForm.totalClasses) || 0),
    );

    const attended = Math.max(
      0,
      Math.floor(Number(attendanceForm.attended) || 0),
    );

    const absent = Math.max(
      0,
      Math.floor(Number(attendanceForm.absent) || 0),
    );

    const target = clamp(
      Number(attendanceForm.targetPercentage) || 75,
      0,
      100,
    );

    if (attended + absent > total) {
      window.alert(
        'Attended + absent classes cannot be greater than total classes.',
      );
      return;
    }

    const subjectId = attendanceForm.subjectId;

    if (!subjectId) {
      window.alert('Please select a subject.');
      return;
    }

    setAttendance(current => {
      const exists = current.some(
        record => record.subjectId === subjectId,
      );

      if (exists) {
        return current.map(record =>
          record.subjectId === subjectId
            ? {
                ...record,
                totalClasses: total,
                attended,
                absent,
                targetPercentage: target,
              }
            : record,
        );
      }

      return [
        ...current,
        {
          id: generateId('attendance'),
          subjectId,
          totalClasses: total,
          attended,
          absent,
          targetPercentage: target,
        },
      ];
    });

    setModal(null);
  }

  function resetAcademicData() {
    const confirmed = window.confirm(
      'Reset all Subjects, Assignments, Exams and Attendance to the default demo data?',
    );

    if (!confirmed) {
      return;
    }

    setSubjects(seedSubjects);
    setAssignments(seedAssignments);
    setExams(seedExams);
    setAttendance(seedAttendance);
    setSearch('');
    setAssignmentFilter('all');
    setExpandedSubject(null);
  }

  function getSubjectName(subjectId: string | null) {
    if (!subjectId) {
      return 'Unassigned';
    }

    return subjectMap.get(subjectId)?.name ?? 'Unknown subject';
  }

  function getSubjectColor(subjectId: string | null) {
    if (!subjectId) {
      return '#6B7280';
    }

    return subjectMap.get(subjectId)?.color ?? '#6B7280';
  }

  const tabs: { id: Tab; label: string; icon: typeof BookMarked }[] =
    [
      { id: 'subjects', label: 'Subjects', icon: BookMarked },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList },
      { id: 'exams', label: 'Exams', icon: GraduationCap },
      { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-primary" />
            <h1 className="text-2xl font-bold">
              Academic Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {subjects.length} subjects · {overdueCount} overdue ·{' '}
            {upcomingExamCount} exams in the next 14 days
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAcademicData}
            className="gap-2"
          >
            <RefreshCw size={14} />
            Reset Demo
          </Button>

          {activeTab === 'subjects' && (
            <Button onClick={openNewSubject} className="gap-2">
              <Plus size={15} />
              Add Subject
            </Button>
          )}

          {activeTab === 'assignments' && (
            <Button onClick={openNewAssignment} className="gap-2">
              <Plus size={15} />
              Add Assignment
            </Button>
          )}

          {activeTab === 'exams' && (
            <Button onClick={openNewExam} className="gap-2">
              <Plus size={15} />
              Add Exam
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
              <BookMarked size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{subjects.length}</p>
              <p className="text-xs text-muted-foreground">
                Subjects
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
              <AlertCircle size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{overdueCount}</p>
              <p className="text-xs text-muted-foreground">
                Overdue
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
              <Award size={18} />
            </div>

            <div>
              <p className="text-2xl font-bold">{exams.length}</p>
              <p className="text-xs text-muted-foreground">
                Exams
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="pl-9"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted/50 p-1 sm:grid-cols-4">
        {tabs.map(tab => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSearch('');
              }}
              className={cn(
                'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subjects */}
      {activeTab === 'subjects' && (
        <div className="min-h-0 flex-1 overflow-auto">
          {filteredSubjects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookMarked
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <h3 className="font-semibold">No subjects found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search or add a new subject.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSubjects.map(subject => {
                const isExpanded =
                  expandedSubject === subject.id;

                const subjectAssignments = assignments.filter(
                  assignment =>
                    assignment.subjectId === subject.id,
                );

                const subjectExamCount = exams.filter(
                  exam => exam.subjectId === subject.id,
                ).length;

                const subjectAttendanceRecord =
                  attendance.find(
                    record =>
                      record.subjectId === subject.id,
                  );

                const attendancePercentage =
                  subjectAttendanceRecord
                    ? getAttendancePercentage(
                        subjectAttendanceRecord,
                      )
                    : 0;

                return (
                  <Card
                    key={subject.id}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubject(
                            isExpanded ? null : subject.id,
                          )
                        }
                        className="flex w-full items-center gap-4 text-left"
                      >
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                          style={{
                            backgroundColor: subject.color,
                          }}
                        >
                          {subject.code.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {subject.name}
                            </h3>

                            <Badge variant="outline">
                              {subject.code}
                            </Badge>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {subject.teacher || 'Instructor not added'}{' '}
                            · {subject.credits} credits · Semester{' '}
                            {subject.semester}
                          </p>
                        </div>

                        <div className="hidden items-center gap-2 sm:flex">
                          <Badge
                            style={{
                              backgroundColor: subject.color,
                              color: 'white',
                            }}
                          >
                            Sem {subject.semester}
                          </Badge>
                        </div>

                        <ChevronRight
                          size={18}
                          className={cn(
                            'shrink-0 text-muted-foreground transition-transform',
                            isExpanded && 'rotate-90',
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 border-t border-border pt-4">
                          <p className="mb-4 text-sm text-muted-foreground">
                            {subject.notes ||
                              'No subject notes added.'}
                          </p>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-lg bg-muted/50 p-3">
                              <p className="text-xs text-muted-foreground">
                                Credits
                              </p>
                              <p className="mt-1 text-lg font-bold">
                                {subject.credits}
                              </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3">
                              <p className="text-xs text-muted-foreground">
                                Assignments
                              </p>
                              <p className="mt-1 text-lg font-bold">
                                {subjectAssignments.length}
                              </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3">
                              <p className="text-xs text-muted-foreground">
                                Exams
                              </p>
                              <p className="mt-1 text-lg font-bold">
                                {subjectExamCount}
                              </p>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3">
                              <p className="text-xs text-muted-foreground">
                                Attendance
                              </p>
                              <p
                                className={cn(
                                  'mt-1 text-lg font-bold',
                                  attendancePercentage >= 75
                                    ? 'text-green-600'
                                    : 'text-red-600',
                                )}
                              >
                                {attendancePercentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openEditSubject(subject)
                              }
                              className="gap-1"
                            >
                              <Edit3 size={13} />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab('assignments');
                                setSearch(subject.name);
                              }}
                              className="gap-1"
                            >
                              <ClipboardList size={13} />
                              Tasks
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab('exams');
                                setSearch(subject.name);
                              }}
                              className="gap-1"
                            >
                              <Award size={13} />
                              Exams
                            </Button>

                            {subjectAttendanceRecord && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openAttendance(
                                    subjectAttendanceRecord,
                                  )
                                }
                                className="gap-1"
                              >
                                <CheckCircle2 size={13} />
                                Attendance
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deleteSubject(subject.id)
                              }
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={13} />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Assignments */}
      {activeTab === 'assignments' && (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
            {(
              [
                'all',
                'not_started',
                'in_progress',
                'submitted',
                'completed',
                'overdue',
              ] as const
            ).map(status => {
              const count =
                status === 'all'
                  ? assignments.length
                  : assignments.filter(
                      assignment =>
                        assignment.status === status,
                    ).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setAssignmentFilter(status)
                  }
                  className={cn(
                    'shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                    assignmentFilter === status
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {status === 'all'
                    ? 'All'
                    : statusLabels[status]}
                  <span className="ml-1 opacity-60">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <h3 className="font-semibold">
                  No assignments found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Change the filter or add a new assignment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map(assignment => {
                const subject = assignment.subjectId
                  ? subjectMap.get(assignment.subjectId)
                  : undefined;

                const deadlinePassed =
                  new Date(assignment.deadline).getTime() <
                  Date.now();

                const isOverdue =
                  deadlinePassed &&
                  assignment.status !== 'completed' &&
                  assignment.status !== 'submitted';

                const color =
                  subject?.color ?? '#6B7280';

                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: color,
                          }}
                        >
                          <span className="text-sm font-bold text-white">
                            {subject?.code.charAt(0) ?? '?'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {assignment.title}
                            </h3>

                            {isOverdue && (
                              <Badge className="bg-red-100 text-[10px] text-red-700">
                                Overdue
                              </Badge>
                            )}

                            <Badge
                              className={cn(
                                'text-[10px]',
                                statusColors[
                                  assignment.status
                                ].bg,
                                statusColors[
                                  assignment.status
                                ].text,
                                statusColors[
                                  assignment.status
                                ].border,
                              )}
                            >
                              {
                                statusLabels[
                                  assignment.status
                                ]
                              }
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {subject?.name ??
                              'No subject assigned'}
                          </p>

                          {assignment.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {assignment.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                            <span
                              className={cn(
                                'flex items-center gap-1',
                                isOverdue
                                  ? 'font-medium text-red-600'
                                  : 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon size={12} />
                              Due {formatDate(
                                assignment.deadline,
                              )}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock size={12} />
                              {assignment.completionPercentage}%
                              complete
                            </span>

                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize"
                            >
                              {assignment.priority} priority
                            </Badge>
                          </div>

                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {assignment.completionPercentage}%
                              </span>
                            </div>

                            <ProgressBar
                              value={
                                assignment.completionPercentage
                              }
                              max={100}
                            />
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditAssignment(
                                assignment,
                              )
                            }
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Edit assignment"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteAssignment(
                                assignment.id,
                              )
                            }
                            className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete assignment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Exams */}
      {activeTab === 'exams' && (
        <div className="min-h-0 flex-1 overflow-auto">
          {filteredExams.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <GraduationCap
                  size={32}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <h3 className="font-semibold">
                  No exams found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an exam to start tracking preparation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredExams.map(exam => {
                const subject = exam.subjectId
                  ? subjectMap.get(exam.subjectId)
                  : undefined;

                const daysLeft = daysUntil(exam.date);
                const isPast = daysLeft < 0;
                const isUrgent =
                  !isPast && daysLeft <= 7;

                return (
                  <Card key={exam.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
                          <GraduationCap size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {exam.title}
                            </h3>

                            {isPast ? (
                              <Badge className="bg-gray-100 text-[10px] text-gray-700">
                                Past
                              </Badge>
                            ) : isUrgent ? (
                              <Badge className="bg-red-100 text-[10px] text-red-700">
                                {daysLeft === 0
                                  ? 'Today'
                                  : `${daysLeft} day${
                                      daysLeft === 1
                                        ? ''
                                        : 's'
                                    }`}
                              </Badge>
                            ) : null}
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {subject?.name ??
                              'No subject assigned'}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={12} />
                              {formatExamDate(exam.date)}
                            </span>

                            {exam.time && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {exam.time}
                              </span>
                            )}

                            {exam.venue && (
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {exam.venue}
                              </span>
                            )}
                          </div>

                          {exam.notes && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {exam.notes}
                            </p>
                          )}

                          <div className="mt-4">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Preparation
                              </span>

                              <span className="font-medium">
                                {exam.preparationProgress}%
                              </span>
                            </div>

                            <ProgressBar
                              value={
                                exam.preparationProgress
                              }
                              max={100}
                            />

                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {isPast
                                ? 'Exam date has passed.'
                                : daysLeft === 0
                                  ? 'Exam is today.'
                                  : `${daysLeft} days remaining`}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditExam(exam)
                            }
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Edit exam"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteExam(exam.id)
                            }
                            className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete exam"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Attendance */}
      {activeTab === 'attendance' && (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">
                  {overallAttendance.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Overall Attendance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">
                  {attendance.reduce(
                    (sum, record) => sum + record.attended,
                    0,
                  )}{' '}
                  /{' '}
                  {attendance.reduce(
                    (sum, record) =>
                      sum + record.totalClasses,
                    0,
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Classes Attended
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">
                  {attendance.reduce(
                    (sum, record) => sum + record.absent,
                    0,
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Classes Absent
                </p>
              </CardContent>
            </Card>
          </div>

          {atRiskSubjects.length > 0 && (
            <Card className="mt-4 border-red-200 bg-red-50/50 dark:border-red-800/30 dark:bg-red-950/20">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                  <AlertCircle size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {atRiskSubjects.length} subject
                    {atRiskSubjects.length === 1 ? '' : 's'}{' '}
                    below the attendance target
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Update attendance regularly so the projected
                    requirement stays accurate.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 grid gap-4">
            {subjects.map(subject => {
              const record = attendance.find(
                item => item.subjectId === subject.id,
              );

              if (!record) {
                return (
                  <Card key={subject.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            No attendance record yet.
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openAttendance({
                              id: '',
                              subjectId: subject.id,
                              totalClasses: 0,
                              attended: 0,
                              absent: 0,
                              targetPercentage: 75,
                            })
                          }
                        >
                          Add Record
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              const percentage =
                getAttendancePercentage(record);

              const requiredClasses = getRequiredClasses(
                record.attended,
                record.totalClasses,
                record.targetPercentage,
              );

              const projected =
                getProjectedAttendance(
                  record,
                  requiredClasses,
                );

              const healthy =
                percentage >= record.targetPercentage;

              return (
                <Card key={subject.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                        style={{
                          backgroundColor: subject.color,
                        }}
                      >
                        {subject.code.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {subject.name}
                          </h3>

                          <Badge variant="outline">
                            {subject.code}
                          </Badge>

                          <Badge
                            className={cn(
                              healthy
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700',
                            )}
                          >
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {subject.teacher || 'Instructor not added'}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Attended
                            </p>
                            <p className="font-semibold">
                              {record.attended}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Absent
                            </p>
                            <p className="font-semibold">
                              {record.absent}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>
                            <p className="font-semibold">
                              {record.totalClasses}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Target
                            </p>
                            <p className="font-semibold">
                              {record.targetPercentage}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <ProgressBar
                            value={clamp(percentage)}
                            max={100}
                            showLabel
                            color={
                              healthy ? 'success' : 'error'
                            }
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {healthy ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 size={12} />
                              Target maintained
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertCircle size={12} />
                              Attend {requiredClasses} more
                              consecutive classes to reach target
                            </span>
                          )}

                          {!healthy &&
                            requiredClasses > 0 && (
                              <span className="text-muted-foreground">
                                Projected: {projected.toFixed(1)}%
                              </span>
                            )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openAttendance(record)
                        }
                        className="shrink-0 gap-1"
                      >
                        <Edit3 size={13} />
                        <span className="hidden sm:inline">
                          Update
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Subject Modal */}
            {modal === 'subject' && (
              <form
                onSubmit={handleSubjectSubmit}
                className="p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {editingSubjectId
                        ? 'Edit Subject'
                        : 'Add Subject'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Manage your academic subject details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Subject Name
                    </label>
                    <Input
                      value={subjectForm.name}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Data Structures"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Subject Code
                    </label>
                    <Input
                      value={subjectForm.code}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          code: event.target.value,
                        }))
                      }
                      placeholder="e.g. CS 302"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Teacher
                    </label>
                    <Input
                      value={subjectForm.teacher}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          teacher: event.target.value,
                        }))
                      }
                      placeholder="Course instructor"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Credits
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={subjectForm.credits}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          credits: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Semester
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={subjectForm.semester}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          semester: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Color
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setSubjectForm(current => ({
                              ...current,
                              color,
                            }))
                          }
                          className={cn(
                            'h-8 w-8 rounded-full border-2 transition-transform',
                            subjectForm.color === color
                              ? 'scale-110 border-foreground'
                              : 'border-transparent',
                          )}
                          style={{
                            backgroundColor: color,
                          }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Notes
                    </label>

                    <textarea
                      value={subjectForm.notes}
                      onChange={event =>
                        setSubjectForm(current => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Topics, study focus, reminders..."
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="gap-2">
                    <Save size={14} />
                    {editingSubjectId
                      ? 'Save Changes'
                      : 'Create Subject'}
                  </Button>
                </div>
              </form>
            )}

            {/* Assignment Modal */}
            {modal === 'assignment' && (
              <form
                onSubmit={handleAssignmentSubmit}
                className="p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {editingAssignmentId
                        ? 'Edit Assignment'
                        : 'Add Assignment'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Track deadline, priority and progress.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Title
                    </label>
                    <Input
                      value={assignmentForm.title}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="e.g. DBMS Project"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Subject
                    </label>

                    <select
                      value={assignmentForm.subjectId}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          subjectId: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">
                        No subject
                      </option>

                      {subjects.map(subject => (
                        <option
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.code} — {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Deadline
                    </label>
                    <Input
                      type="datetime-local"
                      value={assignmentForm.deadline}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          deadline: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Status
                    </label>

                    <select
                      value={assignmentForm.status}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          status: event.target
                            .value as AssignmentStatus,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {(
                        Object.keys(
                          statusLabels,
                        ) as AssignmentStatus[]
                      ).map(status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Priority
                    </label>

                    <select
                      value={assignmentForm.priority}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          priority:
                            event.target.value as Priority,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Completion %
                    </label>

                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={assignmentForm.completionPercentage}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          completionPercentage:
                            event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Description
                    </label>

                    <textarea
                      value={assignmentForm.description}
                      onChange={event =>
                        setAssignmentForm(current => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="What needs to be completed?"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="gap-2">
                    <Save size={14} />
                    {editingAssignmentId
                      ? 'Save Changes'
                      : 'Create Assignment'}
                  </Button>
                </div>
              </form>
            )}

            {/* Exam Modal */}
            {modal === 'exam' && (
              <form
                onSubmit={handleExamSubmit}
                className="p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {editingExamId
                        ? 'Edit Exam'
                        : 'Add Exam'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Keep your exam schedule and preparation
                      progress together.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Exam Title
                    </label>

                    <Input
                      value={examForm.title}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="e.g. DBMS Mid-term"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Subject
                    </label>

                    <select
                      value={examForm.subjectId}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          subjectId: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">
                        No subject
                      </option>

                      {subjects.map(subject => (
                        <option
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.code} — {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Date
                    </label>

                    <Input
                      type="date"
                      value={examForm.date}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Time
                    </label>

                    <Input
                      type="time"
                      value={examForm.time}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          time: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Venue
                    </label>

                    <Input
                      value={examForm.venue}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          venue: event.target.value,
                        }))
                      }
                      placeholder="Room / Hall"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Preparation %
                    </label>

                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={
                        examForm.preparationProgress
                      }
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          preparationProgress:
                            event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Notes
                    </label>

                    <textarea
                      value={examForm.notes}
                      onChange={event =>
                        setExamForm(current => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Important topics, chapters, reminders..."
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="gap-2">
                    <Save size={14} />
                    {editingExamId
                      ? 'Save Changes'
                      : 'Create Exam'}
                  </Button>
                </div>
              </form>
            )}

            {/* Attendance Modal */}
            {modal === 'attendance' && (
              <form
                onSubmit={handleAttendanceSubmit}
                className="p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Update Attendance
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Enter the current class counts for the
                      selected subject.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Subject
                    </label>

                    <select
                      value={attendanceForm.subjectId}
                      onChange={event =>
                        setAttendanceForm(current => ({
                          ...current,
                          subjectId: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">
                        Select subject
                      </option>

                      {subjects.map(subject => (
                        <option
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.code} — {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Total Classes
                    </label>

                    <Input
                      type="number"
                      min={0}
                      value={
                        attendanceForm.totalClasses
                      }
                      onChange={event =>
                        setAttendanceForm(current => ({
                          ...current,
                          totalClasses: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Attended
                    </label>

                    <Input
                      type="number"
                      min={0}
                      value={attendanceForm.attended}
                      onChange={event =>
                        setAttendanceForm(current => ({
                          ...current,
                          attended: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Absent
                    </label>

                    <Input
                      type="number"
                      min={0}
                      value={attendanceForm.absent}
                      onChange={event =>
                        setAttendanceForm(current => ({
                          ...current,
                          absent: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Target %
                    </label>

                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={
                        attendanceForm.targetPercentage
                      }
                      onChange={event =>
                        setAttendanceForm(current => ({
                          ...current,
                          targetPercentage:
                            event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">
                    Tip:
                  </strong>{' '}
                  Keep Total = Attended + Absent for the most
                  accurate attendance record.
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="gap-2">
                    <Save size={14} />
                    Save Attendance
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {!hydrated && (
        <div className="fixed bottom-4 right-4 z-40 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground shadow-lg">
          Loading academic data…
        </div>
      )}
    </div>
  );
}