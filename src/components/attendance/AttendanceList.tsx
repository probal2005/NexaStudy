'use client';

import { AttendanceCard, AttendanceRecord } from './AttendanceCard';
import { AttendanceEmptyState } from './AttendanceEmptyState';

interface AttendanceListProps {
  records: AttendanceRecord[];
  filtered?: boolean;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (record: AttendanceRecord) => void;
  onAdd?: () => void;
}

export function AttendanceList({
  records,
  filtered = false,
  onEdit,
  onDelete,
  onAdd,
}: AttendanceListProps) {
  if (records.length === 0) {
    return (
      <AttendanceEmptyState
        filtered={filtered}
        onAdd={onAdd}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {records.map((record) => (
        <AttendanceCard
          key={record.id}
          record={record}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}