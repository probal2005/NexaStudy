import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { StickyNoteData as StickyNote } from '@/data/sticky-notes';

const STORAGE_KEY = 'nexastudy_sticky_notes_v1';

export async function getStickyNotes(): Promise<
  StickyNote[]
> {
  return getStorageItem<StickyNote[]>(
    STORAGE_KEY,
    [],
  );
}

export async function createStickyNote(
  note: StickyNote,
): Promise<StickyNote> {
  const notes = await getStickyNotes();

  setStorageItem(STORAGE_KEY, [note, ...notes]);

  return note;
}

export async function updateStickyNote(
  id: string,
  updates: Partial<StickyNote>,
): Promise<StickyNote | null> {
  const notes = await getStickyNotes();

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

export async function deleteStickyNote(
  id: string,
): Promise<boolean> {
  const notes = await getStickyNotes();

  const filtered = notes.filter(
    (note) => note.id !== id,
  );

  if (filtered.length === notes.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}