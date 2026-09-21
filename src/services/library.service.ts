import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { LibraryResourceData as LibraryItem } from '@/data/library';

const STORAGE_KEY = 'nexastudy_library_v1';

export async function getLibraryItems(): Promise<
  LibraryItem[]
> {
  return getStorageItem<LibraryItem[]>(
    STORAGE_KEY,
    [],
  );
}

export async function getLibraryItemById(
  id: string,
): Promise<LibraryItem | null> {
  const items = await getLibraryItems();

  return (
    items.find((item) => item.id === id) ?? null
  );
}

export async function createLibraryItem(
  item: LibraryItem,
): Promise<LibraryItem> {
  const items = await getLibraryItems();

  setStorageItem(STORAGE_KEY, [item, ...items]);

  return item;
}

export async function updateLibraryItem(
  id: string,
  updates: Partial<LibraryItem>,
): Promise<LibraryItem | null> {
  const items = await getLibraryItems();

  const index = items.findIndex(
    (item) => item.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...items[index],
    ...updates,
  };

  items[index] = updated;

  setStorageItem(STORAGE_KEY, items);

  return updated;
}

export async function deleteLibraryItem(
  id: string,
): Promise<boolean> {
  const items = await getLibraryItems();

  const filtered = items.filter(
    (item) => item.id !== id,
  );

  if (filtered.length === items.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}