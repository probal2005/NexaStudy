'use client';

import { useSyncExternalStore } from 'react';

export type SidebarState = 'expanded' | 'collapsed';

export interface AppState {
  sidebar: SidebarState;
  mobileMenuOpen: boolean;
  commandPaletteOpen: boolean;
  globalSearchOpen: boolean;
  loading: boolean;
}

let state: AppState = {
  sidebar: 'expanded',
  mobileMenuOpen: false,
  commandPaletteOpen: false,
  globalSearchOpen: false,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(
  updates: Partial<AppState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const appStore = {
  getState(): AppState {
    return state;
  },

  setSidebar(sidebar: SidebarState) {
    setState({ sidebar });
  },

  toggleSidebar() {
    setState({
      sidebar:
        state.sidebar === 'expanded'
          ? 'collapsed'
          : 'expanded',
    });
  },

  setMobileMenuOpen(open: boolean) {
    setState({
      mobileMenuOpen: open,
    });
  },

  toggleMobileMenu() {
    setState({
      mobileMenuOpen: !state.mobileMenuOpen,
    });
  },

  setCommandPaletteOpen(open: boolean) {
    setState({
      commandPaletteOpen: open,
    });
  },

  setGlobalSearchOpen(open: boolean) {
    setState({
      globalSearchOpen: open,
    });
  },

  setLoading(loading: boolean) {
    setState({ loading });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

const getServerSnapshot = () => state;

export function useAppStore(): AppState {
  return useSyncExternalStore(
    appStore.subscribe,
    appStore.getState,
    getServerSnapshot,
  );
}