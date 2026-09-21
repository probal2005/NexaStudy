'use client';

import { useSyncExternalStore } from 'react';

import type { AttendanceRecordData as AttendanceRecord } from '@/data/attendance';

export interface AttendanceState {
  records: AttendanceRecord[];
  subjectId: string;
  status: string;
  search: string;
  loading: boolean;
}

let state: AttendanceState = {
  records: [],
  subjectId: 'all',
  status: 'all',
  search: '',
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<AttendanceState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const attendanceStore = {
  getState(): AttendanceState {
    return state;
  },

  setRecords(records: AttendanceRecord[]) {
    update({ records });
  },

  addRecord(record: AttendanceRecord) {
    update({
      records: [record, ...state.records],
    });
  },

  updateRecord(
    id: string,
    updates: Partial<AttendanceRecord>,
  ) {
    update({
      records: state.records.map((record) =>
        record.id === id
          ? { ...record, ...updates }
          : record,
      ),
    });
  },

  removeRecord(id: string) {
    update({
      records: state.records.filter(
        (record) => record.id !== id,
      ),
    });
  },

  setSubjectId(subjectId: string) {
    update({ subjectId });
  },

  setStatus(status: string) {
    update({ status });
  },

  setSearch(search: string) {
    update({ search });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

const getServerSnapshot = () => state;

export function useAttendanceStore(): AttendanceState {
  return useSyncExternalStore(
    attendanceStore.subscribe,
    attendanceStore.getState,
    getServerSnapshot,
  );
}