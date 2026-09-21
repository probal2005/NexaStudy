'use client';

import { useSyncExternalStore } from 'react';

import type { NoteData as Note } from '@/data/notes';

export interface NotesState {
  notes: Note[];
  search: string;
  selectedNoteId: string | null;
  loading: boolean;
}

let state: NotesState = {
  notes: [],
  search: '',
  selectedNoteId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<NotesState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const notesStore = {
  getState(): NotesState {
    return state;
  },

  setNotes(notes: Note[]) {
    update({ notes });
  },

  addNote(note: Note) {
    update({
      notes: [note, ...state.notes],
    });
  },

  updateNote(
    id: string,
    updates: Partial<Note>,
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

  setSelectedNoteId(
    selectedNoteId: string | null,
  ) {
    update({ selectedNoteId });
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

export function useNotesStore(): NotesState {
  return useSyncExternalStore(
    notesStore.subscribe,
    notesStore.getState,
    getServerSnapshot,
  );
}