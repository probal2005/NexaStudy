'use client';

import { useSyncExternalStore } from 'react';

export type AnalyticsPeriod =
  | 'week'
  | 'month'
  | 'semester';

export interface AnalyticsState {
  period: AnalyticsPeriod;
  loading: boolean;
  refreshedAt: string | null;
}

let state: AnalyticsState = {
  period: 'week',
  loading: false,
  refreshedAt: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<AnalyticsState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const analyticsStore = {
  getState(): AnalyticsState {
    return state;
  },

  setPeriod(
    period: AnalyticsPeriod,
  ) {
    update({ period });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  markRefreshed() {
    update({
      refreshedAt: new Date().toISOString(),
      loading: false,
    });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

const getServerSnapshot = () => state;

export function useAnalyticsStore(): AnalyticsState {
  return useSyncExternalStore(
    analyticsStore.subscribe,
    analyticsStore.getState,
    getServerSnapshot,
  );
}