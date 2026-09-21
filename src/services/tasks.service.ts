import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { TaskData as Task } from '@/data/tasks';

const STORAGE_KEY = 'nexastudy_tasks_v1';

export async function getTasks(): Promise<Task[]> {
  return getStorageItem<Task[]>(STORAGE_KEY, []);
}

export async function getTaskById(
  id: string,
): Promise<Task | null> {
  const tasks = await getTasks();

  return tasks.find((task) => task.id === id) ?? null;
}

export async function createTask(
  task: Task,
): Promise<Task> {
  const tasks = await getTasks();

  const updated = [task, ...tasks];

  setStorageItem(STORAGE_KEY, updated);

  return task;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>,
): Promise<Task | null> {
  const tasks = await getTasks();

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const updatedTask = {
    ...tasks[index],
    ...updates,
  };

  tasks[index] = updatedTask;

  setStorageItem(STORAGE_KEY, tasks);

  return updatedTask;
}

export async function deleteTask(
  id: string,
): Promise<boolean> {
  const tasks = await getTasks();

  const filtered = tasks.filter(
    (task) => task.id !== id,
  );

  if (filtered.length === tasks.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}

export async function clearTasks(): Promise<void> {
  setStorageItem(STORAGE_KEY, []);
}