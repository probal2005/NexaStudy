'use client';

import { useSyncExternalStore } from 'react';

import type { StudentProfile } from '@/services/profile.service';

export interface ProfileState {
  profile: StudentProfile | null;
  loading: boolean;
  editing: boolean;
}

let state: ProfileState = {
  profile: null,
  loading: false,
  editing: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<ProfileState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const profileStore = {
  getState(): ProfileState {
    return state;
  },

  setProfile(profile: StudentProfile | null) {
    update({ profile });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  setEditing(editing: boolean) {
    update({ editing });
  },

  clear() {
    update({
      profile: null,
      editing: false,
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

export function useProfileStore(): ProfileState {
  return useSyncExternalStore(
    profileStore.subscribe,
    profileStore.getState,
    getServerSnapshot,
  );
}