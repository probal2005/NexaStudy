'use client';

import { useSyncExternalStore } from 'react';

import type {
  AuthSession,
  AuthUser,
} from '@/services/auth.service';

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  initialized: boolean;
  loading: boolean;
}

let state: AuthState = {
  user: null,
  session: null,
  initialized: false,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<AuthState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const authStore = {
  getState(): AuthState {
    return state;
  },

  setSession(session: AuthSession | null) {
    update({
      session,
      user: session?.user ?? null,
      initialized: true,
    });
  },

  setUser(user: AuthUser | null) {
    update({ user });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  setInitialized(initialized: boolean) {
    update({ initialized });
  },

  clear() {
    update({
      user: null,
      session: null,
      initialized: true,
      loading: false,
    });
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

const getServerSnapshot = () => state;

export function useAuthStore(): AuthState {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    getServerSnapshot,
  );
}