export type PomodoroModeData =
  | 'focus'
  | 'shortBreak'
  | 'longBreak';

export interface PomodoroSessionData {
  id: string;
  mode: 'focus';
  subjectId?: string;
  durationMinutes: number;
  completedAt: string;
  notes?: string;
}

export interface PomodoroSettingsData {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export const pomodoroSettings: PomodoroSettingsData = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

export const pomodoroSessions: PomodoroSessionData[] = [
  {
    id: 'pomodoro-001',
    mode: 'focus',
    subjectId: 'sub-001',
    durationMinutes: 25,
    completedAt: '2026-09-20T18:25:00',
  },
  {
    id: 'pomodoro-002',
    mode: 'focus',
    subjectId: 'sub-003',
    durationMinutes: 25,
    completedAt: '2026-09-20T19:00:00',
  },
  {
    id: 'pomodoro-003',
    mode: 'focus',
    subjectId: 'sub-002',
    durationMinutes: 25,
    completedAt: '2026-09-19T17:30:00',
  },
];