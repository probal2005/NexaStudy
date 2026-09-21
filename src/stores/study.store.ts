'use client';

import { useSyncExternalStore } from 'react';

import type {
  StudyGoalData as StudyGoal,
  StudySessionData as StudySession,
} from '@/data/study';

export interface StudyState {
  goals: StudyGoal[];
  sessions: StudySession[];
  selectedSubjectId: string | null;
  loading: boolean;
}

let state: StudyState = {
  goals: [],
  sessions: [],
  selectedSubjectId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<StudyState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const studyStore = {
  getState(): StudyState {
    return state;
  },

  setGoals(goals: StudyGoal[]) {
    update({ goals });
  },

  addGoal(goal: StudyGoal) {
    update({
      goals: [goal, ...state.goals],
    });
  },

  updateGoal(
    id: string,
    updates: Partial<StudyGoal>,
  ) {
    update({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? { ...goal, ...updates }
          : goal,
      ),
    });
  },

  removeGoal(id: string) {
    update({
      goals: state.goals.filter(
        (goal) => goal.id !== id,
      ),
    });
  },

  setSessions(sessions: StudySession[]) {
    update({ sessions });
  },

  addSession(session: StudySession) {
    update({
      sessions: [
        session,
        ...state.sessions,
      ],
    });
  },

  setSelectedSubjectId(
    selectedSubjectId: string | null,
  ) {
    update({ selectedSubjectId });
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

export function useStudyStore(): StudyState {
  return useSyncExternalStore(
    studyStore.subscribe,
    studyStore.getState,
    getServerSnapshot,
  );
}