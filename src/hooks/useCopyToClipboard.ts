'use client';

import { useCallback, useState } from 'react';

export function useCopyToClipboard(
  resetDelay = 2000,
): {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator.clipboard) {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, resetDelay);

        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setCopied(false);
        return false;
      }
    },
    [resetDelay],
  );

  return {
    copied,
    copy,
  };
}