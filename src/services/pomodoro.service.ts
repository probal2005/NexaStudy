import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { PomodoroSessionData as PomodoroSession } from '@/data/pomodoro';

const STORAGE_KEY = 'nexastudy_pomodoro_v1';

export async function getPomodoroSessions(): Promise<
  PomodoroSession[]
> {
  return getStorageItem<PomodoroSession[]>(
    STORAGE_KEY,
    [],
  );
}

export async function createPomodoroSession(
  session: PomodoroSession,
): Promise<PomodoroSession> {
  const sessions = await getPomodoroSessions();

  setStorageItem(STORAGE_KEY, [
    session,
    ...sessions,
  ]);

  return session;
}

export async function deletePomodoroSession(
  id: string,
): Promise<boolean> {
  const sessions = await getPomodoroSessions();

  const filtered = sessions.filter(
    (session) => session.id !== id,
  );

  if (filtered.length === sessions.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}

export async function clearPomodoroHistory(): Promise<void> {
  setStorageItem(STORAGE_KEY, []);
}