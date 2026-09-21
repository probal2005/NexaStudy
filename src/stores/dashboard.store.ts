'use client';

import { useSyncExternalStore } from 'react';

export interface DashboardState {
  refreshing: boolean;
  lastUpdated: string | null;
  selectedPeriod: 'today' | 'week' | 'month';
}

let state: DashboardState = {
  refreshing: false,
  lastUpdated: null,
  selectedPeriod: 'today',
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<DashboardState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const dashboardStore = {
  getState(): DashboardState {
    return state;
  },

  setRefreshing(refreshing: boolean) {
    update({ refreshing });
  },

  markUpdated() {
    update({
      lastUpdated: new Date().toISOString(),
      refreshing: false,
    });
  },

  setSelectedPeriod(
    selectedPeriod:
      | 'today'
      | 'week'
      | 'month',
  ) {
    update({ selectedPeriod });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

const getServerSnapshot = () => state;

export function useDashboardStore(): DashboardState {
  return useSyncExternalStore(
    dashboardStore.subscribe,
    dashboardStore.getState,
    getServerSnapshot,
  );
}