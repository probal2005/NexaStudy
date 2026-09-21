'use client';

import { useSyncExternalStore } from 'react';

import type { SemesterGpaData as GpaSemester } from '@/data/gpa';

export interface GpaState {
  semesters: GpaSemester[];
  selectedSemesterId: string | null;
  loading: boolean;
}

let state: GpaState = {
  semesters: [],
  selectedSemesterId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<GpaState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const gpaStore = {
  getState(): GpaState {
    return state;
  },

  setSemesters(
    semesters: GpaSemester[],
  ) {
    update({ semesters });
  },

  addSemester(
    semester: GpaSemester,
  ) {
    update({
      semesters: [
        semester,
        ...state.semesters,
      ],
    });
  },

  updateSemester(
    id: string,
    updates: Partial<GpaSemester>,
  ) {
    update({
      semesters: state.semesters.map(
        (semester) =>
          semester.id === id
            ? {
                ...semester,
                ...updates,
              }
            : semester,
      ),
    });
  },

  removeSemester(id: string) {
    update({
      semesters: state.semesters.filter(
        (semester) =>
          semester.id !== id,
      ),
      selectedSemesterId:
        state.selectedSemesterId === id
          ? null
          : state.selectedSemesterId,
    });
  },

  setSelectedSemesterId(
    selectedSemesterId: string | null,
  ) {
    update({ selectedSemesterId });
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

export function useGpaStore(): GpaState {
  return useSyncExternalStore(
    gpaStore.subscribe,
    gpaStore.getState,
    getServerSnapshot,
  );
}