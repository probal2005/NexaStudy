export interface AttendanceRecordData {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

export const attendanceRecords: AttendanceRecordData[] = [
  {
    id: 'att-001',
    subjectId: 'sub-001',
    date: '2026-09-18',
    status: 'present',
  },
  {
    id: 'att-002',
    subjectId: 'sub-002',
    date: '2026-09-18',
    status: 'present',
  },
  {
    id: 'att-003',
    subjectId: 'sub-003',
    date: '2026-09-17',
    status: 'late',
    note: 'Arrived 10 minutes late',
  },
  {
    id: 'att-004',
    subjectId: 'sub-004',
    date: '2026-09-17',
    status: 'absent',
    note: 'Personal leave',
  },
  {
    id: 'att-005',
    subjectId: 'sub-005',
    date: '2026-09-16',
    status: 'present',
  },
  {
    id: 'att-006',
    subjectId: 'sub-006',
    date: '2026-09-16',
    status: 'present',
  },
];