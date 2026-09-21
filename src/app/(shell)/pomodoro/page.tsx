'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Timer,
  Flame,
  Clock,
  Trophy,
  Settings,
  Brain,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InfoCard } from '@/components/ui/Header';
import { cn } from '@/utils';

type SessionType = 'work' | 'short_break' | 'long_break';

interface PomodoroHistoryItem {
  id: string;
  type: SessionType;
  duration: number;
  subjectId: string | null;
  completedAt: string;
}

interface PomodoroSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

const DEFAULT_SESSION_TARGET = 4;

const subjects = [
  { id: 's1', name: 'DBMS', color: '#4F46E5' },
  { id: 's2', name: 'Thermodynamics', color: '#F59E0B' },
  { id: 's3', name: 'Calculus II', color: '#10B981' },
  { id: 's4', name: 'Physical Chemistry', color: '#EF4444' },
  { id: 's5', name: 'Economics', color: '#EC4899' },
];

const HISTORY_KEY = 'nexastudy_pomodoro_history';
const SETTINGS_KEY = 'nexastudy_pomodoro_settings';

function getDurationForMode(
  mode: SessionType,
  settings: PomodoroSettings,
): number {
  if (mode === 'work') return settings.work * 60;
  if (mode === 'short_break') return settings.shortBreak * 60;
  return settings.longBreak * 60;
}

function getModeLabel(mode: SessionType) {
  if (mode === 'work') return 'Focus Time';
  if (mode === 'short_break') return 'Short Break';
  return 'Long Break';
}

function getModeDescription(mode: SessionType) {
  if (mode === 'work') return 'Stay focused!';
  if (mode === 'short_break') return 'Rest and recharge';
  return 'Take a longer break';
}

function getModeIcon(mode: SessionType) {
  if (mode === 'work') return <Brain size={16} />;
  if (mode === 'short_break') return <Clock size={16} />;
  return <Trophy size={16} />;
}

function getModeTextClass(mode: SessionType) {
  if (mode === 'work') return 'text-red-600';
  if (mode === 'short_break') return 'text-green-600';
  return 'text-blue-600';
}

function getModeBgClass(mode: SessionType) {
  if (mode === 'work') return 'bg-red-500';
  if (mode === 'short_break') return 'bg-green-500';
  return 'bg-blue-500';
}

function getModeBorderClass(mode: SessionType) {
  if (mode === 'work') {
    return 'border-red-500 bg-red-50 dark:bg-red-950/20';
  }

  if (mode === 'short_break') {
    return 'border-green-500 bg-green-50 dark:bg-green-950/20';
  }

  return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function getTodayKey() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(now.getDate()).padStart(2, '0')}`;
}

function isToday(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function PomodoroPage() {
  const [mode, setMode] = useState<SessionType>('work');

  const [settings, setSettings] =
    useState<PomodoroSettings>(DEFAULT_SETTINGS);

  const [timeLeft, setTimeLeft] = useState(
    DEFAULT_SETTINGS.work * 60,
  );

  const [isRunning, setIsRunning] = useState(false);

  const [completedSessions, setCompletedSessions] = useState(0);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(
    null,
  );

  const [history, setHistory] = useState<PomodoroHistoryItem[]>([]);

  const [showSettings, setShowSettings] = useState(false);

  const [settingsDraft, setSettingsDraft] =
    useState<PomodoroSettings>(DEFAULT_SETTINGS);

  const [hydrated, setHydrated] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = useMemo(
    () => getDurationForMode(mode, settings),
    [mode, settings],
  );

  const todayHistory = useMemo(
    () => history.filter(item => isToday(item.completedAt)),
    [history],
  );

  const todayCompletedWorkSessions = useMemo(
    () => todayHistory.filter(item => item.type === 'work').length,
    [todayHistory],
  );

  const todayFocusMinutes = useMemo(
    () =>
      todayHistory
        .filter(item => item.type === 'work')
        .reduce((total, item) => total + item.duration, 0),
    [todayHistory],
  );

  const bestTodayStreak = useMemo(() => {
    let best = 0;
    let current = 0;

    const workSessions = todayHistory.filter(
      item => item.type === 'work',
    );

    workSessions.forEach(() => {
      current += 1;
      best = Math.max(best, current);
    });

    return best;
  }, [todayHistory]);

  const progress =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((totalSeconds - timeLeft) / totalSeconds) * 100,
          ),
        )
      : 0;

  /*
   * Load saved settings/history once on the client.
   */
  useEffect(() => {
    try {
      const savedSettings = window.localStorage.getItem(SETTINGS_KEY);
      const savedHistory = window.localStorage.getItem(HISTORY_KEY);

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as PomodoroSettings;

        if (
          Number.isFinite(parsed.work) &&
          Number.isFinite(parsed.shortBreak) &&
          Number.isFinite(parsed.longBreak)
        ) {
          setSettings(parsed);
          setSettingsDraft(parsed);
          setTimeLeft(parsed.work * 60);
        }
      }

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory) as PomodoroHistoryItem[];

        if (Array.isArray(parsed)) {
          setHistory(parsed);
          setCompletedSessions(
            parsed.filter(item => item.type === 'work').length,
          );
        }
      }
    } catch {
      // Ignore malformed local storage data.
    } finally {
      setHydrated(true);
    }
  }, []);

  /*
   * Persist history.
   */
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [history, hydrated]);

  /*
   * Persist settings.
   */
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [settings, hydrated]);

  /*
   * Main timer.
   *
   * Uses one interval while running instead of recreating an interval
   * every second.
   */
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  /*
   * Detect timer completion.
   */
  useEffect(() => {
    if (!isRunning || timeLeft !== 0) return;

    completeCurrentSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isRunning]);

  function getNextMode(
    currentMode: SessionType,
    nextCompletedWorkSessions: number,
  ): SessionType {
    if (currentMode !== 'work') {
      return 'work';
    }

    /*
     * Every 4 completed work sessions -> long break.
     *
     * Example:
     * 1 -> short break
     * 2 -> short break
     * 3 -> short break
     * 4 -> long break
     */
    if (nextCompletedWorkSessions % DEFAULT_SESSION_TARGET === 0) {
      return 'long_break';
    }

    return 'short_break';
  }

  function completeCurrentSession() {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (mode === 'work') {
      const durationMinutes = Math.max(
        1,
        Math.round(totalSeconds / 60),
      );

      const nextCompletedWorkSessions = completedSessions + 1;

      const historyItem: PomodoroHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'work',
        duration: durationMinutes,
        subjectId: selectedSubject,
        completedAt: new Date().toISOString(),
      };

      setHistory(previous => [historyItem, ...previous]);
      setCompletedSessions(nextCompletedWorkSessions);

      const nextMode = getNextMode(
        mode,
        nextCompletedWorkSessions,
      );

      setMode(nextMode);
      setTimeLeft(getDurationForMode(nextMode, settings));
    } else {
      const nextMode: SessionType = 'work';

      setMode(nextMode);
      setTimeLeft(getDurationForMode(nextMode, settings));
    }
  }

  function handleStart() {
    if (timeLeft <= 0) {
      setTimeLeft(getDurationForMode(mode, settings));
    }

    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeLeft(getDurationForMode(mode, settings));
  }

  function handleSkip() {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    /*
     * Skipping a session should NOT count as a completed
     * focus session.
     *
     * It simply moves to the next mode.
     */
    if (mode === 'work') {
      const nextMode: SessionType =
        completedSessions > 0 &&
        completedSessions % DEFAULT_SESSION_TARGET === 0
          ? 'long_break'
          : 'short_break';

      setMode(nextMode);
      setTimeLeft(getDurationForMode(nextMode, settings));
    } else {
      setMode('work');
      setTimeLeft(getDurationForMode('work', settings));
    }
  }

  function selectMode(nextMode: SessionType) {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setMode(nextMode);
    setTimeLeft(getDurationForMode(nextMode, settings));
  }

  function updateSetting(
    key: keyof PomodoroSettings,
    value: string,
  ) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return;

    const limits: Record<keyof PomodoroSettings, [number, number]> = {
      work: [1, 120],
      shortBreak: [1, 30],
      longBreak: [1, 60],
    };

    const [min, max] = limits[key];
    const safeValue = Math.min(
      max,
      Math.max(min, Math.floor(numericValue)),
    );

    setSettingsDraft(previous => ({
      ...previous,
      [key]: safeValue,
    }));
  }

  function applySettings() {
    const nextSettings = {
      work: Math.min(
        120,
        Math.max(1, Math.floor(settingsDraft.work)),
      ),
      shortBreak: Math.min(
        30,
        Math.max(1, Math.floor(settingsDraft.shortBreak)),
      ),
      longBreak: Math.min(
        60,
        Math.max(1, Math.floor(settingsDraft.longBreak)),
      ),
    };

    setIsRunning(false);
    setSettings(nextSettings);
    setSettingsDraft(nextSettings);
    setTimeLeft(getDurationForMode(mode, nextSettings));
    setShowSettings(false);
  }

  function resetSettings() {
    setIsRunning(false);
    setSettings(DEFAULT_SETTINGS);
    setSettingsDraft(DEFAULT_SETTINGS);
    setTimeLeft(
      getDurationForMode(mode, DEFAULT_SETTINGS),
    );
  }

  function clearHistory() {
    if (!confirm('Clear all Pomodoro history?')) return;

    setHistory([]);
    setCompletedSessions(0);
  }

  const selectedSubjectName =
    subjects.find(subject => subject.id === selectedSubject)?.name ??
    'No subject selected';

  return (
    <div className="flex flex-col items-center justify-start py-6 sm:py-8 animate-fade-in">
      {/* Main Timer */}
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-semibold',
                getModeBgClass(mode),
              )}
            >
              {getModeIcon(mode)}
            </div>

            <span
              className={cn(
                'text-sm font-semibold',
                getModeTextClass(mode),
              )}
            >
              {getModeLabel(mode)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {mode === 'work'
              ? `Work session ${completedSessions + 1}`
              : `${completedSessions} focus session${
                  completedSessions === 1 ? '' : 's'
                } completed today`}
          </p>
        </CardHeader>

        <CardContent className="text-center">
          {/* Circular Timer */}
          <div className="relative flex items-center justify-center my-5 sm:my-6">
            <svg
              className="h-56 w-56 sm:h-64 sm:w-64 -rotate-90"
              viewBox="0 0 200 200"
              aria-label={`${Math.round(progress)} percent complete`}
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                className="text-muted"
                strokeWidth="8"
              />

              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                className={cn(
                  mode === 'work'
                    ? 'text-red-500'
                    : mode === 'short_break'
                      ? 'text-green-500'
                      : 'text-blue-500',
                )}
                strokeWidth="8"
                strokeDasharray={`${progress * 5.65} 565`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  'text-5xl sm:text-6xl font-bold tracking-tight tabular-nums',
                  getModeTextClass(mode),
                )}
              >
                {formatTime(timeLeft)}
              </span>

              <p className="text-sm text-muted-foreground mt-2">
                {getModeDescription(mode)}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          {/* Current Subject */}
          <div className="mb-5">
            <p className="text-xs text-muted-foreground mb-2">
              Study subject
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {subjects.map(subject => {
                const active = selectedSubject === subject.id;

                return (
                  <button
                    key={subject.id}
                    type="button"
                    disabled={isRunning}
                    onClick={() =>
                      setSelectedSubject(
                        active ? null : subject.id,
                      )
                    }
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                      active
                        ? 'border-transparent text-white'
                        : 'border-border bg-card hover:bg-muted',
                      isRunning &&
                        'cursor-not-allowed opacity-70',
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: subject.color,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: active
                          ? 'white'
                          : subject.color,
                      }}
                    />

                    {subject.name}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {selectedSubjectName}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={isRunning ? 'outline' : 'default'}
              onClick={isRunning ? handlePause : handleStart}
              className={cn(
                'h-12 w-12 rounded-full',
                !isRunning &&
                  'bg-primary hover:bg-primary/90',
              )}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="h-10 w-10 rounded-full"
              aria-label="Skip session"
              title="Skip session"
            >
              <SkipForward size={18} />
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 w-10 rounded-full"
              aria-label="Reset timer"
              title="Reset timer"
            >
              <RotateCcw size={18} />
            </Button>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {completedSessions}
              </p>
              <p className="text-xs text-muted-foreground">
                All-time focus
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {todayCompletedWorkSessions}
              </p>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {todayFocusMinutes}m
              </p>
              <p className="text-xs text-muted-foreground">
                Focus time
              </p>
            </div>
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              setSettingsDraft(settings);
              setShowSettings(previous => !previous);
            }}
            className="mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
          >
            <Settings size={14} />
            Customize durations
          </button>

          {showSettings && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="work-duration"
                    className="text-xs font-medium mb-1 block"
                  >
                    Work (min)
                  </label>

                  <Input
                    id="work-duration"
                    type="number"
                    min={1}
                    max={120}
                    value={settingsDraft.work}
                    onChange={e =>
                      updateSetting('work', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="short-break-duration"
                    className="text-xs font-medium mb-1 block"
                  >
                    Short break (min)
                  </label>

                  <Input
                    id="short-break-duration"
                    type="number"
                    min={1}
                    max={30}
                    value={settingsDraft.shortBreak}
                    onChange={e =>
                      updateSetting(
                        'shortBreak',
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="long-break-duration"
                    className="text-xs font-medium mb-1 block"
                  >
                    Long break (min)
                  </label>

                  <Input
                    id="long-break-duration"
                    type="number"
                    min={1}
                    max={60}
                    value={settingsDraft.longBreak}
                    onChange={e =>
                      updateSetting(
                        'longBreak',
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                <div className="text-xs text-muted-foreground">
                  Long break starts after every{' '}
                  <strong>4 completed focus sessions</strong>.
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSettings}
                  >
                    Default
                  </Button>

                  <Button
                    size="sm"
                    onClick={applySettings}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Type Selector */}
      <Card className="w-full max-w-2xl mt-5">
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4">
          <button
            type="button"
            onClick={() => selectMode('work')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
              mode === 'work'
                ? getModeBorderClass('work')
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            <Brain
              size={20}
              className={
                mode === 'work'
                  ? 'text-red-500'
                  : 'text-muted-foreground'
              }
            />

            <span
              className={cn(
                'text-sm font-medium',
                mode === 'work' && 'text-red-600',
              )}
            >
              Focus
            </span>

            <span className="text-xs text-muted-foreground">
              {settings.work} min
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectMode('short_break')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
              mode === 'short_break'
                ? getModeBorderClass('short_break')
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            <Clock
              size={20}
              className={
                mode === 'short_break'
                  ? 'text-green-500'
                  : 'text-muted-foreground'
              }
            />

            <span
              className={cn(
                'text-sm font-medium',
                mode === 'short_break' && 'text-green-600',
              )}
            >
              Short Break
            </span>

            <span className="text-xs text-muted-foreground">
              {settings.shortBreak} min
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectMode('long_break')}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
              mode === 'long_break'
                ? getModeBorderClass('long_break')
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            <Trophy
              size={20}
              className={
                mode === 'long_break'
                  ? 'text-blue-500'
                  : 'text-muted-foreground'
              }
            />

            <span
              className={cn(
                'text-sm font-medium',
                mode === 'long_break' && 'text-blue-600',
              )}
            >
              Long Break
            </span>

            <span className="text-xs text-muted-foreground">
              {settings.longBreak} min
            </span>
          </button>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <Card className="w-full max-w-2xl mt-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Today&apos;s Stats
          </CardTitle>

          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-xs text-muted-foreground"
            >
              Clear history
            </Button>
          )}
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            title="Sessions Completed"
            value={todayCompletedWorkSessions}
            icon={<CheckCircle2 size={14} />}
          />

          <InfoCard
            title="Total Focus Time"
            value={`${todayFocusMinutes}m`}
            icon={<Timer size={14} />}
          />

          <InfoCard
            title="Best Streak"
            value={`${bestTodayStreak} ${
              bestTodayStreak === 1 ? 'session' : 'sessions'
            }`}
            icon={<Flame size={14} />}
          />
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="w-full max-w-2xl mt-5">
        <CardHeader>
          <CardTitle className="text-base">
            Recent Focus Sessions
          </CardTitle>
        </CardHeader>

        <CardContent>
          {todayHistory.filter(item => item.type === 'work').length ===
          0 ? (
            <div className="py-8 text-center">
              <Timer
                size={32}
                className="mx-auto mb-2 text-muted-foreground/40"
              />
              <p className="text-sm text-muted-foreground">
                No completed focus sessions today.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a session and your history will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayHistory
                .filter(item => item.type === 'work')
                .slice(0, 5)
                .map(item => {
                  const subject = subjects.find(
                    current => current.id === item.subjectId,
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            Focus session
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                            {subject?.name ?? 'No subject'} ·{' '}
                            {new Date(
                              item.completedAt,
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {item.duration} min
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="w-full max-w-2xl mt-5">
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-4">
            How Pomodoro Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-2 dark:bg-red-950/30">
                <Brain size={16} />
              </div>

              <p className="text-sm font-medium">
                {settings.work} min
              </p>

              <p className="text-xs text-muted-foreground">
                Focused work
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-2 dark:bg-green-950/30">
                <Clock size={16} />
              </div>

              <p className="text-sm font-medium">
                {settings.shortBreak} min
              </p>

              <p className="text-xs text-muted-foreground">
                Short break
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-2 dark:bg-blue-950/30">
                <Trophy size={16} />
              </div>

              <p className="text-sm font-medium">
                {settings.longBreak} min
              </p>

              <p className="text-xs text-muted-foreground">
                Long break after 4
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}