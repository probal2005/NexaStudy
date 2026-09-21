export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__nexastudy_storage_test__';

    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}

export function getStorageItem<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    /*
     * Most NexaStudy values are stored as JSON.
     * Theme preferences may already exist as plain strings
     * from an earlier version of the application.
     */
    try {
      return JSON.parse(raw) as T;
    } catch {
      if (typeof fallback === 'string') {
        return raw as T;
      }

      return fallback;
    }
  } catch (error) {
    console.error(
      `Failed to read localStorage key "${key}"`,
      error,
    );

    return fallback;
  }
}

export function setStorageItem<T>(
  key: string,
  value: T,
): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );

    return true;
  } catch (error) {
    console.error(
      `Failed to write localStorage key "${key}"`,
      error,
    );

    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Failed to remove localStorage key "${key}"`,
      error,
    );

    return false;
  }
}

export function clearNexaStudyStorage(
  keys: string[],
): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    keys.forEach((key) => {
      window.localStorage.removeItem(key);
    });

    return true;
  } catch (error) {
    console.error(
      'Failed to clear NexaStudy storage',
      error,
    );

    return false;
  }
}