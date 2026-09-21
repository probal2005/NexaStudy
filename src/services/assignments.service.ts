import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { AssignmentData as Assignment } from '@/data/assignments';

const STORAGE_KEY = 'nexastudy_assignments_v1';

export async function getAssignments(): Promise<Assignment[]> {
  return getStorageItem<Assignment[]>(STORAGE_KEY, []);
}

export async function getAssignmentById(
  id: string,
): Promise<Assignment | null> {
  const assignments = await getAssignments();

  return (
    assignments.find(
      (assignment) => assignment.id === id,
    ) ?? null
  );
}

export async function createAssignment(
  assignment: Assignment,
): Promise<Assignment> {
  const assignments = await getAssignments();

  setStorageItem(STORAGE_KEY, [
    assignment,
    ...assignments,
  ]);

  return assignment;
}

export async function updateAssignment(
  id: string,
  updates: Partial<Assignment>,
): Promise<Assignment | null> {
  const assignments = await getAssignments();

  const index = assignments.findIndex(
    (assignment) => assignment.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...assignments[index],
    ...updates,
  };

  assignments[index] = updated;

  setStorageItem(STORAGE_KEY, assignments);

  return updated;
}

export async function deleteAssignment(
  id: string,
): Promise<boolean> {
  const assignments = await getAssignments();

  const filtered = assignments.filter(
    (assignment) => assignment.id !== id,
  );

  if (filtered.length === assignments.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}