'use client';

import { useSyncExternalStore } from 'react';

import type { StickyNoteData as StickyNote } from '@/data/sticky-notes';

export type StickyNotesView =
  | 'grid'
  | 'list';

export interface StickyNotesState {
  notes: StickyNote[];
  search: string;
  view: StickyNotesView;
  showArchived: boolean;
  selectedId: string | null;
  loading: boolean;
}

let state: StickyNotesState = {
  notes: [],
  search: '',
  view: 'grid',
  showArchived: false,
  selectedId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<StickyNotesState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const stickyNotesStore = {
  getState(): StickyNotesState {
    return state;
  },

  setNotes(notes: StickyNote[]) {
    update({ notes });
  },

  addNote(note: StickyNote) {
    update({
      notes: [note, ...state.notes],
    });
  },

  updateNote(
    id: string,
    updates: Partial<StickyNote>,
  ) {
    update({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates }
          : note,
      ),
    });
  },

  removeNote(id: string) {
    update({
      notes: state.notes.filter(
        (note) => note.id !== id,
      ),
    });
  },

  setSearch(search: string) {
    update({ search });
  },

  setView(view: StickyNotesView) {
    update({ view });
  },

  setShowArchived(showArchived: boolean) {
    update({ showArchived });
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

export function useStickyNotesStore(): StickyNotesState {
  return useSyncExternalStore(
    stickyNotesStore.subscribe,
    stickyNotesStore.getState,
    getServerSnapshot,
  );
}