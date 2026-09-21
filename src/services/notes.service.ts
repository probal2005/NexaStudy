import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { NoteData as Note } from '@/data/notes';

const STORAGE_KEY = 'nexastudy_notes_v1';

export async function getNotes(): Promise<Note[]> {
  return getStorageItem<Note[]>(STORAGE_KEY, []);
}

export async function getNoteById(
  id: string,
): Promise<Note | null> {
  const notes = await getNotes();

  return notes.find((note) => note.id === id) ?? null;
}

export async function createNote(
  note: Note,
): Promise<Note> {
  const notes = await getNotes();

  setStorageItem(STORAGE_KEY, [note, ...notes]);

  return note;
}

export async function updateNote(
  id: string,
  updates: Partial<Note>,
): Promise<Note | null> {
  const notes = await getNotes();

  const index = notes.findIndex(
    (note) => note.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...notes[index],
    ...updates,
  };

  notes[index] = updated;

  setStorageItem(STORAGE_KEY, notes);

  return updated;
}

export async function deleteNote(
  id: string,
): Promise<boolean> {
  const notes = await getNotes();

  const filtered = notes.filter(
    (note) => note.id !== id,
  );

  if (filtered.length === notes.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}