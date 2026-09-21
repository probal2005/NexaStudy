'use client';

import { useSyncExternalStore } from 'react';

import type { AssignmentData as Assignment } from '@/data/assignments';

export interface AssignmentsState {
  assignments: Assignment[];
  search: string;
  status: string;
  subjectId: string;
  selectedId: string | null;
  loading: boolean;
}

let state: AssignmentsState = {
  assignments: [],
  search: '',
  status: 'all',
  subjectId: 'all',
  selectedId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<AssignmentsState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const assignmentsStore = {
  getState(): AssignmentsState {
    return state;
  },

  setAssignments(assignments: Assignment[]) {
    update({ assignments });
  },

  addAssignment(
    assignment: Assignment,
  ) {
    update({
      assignments: [
        assignment,
        ...state.assignments,
      ],
    });
  },

  updateAssignment(
    id: string,
    updates: Partial<Assignment>,
  ) {
    update({
      assignments: state.assignments.map(
        (assignment) =>
          assignment.id === id
            ? {
                ...assignment,
                ...updates,
              }
            : assignment,
      ),
    });
  },

  removeAssignment(id: string) {
    update({
      assignments: state.assignments.filter(
        (assignment) =>
          assignment.id !== id,
      ),
    });
  },

  setSearch(search: string) {
    update({ search });
  },

  setStatus(status: string) {
    update({ status });
  },

  setSubjectId(subjectId: string) {
    update({ subjectId });
  },

  setSelectedId(
    selectedId: string | null,
  ) {
    update({ selectedId });
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

export function useAssignmentsStore(): AssignmentsState {
  return useSyncExternalStore(
    assignmentsStore.subscribe,
    assignmentsStore.getState,
    getServerSnapshot,
  );
}