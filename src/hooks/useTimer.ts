'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerState {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

export function useTimer(
  initialSeconds: number,
  onComplete?: () => void,
): TimerState & {
  start: () => void;
  pause: () => void;
  reset: (seconds?: number) => void;
  toggle: () => void;
} {
  const [remainingSeconds, setRemainingSeconds] =
    useState(Math.max(0, initialSeconds));

  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          onCompleteRef.current?.();

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsFinished(false);
      setIsRunning(true);
    }
  }, [remainingSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (seconds = initialSeconds) => {
      setIsRunning(false);
      setIsFinished(false);
      setRemainingSeconds(Math.max(0, seconds));
    },
    [initialSeconds],
  );

  const toggle = useCallback(() => {
    setIsRunning((previous) => !previous);
  }, []);

  return {
    remainingSeconds,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    toggle,
  };
}