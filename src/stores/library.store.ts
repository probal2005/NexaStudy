'use client';

import { useSyncExternalStore } from 'react';

import type { LibraryResourceData as LibraryItem } from '@/data/library';

export interface LibraryState {
  items: LibraryItem[];
  search: string;
  selectedId: string | null;
  loading: boolean;
}

const initialState: LibraryState = {
  items: [],
  search: '',
  selectedId: null,
  loading: false,
};

let state: LibraryState = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(updates: Partial<LibraryState>) {
  state = { ...state, ...updates };
  emit();
}

export const libraryStore = {
  getState(): LibraryState {
    return state;
  },

  setItems(items: LibraryItem[]) {
    update({ items });
  },

  addItem(item: LibraryItem) {
    update({ items: [item, ...state.items] });
  },

  updateItem(id: string, updates: Partial<LibraryItem>) {
    update({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    });
  },

  removeItem(id: string) {
    update({
      items: state.items.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    });
  },

  setSearch(search: string) {
    update({ search });
  },

  setSelectedId(selectedId: string | null) {
    update({ selectedId });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  clear() {
    update({ items: [], selectedId: null });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const getServerSnapshot = () => state;

export function useLibraryStore(): LibraryState {
  return useSyncExternalStore(
    libraryStore.subscribe,
    libraryStore.getState,
    getServerSnapshot,
  );
}
