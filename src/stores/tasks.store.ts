'use client';

import { useSyncExternalStore } from 'react';

import type { TaskData as Task } from '@/data/tasks';

export type TaskViewMode = 'list' | 'board';

export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  subjectId: string;
  dueDate: string;
}

export interface TasksState {
  tasks: Task[];
  filters: TaskFilters;
  viewMode: TaskViewMode;
  selectedTaskId: string | null;
  editingTaskId: string | null;
  loading: boolean;
}

const initialFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  subjectId: 'all',
  dueDate: 'all',
};

let state: TasksState = {
  tasks: [],
  filters: initialFilters,
  viewMode: 'list',
  selectedTaskId: null,
  editingTaskId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(
  updates: Partial<TasksState>,
) {
  state = {
    ...state,
    ...updates,
  };

  emit();
}

export const tasksStore = {
  getState(): TasksState {
    return state;
  },

  setTasks(tasks: Task[]) {
    update({ tasks });
  },

  addTask(task: Task) {
    update({
      tasks: [task, ...state.tasks],
    });
  },

  updateTask(
    id: string,
    updates: Partial<Task>,
  ) {
    update({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates }
          : task,
      ),
    });
  },

  removeTask(id: string) {
    update({
      tasks: state.tasks.filter(
        (task) => task.id !== id,
      ),
      selectedTaskId:
        state.selectedTaskId === id
          ? null
          : state.selectedTaskId,
      editingTaskId:
        state.editingTaskId === id
          ? null
          : state.editingTaskId,
    });
  },

  setFilters(
    filters: Partial<TaskFilters>,
  ) {
    update({
      filters: {
        ...state.filters,
        ...filters,
      },
    });
  },

  resetFilters() {
    update({
      filters: {
        ...initialFilters,
      },
    });
  },

  setViewMode(viewMode: TaskViewMode) {
    update({ viewMode });
  },

  setSelectedTaskId(
    selectedTaskId: string | null,
  ) {
    update({ selectedTaskId });
  },

  setEditingTaskId(
    editingTaskId: string | null,
  ) {
    update({ editingTaskId });
  },

  setLoading(loading: boolean) {
    update({ loading });
  },

  clear() {
    update({
      tasks: [],
      selectedTaskId: null,
      editingTaskId: null,
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

export function useTasksStore(): TasksState {
  return useSyncExternalStore(
    tasksStore.subscribe,
    tasksStore.getState,
    getServerSnapshot,
  );
}