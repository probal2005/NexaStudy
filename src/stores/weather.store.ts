'use client';

import { useSyncExternalStore } from 'react';

import type { CurrentWeatherData as WeatherData } from '@/data/weather';

export type TemperatureUnit =
  | 'C'
  | 'F';

export interface WeatherState {
  current: WeatherData | null;
  search: string;
  favorites: string[];
  recentCities: string[];
  unit: TemperatureUnit;
  loading: boolean;
  error: string | null;
}

let state: WeatherState = {
  current: null,
  search: '',
  favorites: [],
  recentCities: [],
  unit: 'C',
  loading: false,
  error: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<WeatherState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const weatherStore = {
  getState(): WeatherState {
    return state;
  },

  setCurrent(
    current: WeatherData | null,
  ) {
    update({
      current,
      error: null,
    });
  },

  setSearch(search: string) {
    update({ search });
  },

  setFavorites(favorites: string[]) {
    update({ favorites });
  },

  setRecentCities(
    recentCities: string[],
  ) {
    update({ recentCities });
  },

  setUnit(unit: TemperatureUnit) {
    update({ unit });
  },

  toggleUnit() {
    update({
      unit: state.unit === 'C' ? 'F' : 'C',
    });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  setError(error: string | null) {
    update({
      error,
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

export function useWeatherStore(): WeatherState {
  return useSyncExternalStore(
    weatherStore.subscribe,
    weatherStore.getState,
    getServerSnapshot,
  );
}