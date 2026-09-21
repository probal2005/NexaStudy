'use client';

import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = T | ((previous: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(`Failed to read localStorage key "${key}"`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      setStoredValue((previous) => {
        const nextValue =
          value instanceof Function ? value(previous) : value;

        try {
          window.localStorage.setItem(
            key,
            JSON.stringify(nextValue),
          );
        } catch (error) {
          console.error(
            `Failed to write localStorage key "${key}"`,
            error,
          );
        }

        return nextValue;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(
        `Failed to remove localStorage key "${key}"`,
        error,
      );
    }
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}