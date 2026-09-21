import { getStorageItem, setStorageItem } from '@/lib/storage';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  department?: string;
  semester?: string;
  studentId?: string;
  avatar?: string;
  bio?: string;
}

const STORAGE_KEY = 'nexastudy_profile_v1';

const defaultProfile: StudentProfile = {
  id: 'demo-student',
  name: 'Student',
  email: 'student@example.com',
  university: '',
  department: '',
  semester: '',
  studentId: '',
  avatar: '',
  bio: '',
};

export async function getProfile(): Promise<StudentProfile> {
  return getStorageItem<StudentProfile>(
    STORAGE_KEY,
    defaultProfile,
  );
}

export async function updateProfile(
  updates: Partial<StudentProfile>,
): Promise<StudentProfile> {
  const current = await getProfile();

  const updated: StudentProfile = {
    ...current,
    ...updates,
  };

  setStorageItem(STORAGE_KEY, updated);

  return updated;
}

export async function resetProfile(): Promise<StudentProfile> {
  setStorageItem(STORAGE_KEY, defaultProfile);

  return defaultProfile;
}