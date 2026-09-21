'use client';

import { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  BookOpen,
  Clock,
  Save,
  Trash2,
  LogOut,
  Shield,
  Download,
  Briefcase,
  Check,
  Edit3,
  Camera,
  Phone,
  Globe,
  Upload,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, Spinner } from '@/components/ui/Header';
import { cn } from '@/utils';

interface Profile {
  name: string;
  email: string;
  avatar: string | null;
  university: string;
  department: string;
  semester: number;
  academicYear: string;
  bio: string;
  phone: string;
  website: string;
  linkedin: string;
}

interface FormData extends Profile {}

const PROFILE_STORAGE_KEY = 'nexastudy_profile_v1';

const DEFAULT_PROFILE: Profile = {
  name: 'Student',
  email: 'student@example.com',
  avatar: null,
  university: 'University',
  department: 'Computer Science',
  semester: 5,
  academicYear: '2026-2027',
  bio: 'Student focused on learning, building useful applications, and improving technical skills.',
  phone: '',
  website: '',
  linkedin: '',
};

function getInitials(name: string) {
  const cleaned = name.trim();

  if (!cleaned) return 'ST';

  return cleaned
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function isValidUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getMemberSince() {
  return 'September 2024';
}

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile>(DEFAULT_PROFILE);

  const [formData, setFormData] =
    useState<FormData>(DEFAULT_PROFILE);

  const [showEditDialog, setShowEditDialog] =
    useState(false);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [hydrated, setHydrated] = useState(false);

  const [avatarError, setAvatarError] =
    useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  /*
   * Load profile from localStorage.
   */
  useEffect(() => {
    try {
      const savedProfile =
        window.localStorage.getItem(PROFILE_STORAGE_KEY);

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<Profile>;

        const restoredProfile: Profile = {
          ...DEFAULT_PROFILE,
          ...parsed,
        };

        setProfile(restoredProfile);
        setFormData(restoredProfile);
      }
    } catch {
      setProfile(DEFAULT_PROFILE);
      setFormData(DEFAULT_PROFILE);
    } finally {
      setHydrated(true);
    }
  }, []);

  /*
   * Persist profile whenever it changes.
   */
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile),
      );
    } catch {
      // Ignore localStorage failures.
    }
  }, [profile, hydrated]);

  function openEditDialog() {
    setFormData({ ...profile });
    setAvatarError(null);
    setShowEditDialog(true);
  }

  function handleCancel() {
    setFormData({ ...profile });
    setAvatarError(null);
    setShowEditDialog(false);
  }

  async function handleSave() {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedUniversity = formData.university.trim();
    const trimmedDepartment = formData.department.trim();

    if (!trimmedName) {
      alert('Please enter your name.');
      return;
    }

    if (!trimmedEmail) {
      alert('Please enter your email.');
      return;
    }

    if (!trimmedUniversity) {
      alert('Please enter your university.');
      return;
    }

    if (!trimmedDepartment) {
      alert('Please enter your department.');
      return;
    }

    if (
      formData.website &&
      !isValidUrl(normalizeUrl(formData.website))
    ) {
      alert('Please enter a valid website URL.');
      return;
    }

    if (
      formData.linkedin &&
      !isValidUrl(normalizeUrl(formData.linkedin))
    ) {
      alert('Please enter a valid LinkedIn URL.');
      return;
    }

    const safeSemester = Math.min(
      10,
      Math.max(1, Number(formData.semester) || 1),
    );

    const updatedProfile: Profile = {
      ...formData,
      name: trimmedName,
      email: trimmedEmail,
      university: trimmedUniversity,
      department: trimmedDepartment,
      semester: safeSemester,
      academicYear: formData.academicYear.trim(),
      bio: formData.bio.trim(),
      phone: formData.phone.trim(),
      website: normalizeUrl(formData.website),
      linkedin: normalizeUrl(formData.linkedin),
    };

    setSaving(true);

    /*
     * Small UI delay to provide feedback without pretending
     * that an external API call happened.
     */
    await new Promise(resolve => setTimeout(resolve, 250));

    setProfile(updatedProfile);
    setFormData(updatedProfile);
    setSaving(false);
    setShowEditDialog(false);
  }

  function handleAvatarClick() {
    avatarInputRef.current?.click();
  }

  function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setAvatarError('Avatar image must be smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setFormData(previous => ({
          ...previous,
          avatar: result,
        }));

        setProfile(previous => ({
          ...previous,
          avatar: result,
        }));

        setAvatarError(null);
      }
    };

    reader.onerror = () => {
      setAvatarError('Unable to read this image.');
    };

    reader.readAsDataURL(file);

    event.target.value = '';
  }

  function removeAvatar() {
    setFormData(previous => ({
      ...previous,
      avatar: null,
    }));

    setProfile(previous => ({
      ...previous,
      avatar: null,
    }));

    setAvatarError(null);
  }

  function exportData() {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile,
    };

    const blob = new Blob(
      [JSON.stringify(exportPayload, null, 2)],
      {
        type: 'application/json',
      },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'nexastudy-profile.json';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  function handleDeleteAccount() {
    try {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);

      /*
       * Clear other NexaStudy client-side data as part of the
       * frontend-only account reset.
       */
      const keysToRemove = [
        'nexastudy_notes_v1',
        'nexastudy_pomodoro_history',
        'nexastudy_pomodoro_settings',
      ];

      keysToRemove.forEach(key =>
        window.localStorage.removeItem(key),
      );
    } catch {
      // Ignore storage failures.
    }

    setProfile(DEFAULT_PROFILE);
    setFormData(DEFAULT_PROFILE);
    setShowDeleteDialog(false);
  }

  function handleLogout() {
    alert(
      'Authentication is not connected yet. This button will perform a real logout after the auth backend is added.',
    );
  }

  const displayProfile = profile;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">
            Profile
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your account information and student profile
          </p>
        </div>

        <Button
          onClick={openEditDialog}
          className="w-full sm:w-auto"
        >
          <Edit3 size={14} />
          Edit Profile
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 py-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              {displayProfile.avatar ? (
                <img
                  src={displayProfile.avatar}
                  alt={`${displayProfile.name} avatar`}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-background border border-border"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold ring-4 ring-background">
                  {getInitials(displayProfile.name)}
                </div>
              )}

              <button
                type="button"
                onClick={openEditDialog}
                aria-label="Change profile picture"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Camera size={13} />
              </button>
            </div>

            <h2 className="text-xl font-bold break-words">
              {displayProfile.name}
            </h2>

            <p className="text-sm text-muted-foreground break-all">
              {displayProfile.email}
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Building2 size={13} />
              <span className="truncate max-w-[240px]">
                {displayProfile.university}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <GraduationCap size={13} />

              <span>
                {displayProfile.department} · Semester{' '}
                {displayProfile.semester}
              </span>
            </div>

            {displayProfile.bio && (
              <p className="text-sm mt-5 text-muted-foreground max-w-sm mx-auto leading-6">
                {displayProfile.bio}
              </p>
            )}

            {/* Contact Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {displayProfile.phone && (
                <a
                  href={`tel:${displayProfile.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  <Phone size={12} />
                  Phone
                </a>
              )}

              {displayProfile.website && (
                <a
                  href={normalizeUrl(displayProfile.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  <Globe size={12} />
                  Website
                </a>
              )}

              {displayProfile.linkedin && (
                <a
                  href={normalizeUrl(displayProfile.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  <Globe size={12} />
                  LinkedIn
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Account Information
              </CardTitle>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              <ProfileRow
                icon={<User size={14} />}
                label="Name"
                value={displayProfile.name}
              />

              <ProfileRow
                icon={<Mail size={14} />}
                label="Email"
                value={displayProfile.email}
              />

              <ProfileRow
                icon={<Phone size={14} />}
                label="Phone"
                value={displayProfile.phone || 'Not set'}
              />

              <ProfileRow
                icon={<Shield size={14} />}
                label="Member since"
                value={getMemberSince()}
              />

              <ProfileRow
                icon={<Building2 size={14} />}
                label="University"
                value={displayProfile.university}
              />

              <ProfileRow
                icon={<GraduationCap size={14} />}
                label="Department"
                value={displayProfile.department}
              />

              <ProfileRow
                icon={<BookOpen size={14} />}
                label="Semester"
                value={`${displayProfile.semester} (${displayProfile.academicYear})`}
              />
            </CardContent>
          </Card>

          {/* Academic Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Academic Profile
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatBox
                  icon={<GraduationCap size={15} />}
                  label="Semester"
                  value={String(displayProfile.semester)}
                />

                <StatBox
                  icon={<BookOpen size={15} />}
                  label="Academic Year"
                  value={displayProfile.academicYear}
                />

                <StatBox
                  icon={<Briefcase size={15} />}
                  label="Department"
                  value={displayProfile.department}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                About
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-6">
                {displayProfile.bio ||
                  'No bio yet. Edit your profile to add one.'}
              </div>
            </CardContent>
          </Card>

          {/* Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Active Sessions
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <SessionRow
                  current
                  title="Current browser session"
                  subtitle="This device · Active now"
                  onLogout={handleLogout}
                />

                <SessionRow
                  title="Previous browser session"
                  subtitle="Session history will be available after authentication is connected."
                  onLogout={handleLogout}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Data & Privacy
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/20">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Export your profile
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Download your current profile information as JSON.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={exportData}
                >
                  <Download size={13} />
                  Export
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-600">
                    Reset local account data
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Remove your local profile and NexaStudy demo data.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 shrink-0 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/40"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 size={13} />
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={handleCancel}
        title="Edit Profile"
        description="Update your student profile information"
      >
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSave();
          }}
          className="space-y-5"
        >
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-border bg-muted/20">
            <div className="shrink-0">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xl font-bold">
                  {getInitials(formData.name)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium">
                Profile picture
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or other image · Maximum 2 MB
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                >
                  <Upload size={13} />
                  Choose Image
                </Button>

                {formData.avatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                  >
                    Remove
                  </Button>
                )}
              </div>

              {avatarError && (
                <p className="text-xs text-red-600 mt-2">
                  {avatarError}
                </p>
              )}
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full name" required>
              <Input
                value={formData.name}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="Your full name"
              />
            </FormField>

            <FormField label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                placeholder="you@example.com"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="University" required>
              <Input
                value={formData.university}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    university: event.target.value,
                  }))
                }
                placeholder="University name"
              />
            </FormField>

            <FormField label="Department" required>
              <Input
                value={formData.department}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    department: event.target.value,
                  }))
                }
                placeholder="Computer Science"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Semester">
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.semester}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    semester: Math.min(
                      10,
                      Math.max(
                        1,
                        Number(event.target.value) || 1,
                      ),
                    ),
                  }))
                }
              />
            </FormField>

            <FormField label="Academic Year">
              <Input
                value={formData.academicYear}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    academicYear: event.target.value,
                  }))
                }
                placeholder="2026-2027"
              />
            </FormField>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone">
              <Input
                value={formData.phone}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
                placeholder="+91 ..."
              />
            </FormField>

            <FormField label="Website">
              <Input
                value={formData.website}
                onChange={event =>
                  setFormData(previous => ({
                    ...previous,
                    website: event.target.value,
                  }))
                }
                placeholder="https://example.com"
              />
            </FormField>
          </div>

          <FormField label="LinkedIn">
            <Input
              value={formData.linkedin}
              onChange={event =>
                setFormData(previous => ({
                  ...previous,
                  linkedin: event.target.value,
                }))
              }
              placeholder="https://linkedin.com/in/username"
            />
          </FormField>

          {/* Bio */}
          <FormField label="Bio">
            <textarea
              value={formData.bio}
              onChange={event =>
                setFormData(previous => ({
                  ...previous,
                  bio: event.target.value,
                }))
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-28"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />

            <div className="flex justify-end mt-1">
              <span className="text-[11px] text-muted-foreground">
                {formData.bio.length}/500
              </span>
            </div>
          </FormField>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <Spinner
                  size={14}
                  className="mr-2"
                />
              ) : (
                <Save
                  size={14}
                  className="mr-2"
                />
              )}

              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Reset Data Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Reset Local Data?"
        description="This action removes locally stored NexaStudy demo data."
      >
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/20 p-4">
            <AlertTriangle
              size={18}
              className="text-red-600 shrink-0 mt-0.5"
            />

            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                This cannot be undone.
              </p>

              <p className="text-xs text-muted-foreground mt-1 leading-5">
                Your locally stored profile, notes, and Pomodoro
                demo data will be removed from this browser.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={14} />
              Reset Local Data
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>

        <span className="text-sm text-muted-foreground">
          {label}
        </span>
      </div>

      <span className="text-sm font-medium text-right break-words max-w-[55%]">
        {value}
      </span>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="text-sm font-semibold break-words">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        {label}
        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function SessionRow({
  current = false,
  title,
  subtitle,
  onLogout,
}: {
  current?: boolean;
  title: string;
  subtitle: string;
  onLogout: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-3 rounded-lg border border-border',
        current
          ? 'bg-card'
          : 'bg-card opacity-70',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            current
              ? 'bg-green-100 text-green-600 dark:bg-green-950/30'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {current ? (
            <Check size={13} />
          ) : (
            <Clock size={13} />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {title}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8 shrink-0"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
      >
        {current ? (
          <LogOut size={12} />
        ) : (
          <ExternalLink size={12} />
        )}
      </Button>
    </div>
  );
}