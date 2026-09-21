'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface CountdownValue {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const emptyCountdown: CountdownValue = {
  totalMilliseconds: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: true,
};

function calculateCountdown(targetDate: Date | string): CountdownValue {
  const target = new Date(targetDate).getTime();

  if (Number.isNaN(target)) {
    return emptyCountdown;
  }

  const difference = Math.max(target - Date.now(), 0);

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMilliseconds: difference,
    days,
    hours,
    minutes,
    seconds,
    isExpired: difference <= 0,
  };
}

export function useCountdown(
  targetDate: Date | string | null,
  interval = 1000,
): CountdownValue {
  const calculate = useCallback(() => {
    if (!targetDate) {
      return emptyCountdown;
    }

    return calculateCountdown(targetDate);
  }, [targetDate]);

  const [countdown, setCountdown] = useState<CountdownValue>(
    emptyCountdown,
  );

  useEffect(() => {
    if (!targetDate) {
      setCountdown(emptyCountdown);
      return;
    }

    setCountdown(calculate());

    const timer = window.setInterval(() => {
      const next = calculate();

      setCountdown(next);

      if (next.isExpired) {
        window.clearInterval(timer);
      }
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [calculate, interval, targetDate]);

  return useMemo(() => countdown, [countdown]);
}