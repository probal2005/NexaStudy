'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Bell,
  Check,
  Download,
  Globe,
  Info,
  Key,
  LogOut,
  Moon,
  Monitor,
  Palette,
  Save,
  Shield,
  Sun,
  User,
  X,
} from 'lucide-react';

type ThemeValue =
  | 'light'
  | 'dark'
  | 'system'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'midnight';

interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  semester: string;
  branch: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  deadline: boolean;
  exam: boolean;
  studyReminders: boolean;
}

interface UISettings {
  theme: ThemeValue;
  collapsedSidebar: boolean;
  compactMode: boolean;
  showWelcome: boolean;
}

interface SettingsState {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  ui: UISettings;
}

const STORAGE_KEY = 'nexastudy_settings_v1';

const DEFAULT_SETTINGS: SettingsState = {
  profile: {
    name: 'Student',
    email: '',
    phone: '',
    studentId: '',
    semester: '',
    branch: '',
  },
  notifications: {
    email: true,
    push: true,
    deadline: true,
    exam: true,
    studyReminders: false,
  },
  ui: {
    theme: 'system',
    collapsedSidebar: false,
    compactMode: false,
    showWelcome: true,
  },
};

const themes = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
  { value: 'ocean' as const, label: 'Ocean', icon: Globe },
  { value: 'sunset' as const, label: 'Sunset', icon: Sun },
  { value: 'forest' as const, label: 'Forest', icon: Palette },
  { value: 'midnight' as const, label: 'Midnight', icon: Moon },
];

const notificationLabels: Record<keyof NotificationSettings, string> = {
  email: 'Email Notifications',
  push: 'Push Notifications',
  deadline: 'Deadline Notifications',
  exam: 'Exam Notifications',
  studyReminders: 'Study Reminders',
};

function loadSettings(): SettingsState {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<SettingsState>;

    return {
      profile: {
        ...DEFAULT_SETTINGS.profile,
        ...(parsed.profile ?? {}),
      },
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(parsed.notifications ?? {}),
      },
      ui: {
        ...DEFAULT_SETTINGS.ui,
        ...(parsed.ui ?? {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: SettingsState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  const updateProfile = <K extends keyof ProfileSettings>(
    key: K,
    value: ProfileSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }));

    setSaved(false);
  };

  const updateNotification = (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));

    setSaved(false);
  };

  const updateUI = <K extends keyof UISettings>(
    key: K,
    value: UISettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      ui: {
        ...current.ui,
        [key]: value,
      },
    }));

    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleExport = () => {
    const exportData = {
      app: 'NexaStudy',
      exportedAt: new Date().toISOString(),
      settings,
    };

    downloadJson('nexastudy-settings.json', exportData);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all NexaStudy settings to their default values?',
    );

    if (!confirmed) {
      return;
    }

    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
  };

  const profileCompletion = useMemo(() => {
    const fields = Object.values(settings.profile);

    const completed = fields.filter(
      (value) => value.trim().length > 0,
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [settings.profile]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.dataset.theme = settings.ui.theme;

    if (settings.ui.compactMode) {
      document.documentElement.dataset.compact = 'true';
    } else {
      delete document.documentElement.dataset.compact;
    }
  }, [settings.ui.theme, settings.ui.compactMode, mounted]);

  if (!mounted) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and notifications
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading settings...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>

            {saved && (
              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                <Check size={13} className="mr-1" />
                Saved
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and notifications.
          </p>
        </div>

        <Button onClick={handleSave}>
          <Save size={16} className="mr-1.5" />
          Save Changes
        </Button>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} />
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">
                Profile completion
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your student information for a better workspace.
              </p>
            </div>

            <Badge variant="outline">
              {profileCompletion}% complete
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-name"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Full Name
              </label>

              <Input
                id="settings-name"
                value={settings.profile.name}
                onChange={(event) =>
                  updateProfile('name', event.target.value)
                }
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Email
              </label>

              <Input
                id="settings-email"
                type="email"
                value={settings.profile.email}
                onChange={(event) =>
                  updateProfile('email', event.target.value)
                }
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="settings-phone"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Phone
              </label>

              <Input
                id="settings-phone"
                type="tel"
                value={settings.profile.phone}
                onChange={(event) =>
                  updateProfile('phone', event.target.value)
                }
                placeholder="+91..."
              />
            </div>

            <div>
              <label
                htmlFor="settings-student-id"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Student ID
              </label>

              <Input
                id="settings-student-id"
                value={settings.profile.studentId}
                onChange={(event) =>
                  updateProfile('studentId', event.target.value)
                }
                placeholder="Your student ID"
              />
            </div>

            <div>
              <label
                htmlFor="settings-semester"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Semester
              </label>

              <Input
                id="settings-semester"
                value={settings.profile.semester}
                onChange={(event) =>
                  updateProfile('semester', event.target.value)
                }
                placeholder="e.g. 5"
              />
            </div>

            <div>
              <label
                htmlFor="settings-branch"
                className="text-sm font-medium text-muted-foreground block mb-1.5"
              >
                Branch / Program
              </label>

              <Input
                id="settings-branch"
                value={settings.profile.branch}
                onChange={(event) =>
                  updateProfile('branch', event.target.value)
                }
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button onClick={handleSave}>
              <Save size={16} className="mr-1.5" />
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={18} />
            Appearance
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Theme
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const active = settings.ui.theme === theme.value;

                return (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => updateUI('theme', theme.value)}
                    aria-pressed={active}
                    className={cn(
                      'flex min-h-[82px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-all',
                      active
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30',
                    )}
                  >
                    <Icon
                      size={21}
                      className={
                        active
                          ? 'text-accent'
                          : 'text-muted-foreground'
                      }
                    />

                    <span
                      className={cn(
                        'text-xs font-medium',
                        active
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Theme selection is stored locally in this browser. Custom
              themes require matching CSS variables in the application.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Collapsed Sidebar</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep the desktop sidebar minimized.
                </p>
              </div>

              <Switch
                checked={settings.ui.collapsedSidebar}
                onChange={(event) =>
                  updateUI(
                    'collapsedSidebar',
                    event.target.checked,
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Compact Mode</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reduce spacing across supported components.
                </p>
              </div>

              <Switch
                checked={settings.ui.compactMode}
                onChange={(event) =>
                  updateUI('compactMode', event.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Show Welcome Content</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display welcome information on supported pages.
                </p>
              </div>

              <Switch
                checked={settings.ui.showWelcome}
                onChange={(event) =>
                  updateUI('showWelcome', event.target.checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {(Object.keys(notificationLabels) as Array<
            keyof NotificationSettings
          >).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {notificationLabels[key]}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {key === 'email' &&
                    'Receive important updates through email.'}

                  {key === 'push' &&
                    'Allow browser/app notifications when supported.'}

                  {key === 'deadline' &&
                    'Get reminders for approaching deadlines.'}

                  {key === 'exam' &&
                    'Receive reminders about upcoming exams.'}

                  {key === 'studyReminders' &&
                    'Receive reminders for planned study sessions.'}
                </p>
              </div>

              <Switch
                checked={settings.notifications[key]}
                onChange={(event) =>
                  updateNotification(key, event.target.checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} />
            Privacy & Security
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-1">
          <div className="flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Student Data Export</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download your currently stored NexaStudy settings.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
            >
              <Download size={16} className="mr-1.5" />
              Export
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Change Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Password management requires an authentication backend.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.alert(
                  'Password management is not connected yet. Add an authentication backend before enabling this feature.',
                )
              }
            >
              <Key size={16} className="mr-1.5" />
              Update
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Two-factor authentication is not connected in the
                current local-only version.
              </p>
            </div>

            <Badge className="bg-gray-100 text-gray-700">
              Not Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Local data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut size={18} />
            Local Data
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">
              NexaStudy is currently running locally
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Settings are stored in your browser using localStorage.
              There is no connected account or cloud sync yet.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={handleReset}
            >
              <X size={16} className="mr-1.5" />
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={18} />
            About NexaStudy
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-foreground">
                NexaStudy
              </p>
              <p className="text-muted-foreground mt-1">
                Complete Student Workspace
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Version</p>
              <p className="text-muted-foreground mt-1">
                1.0.0
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Frontend</p>
              <p className="text-muted-foreground mt-1">
                Next.js 16 + React 19 + TypeScript
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Styling</p>
              <p className="text-muted-foreground mt-1">
                Tailwind CSS v4
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
            © 2026 NexaStudy. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}