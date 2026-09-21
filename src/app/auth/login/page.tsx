'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LockKeyhole, Mail, BookOpen, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const AUTH_STORAGE_KEY = 'nexastudy_auth_v1';
const PROFILE_STORAGE_KEY = 'nexastudy_profile_v1';

interface StoredAuth {
  isAuthenticated: boolean;
  email: string;
  rememberMe: boolean;
  loggedInAt: string;
}

interface StoredProfile {
  name?: string;
  email?: string;
  avatar?: string;
}

interface StoredSignup {
  name?: string;
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  /*
   * If the user is already logged in, don't show the login screen again.
   */
  useEffect(() => {
    try {
      const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedAuth) return;

      const auth = JSON.parse(storedAuth) as StoredAuth;

      if (auth.isAuthenticated) {
        router.replace('/dashboard');
      }
    } catch (storageError) {
      console.warn('Unable to read NexaStudy authentication state:', storageError);
    }
  }, [router]);

  const validateForm = (): string | null => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return 'Please enter your email address.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Please enter your password.';
    }

    if (password.length < 6) {
      return 'Password must contain at least 6 characters.';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      /*
       * Demo authentication:
       *
       * If a signup account exists in localStorage, validate against it.
       * Otherwise allow demo login so the frontend remains easy to explore.
       */
      const storedSignup = window.localStorage.getItem('nexastudy_signup_v1');

      if (storedSignup) {
        try {
          const signup = JSON.parse(storedSignup) as StoredSignup;

          if (
            signup.email &&
            signup.email.toLowerCase() === normalizedEmail &&
            signup.password &&
            signup.password !== password
          ) {
            setError('Incorrect password. Please try again.');
            setIsSubmitting(false);
            return;
          }
        } catch {
          // Ignore malformed demo signup data and continue in demo mode.
        }
      }

      const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

      let profile: StoredProfile = {
        name: normalizedEmail.split('@')[0] || 'Student',
        email: normalizedEmail,
      };

      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile) as StoredProfile;

          profile = {
            ...profile,
            ...parsedProfile,
            email: parsedProfile.email || normalizedEmail,
          };
        } catch {
          // Keep the fallback profile.
        }
      }

      /*
       * Keep profile email synchronized with the account used for login.
       */
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile),
      );

      const authState: StoredAuth = {
        isAuthenticated: true,
        email: normalizedEmail,
        rememberMe,
        loggedInAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(authState),
      );

      /*
       * Small delay gives the user feedback that the form is processing.
       * There is no real network request in frontend-only demo mode.
       */
      await new Promise((resolve) => setTimeout(resolve, 350));

      router.replace('/dashboard');
    } catch (loginError) {
      console.error('NexaStudy login failed:', loginError);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-40 -top-40 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[360px] w-[360px] rounded-full bg-accent/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30" />
      </div>

      {/* Login container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            NexaStudy
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Your Complete Student Workspace
          </p>
        </div>

        {/* Auth card */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-7">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue to your workspace
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>

              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  icon={<LockKeyhole className="h-4 w-4" />}
                  className="pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-input accent-primary"
                />

                <span className="text-muted-foreground">
                  Remember me
                </span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="mt-1 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Signup */}
          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </div>
        </section>

        {/* Demo information */}
        <div className="mt-5 rounded-lg border border-border/60 bg-card/50 px-4 py-3 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              Frontend demo mode
            </span>
            {' — '}
            authentication is currently stored locally in your browser.
            A real backend authentication service can be connected later.
          </p>
        </div>
      </div>
    </main>
  );
}