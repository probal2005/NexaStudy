import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type {
  StudyGoalData as StudyGoal,
  StudySessionData as StudySession,
} from '@/data/study';

const GOALS_KEY = 'nexastudy_study_goals_v1';
const SESSIONS_KEY = 'nexastudy_study_sessions_v1';

export async function getStudyGoals(): Promise<StudyGoal[]> {
  return getStorageItem<StudyGoal[]>(GOALS_KEY, []);
}

export async function createStudyGoal(
  goal: StudyGoal,
): Promise<StudyGoal> {
  const goals = await getStudyGoals();

  setStorageItem(GOALS_KEY, [goal, ...goals]);

  return goal;
}

export async function updateStudyGoal(
  id: string,
  updates: Partial<StudyGoal>,
): Promise<StudyGoal | null> {
  const goals = await getStudyGoals();

  const index = goals.findIndex(
    (goal) => goal.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...goals[index],
    ...updates,
  };

  goals[index] = updated;

  setStorageItem(GOALS_KEY, goals);

  return updated;
}

export async function deleteStudyGoal(
  id: string,
): Promise<boolean> {
  const goals = await getStudyGoals();

  const filtered = goals.filter(
    (goal) => goal.id !== id,
  );

  if (filtered.length === goals.length) {
    return false;
  }

  setStorageItem(GOALS_KEY, filtered);

  return true;
}

export async function getStudySessions(): Promise<
  StudySession[]
> {
  return getStorageItem<StudySession[]>(
    SESSIONS_KEY,
    [],
  );
}

export async function createStudySession(
  session: StudySession,
): Promise<StudySession> {
  const sessions = await getStudySessions();

  setStorageItem(SESSIONS_KEY, [
    session,
    ...sessions,
  ]);

  return session;
}