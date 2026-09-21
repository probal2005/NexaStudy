import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { SemesterGpaData as GpaSemester } from '@/data/gpa';

const STORAGE_KEY = 'nexastudy_gpa_v1';

export async function getGpaSemesters(): Promise<
  GpaSemester[]
> {
  return getStorageItem<GpaSemester[]>(
    STORAGE_KEY,
    [],
  );
}

export async function createGpaSemester(
  semester: GpaSemester,
): Promise<GpaSemester> {
  const semesters = await getGpaSemesters();

  setStorageItem(STORAGE_KEY, [
    semester,
    ...semesters,
  ]);

  return semester;
}

export async function updateGpaSemester(
  id: string,
  updates: Partial<GpaSemester>,
): Promise<GpaSemester | null> {
  const semesters = await getGpaSemesters();

  const index = semesters.findIndex(
    (semester) => semester.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...semesters[index],
    ...updates,
  };

  semesters[index] = updated;

  setStorageItem(STORAGE_KEY, semesters);

  return updated;
}

export async function deleteGpaSemester(
  id: string,
): Promise<boolean> {
  const semesters = await getGpaSemesters();

  const filtered = semesters.filter(
    (semester) => semester.id !== id,
  );

  if (filtered.length === semesters.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}