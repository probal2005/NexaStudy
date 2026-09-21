'use client';

import { useSyncExternalStore } from 'react';

import type { PomodoroSessionData as PomodoroSession } from '@/data/pomodoro';

export type PomodoroMode =
  | 'focus'
  | 'shortBreak'
  | 'longBreak';

export interface PomodoroState {
  mode: PomodoroMode;
  secondsRemaining: number;
  isRunning: boolean;
  completedFocusSessions: number;
  sessions: PomodoroSession[];
  selectedSubjectId: string | null;
  loading: boolean;
}

const DEFAULT_FOCUS_SECONDS = 25 * 60;
const DEFAULT_SHORT_BREAK_SECONDS = 5 * 60;
const DEFAULT_LONG_BREAK_SECONDS = 15 * 60;

let state: PomodoroState = {
  mode: 'focus',
  secondsRemaining: DEFAULT_FOCUS_SECONDS,
  isRunning: false,
  completedFocusSessions: 0,
  sessions: [],
  selectedSubjectId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<PomodoroState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

function secondsForMode(
  mode: PomodoroMode,
): number {
  switch (mode) {
    case 'shortBreak':
      return DEFAULT_SHORT_BREAK_SECONDS;

    case 'longBreak':
      return DEFAULT_LONG_BREAK_SECONDS;

    case 'focus':
    default:
      return DEFAULT_FOCUS_SECONDS;
  }
}

export const pomodoroStore = {
  getState(): PomodoroState {
    return state;
  },

  setMode(mode: PomodoroMode) {
    update({
      mode,
      secondsRemaining:
        secondsForMode(mode),
      isRunning: false,
    });
  },

  setSecondsRemaining(
    secondsRemaining: number,
  ) {
    update({
      secondsRemaining: Math.max(
        0,
        secondsRemaining,
      ),
    });
  },

  setRunning(isRunning: boolean) {
    update({ isRunning });
  },

  toggleRunning() {
    update({
      isRunning: !state.isRunning,
    });
  },

  reset() {
    update({
      secondsRemaining:
        secondsForMode(state.mode),
      isRunning: false,
    });
  },

  completeFocusSession() {
    update({
      completedFocusSessions:
        state.completedFocusSessions + 1,
      isRunning: false,
    });
  },

  setSessions(
    sessions: PomodoroSession[],
  ) {
    update({ sessions });
  },

  addSession(session: PomodoroSession) {
    update({
      sessions: [
        session,
        ...state.sessions,
      ],
    });
  },

  removeSession(id: string) {
    update({
      sessions: state.sessions.filter(
        (session) =>
          session.id !== id,
      ),
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

export function usePomodoroStore(): PomodoroState {
  return useSyncExternalStore(
    pomodoroStore.subscribe,
    pomodoroStore.getState,
    getServerSnapshot,
  );
}