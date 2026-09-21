'use client';

import { useSyncExternalStore } from 'react';

import type { CalendarEventData as CalendarEvent } from '@/data/calendar';

export type CalendarView =
  | 'month'
  | 'week'
  | 'day'
  | 'agenda';

export interface CalendarState {
  events: CalendarEvent[];
  view: CalendarView;
  selectedEventId: string | null;
  selectedDate: string;
  loading: boolean;
}

let state: CalendarState = {
  events: [],
  view: 'month',
  selectedEventId: null,
  selectedDate: new Date()
    .toISOString()
    .slice(0, 10),
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<CalendarState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const calendarStore = {
  getState(): CalendarState {
    return state;
  },

  setEvents(events: CalendarEvent[]) {
    update({ events });
  },

  addEvent(event: CalendarEvent) {
    update({
      events: [event, ...state.events],
    });
  },

  updateEvent(
    id: string,
    updates: Partial<CalendarEvent>,
  ) {
    update({
      events: state.events.map((event) =>
        event.id === id
          ? { ...event, ...updates }
          : event,
      ),
    });
  },

  removeEvent(id: string) {
    update({
      events: state.events.filter(
        (event) => event.id !== id,
      ),
    });
  },

  setView(view: CalendarView) {
    update({ view });
  },

  setSelectedEventId(
    selectedEventId: string | null,
  ) {
    update({ selectedEventId });
  },

  setSelectedDate(selectedDate: string) {
    update({ selectedDate });
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

export function useCalendarStore(): CalendarState {
  return useSyncExternalStore(
    calendarStore.subscribe,
    calendarStore.getState,
    getServerSnapshot,
  );
}