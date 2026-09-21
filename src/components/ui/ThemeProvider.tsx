'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Theme, ThemeName } from '@/types';
import { getStorageItem, setStorageItem } from '@/lib/storage';

export type ResolvedTheme =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'midnight';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  themes: ThemeName[];
}

const THEME_STORAGE_KEY = 'nexastudy-theme';

const THEMES: ThemeName[] = [
  'light',
  'dark',
  'system',
  'ocean',
  'sunset',
  'forest',
  'midnight',
];

const RESOLVED_THEMES: ResolvedTheme[] = [
  'light',
  'dark',
  'ocean',
  'sunset',
  'forest',
  'midnight',
];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

function isResolvedTheme(value: string): value is ResolvedTheme {
  return RESOLVED_THEMES.includes(value as ResolvedTheme);
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }

  return isResolvedTheme(theme) ? theme : 'light';
}

function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

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
  root.setAttribute('data-theme', theme);
  root.style.colorScheme =
    theme === 'dark' || theme === 'midnight' ? 'dark' : 'light';
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const stored = getStorageItem<unknown>(
      THEME_STORAGE_KEY,
      'system',
    );

    if (typeof stored === 'string' && isTheme(stored)) {
      return stored;
    }

    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>('light');

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setStorageItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);

    setResolvedTheme(nextResolvedTheme);
    applyTheme(nextResolvedTheme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (theme !== 'system') {
        return;
      }

      const nextTheme: ResolvedTheme = event.matches
        ? 'dark'
        : 'light';

      setResolvedTheme(nextTheme);
      applyTheme(nextTheme);
    };

    mediaQuery.addEventListener(
      'change',
      handleSystemThemeChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleSystemThemeChange,
      );
    };
  }, [theme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: THEMES,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}