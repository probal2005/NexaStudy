'use client';

import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  ctrlOrMeta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {},
): void {
  const {
    ctrlOrMeta = false,
    shift = false,
    alt = false,
    preventDefault = true,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      const modifierMatches = ctrlOrMeta
        ? event.ctrlKey || event.metaKey
        : true;

      if (
        event.key.toLowerCase() !== key.toLowerCase() ||
        !modifierMatches ||
        event.shiftKey !== shift ||
        event.altKey !== alt
      ) {
        return;
      }

      if (preventDefault) {
        event.preventDefault();
      }

      callback(event);
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [
    alt,
    callback,
    ctrlOrMeta,
    enabled,
    key,
    preventDefault,
    shift,
  ]);
}