'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Circle,
  Droplets,
  Flame,
  Leaf,
  Moon,
  Sun,
} from 'lucide-react';

import { cn } from '@/utils';
import { getStorageItem, setStorageItem } from '@/lib/storage';

type ThemeName =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'midnight';

interface ThemeOption {
  id: ThemeName;
  label: string;
  icon: typeof Sun;
}

const THEME_STORAGE_KEY = 'nexastudy-theme';

const themes: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    id: 'ocean',
    label: 'Ocean',
    icon: Droplets,
  },
  {
    id: 'sunset',
    label: 'Sunset',
    icon: Flame,
  },
  {
    id: 'forest',
    label: 'Forest',
    icon: Leaf,
  },
  {
    id: 'midnight',
    label: 'Midnight',
    icon: Circle,
  },
];

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;

  root.classList.remove(
    'light',
    'dark',
    'ocean',
    'sunset',
    'forest',
    'midnight',
  );

  root.classList.add(theme);

  if (
    theme === 'dark' ||
    theme === 'midnight'
  ) {
    root.classList.add('dark');
  }
}

export function ThemeSwitcher() {
  /*
   * Important:
   * Do not read localStorage during the initial render.
   *
   * The server cannot access localStorage, so doing so during
   * the first render creates different HTML between server
   * and client and causes React hydration warnings.
   */
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('light');

  useEffect(() => {
    const savedTheme = getStorageItem<ThemeName>(
      THEME_STORAGE_KEY,
      'light',
    );

    const validTheme = themes.some(
      (item) => item.id === savedTheme,
    )
      ? savedTheme
      : 'light';

    setTheme(validTheme);
    applyTheme(validTheme);
    setMounted(true);
  }, []);

  const handleThemeChange = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setStorageItem(THEME_STORAGE_KEY, nextTheme);
  };

  /*
   * Server and first client render intentionally use the
   * exact same static markup.
   *
   * This prevents hydration mismatch.
   */
  if (!mounted) {
    return (
      <div
        className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1"
        role="group"
        aria-label="Choose app theme"
      >
        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={`Use ${item.label} theme`}
              aria-pressed={false}
              className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground"
              disabled
            >
              <Icon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1"
      role="group"
      aria-label="Choose app theme"
    >
      {themes.map((item) => {
        const Icon = item.icon;
        const active = theme === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleThemeChange(item.id)}
            title={item.label}
            aria-label={`Use ${item.label} theme`}
            aria-pressed={active}
            className={cn(
              'group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
            )}
          >
            <Icon
              size={16}
              strokeWidth={active ? 2.3 : 2}
              aria-hidden="true"
            />

            {active && (
              <span
                className="pointer-events-none absolute -bottom-1 h-1 w-1 rounded-full bg-primary transition-all"
                aria-hidden="true"
              />
            )}

            {active && (
              <span className="sr-only">
                Currently selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeSwitcher;