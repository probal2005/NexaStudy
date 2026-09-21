import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { AttendanceRecordData as AttendanceRecord } from '@/data/attendance';

const STORAGE_KEY = 'nexastudy_attendance_v1';

export async function getAttendance(): Promise<
  AttendanceRecord[]
> {
  return getStorageItem<AttendanceRecord[]>(
    STORAGE_KEY,
    [],
  );
}

export async function createAttendanceRecord(
  record: AttendanceRecord,
): Promise<AttendanceRecord> {
  const records = await getAttendance();

  setStorageItem(STORAGE_KEY, [
    record,
    ...records,
  ]);

  return record;
}

export async function updateAttendanceRecord(
  id: string,
  updates: Partial<AttendanceRecord>,
): Promise<AttendanceRecord | null> {
  const records = await getAttendance();

  const index = records.findIndex(
    (record) => record.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...records[index],
    ...updates,
  };

  records[index] = updated;

  setStorageItem(STORAGE_KEY, records);

  return updated;
}

export async function deleteAttendanceRecord(
  id: string,
): Promise<boolean> {
  const records = await getAttendance();

  const filtered = records.filter(
    (record) => record.id !== id,
  );

  if (filtered.length === records.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}