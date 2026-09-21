import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/lib/storage';

export async function getStored<T>(
  key: string,
  fallback: T,
): Promise<T> {
  return getStorageItem<T>(key, fallback);
}

export async function saveStored<T>(
  key: string,
  value: T,
): Promise<boolean> {
  return setStorageItem(key, value);
}

export async function deleteStored(
  key: string,
): Promise<boolean> {
  return removeStorageItem(key);
}