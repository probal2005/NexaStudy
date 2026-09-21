'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GitBranch,
  Loader2,
  Mail,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';

const SIGNUP_STORAGE_KEY = 'nexastudy_signup_v1';
const PROFILE_STORAGE_KEY = 'nexastudy_profile_v1';
const AUTH_STORAGE_KEY = 'nexastudy_auth_v1';

interface SignupAccount {
  name: string;
  email: string;
  password: string;
  phone: string;
  university: string;
  createdAt: string;
}

interface StoredProfile {
  name: string;
  email: string;
  phone: string;
  university: string;
  avatar: string;
}

interface StoredAuth {
  isAuthenticated: boolean;
  email: string;
  rememberMe: boolean;
  loggedInAt: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStepOne = (): string | null => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return 'Please enter your full name.';
    }

    if (normalizedName.length < 2) {
      return 'Your name must contain at least 2 characters.';
    }

    if (!normalizedEmail) {
      return 'Please enter your email address.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Please create a password.';
    }

    if (password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    return null;
  };

  const validateStepTwo = (): string | null => {
    if (phone.trim() && !/^[+\d\s().-]{7,20}$/.test(phone.trim())) {
      return 'Please enter a valid phone number.';
    }

    if (!university.trim()) {
      return 'Please enter your university or institution.';
    }

    if (!confirmPassword) {
      return 'Please confirm your password.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    if (!agreeToTerms) {
      return 'Please agree to the Terms of Service and Privacy Policy.';
    }

    return null;
  };

  const handleContinue = () => {
    setError('');

    const validationError = validateStepOne();

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const stepOneError = validateStepOne();

    if (stepOneError) {
      setStep(1);
      setError(stepOneError);
      return;
    }

    const stepTwoError = validateStepTwo();

    if (stepTwoError) {
      setError(stepTwoError);
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = name.trim();

      /*
       * Check whether an account already exists.
       */
      const existingAccount = window.localStorage.getItem(
        SIGNUP_STORAGE_KEY,
      );

      if (existingAccount) {
        try {
          const account = JSON.parse(existingAccount) as SignupAccount;

          if (account.email?.toLowerCase() === normalizedEmail) {
            setError(
              'An account with this email already exists. Please sign in instead.',
            );
            setIsSubmitting(false);
            return;
          }
        } catch {
          // Ignore malformed old demo data.
        }
      }

      const account: SignupAccount = {
        name: normalizedName,
        email: normalizedEmail,
        password,
        phone: phone.trim(),
        university: university.trim(),
        createdAt: new Date().toISOString(),
      };

      /*
       * Store demo account.
       *
       * IMPORTANT:
       * This is frontend demo storage only.
       * Passwords must NOT be stored this way in a production app.
       */
      window.localStorage.setItem(
        SIGNUP_STORAGE_KEY,
        JSON.stringify(account),
      );

      /*
       * Create the profile used by the dashboard/profile page.
       */
      const profile: StoredProfile = {
        name: normalizedName,
        email: normalizedEmail,
        phone: phone.trim(),
        university: university.trim(),
        avatar: '',
      };

      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile),
      );

      /*
       * Automatically sign the newly created demo account in.
       */
      const authState: StoredAuth = {
        isAuthenticated: true,
        email: normalizedEmail,
        rememberMe: true,
        loggedInAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(authState),
      );

      await new Promise((resolve) => setTimeout(resolve, 400));

      router.replace('/dashboard');
    } catch (signupError) {
      console.error('NexaStudy signup failed:', signupError);
      setError('Something went wrong while creating your account.');
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

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30" />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            NexaStudy
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your student workspace
          </p>
        </div>

        {/* Progress */}
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step >= 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>

            <span
              className={`hidden text-sm sm:inline ${
                step >= 1
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Account
            </span>
          </div>

          <div className="h-px w-10 bg-border sm:w-16" />

          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step >= 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>

            <span
              className={`hidden text-sm sm:inline ${
                step >= 2
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Profile
            </span>
          </div>
        </div>

        {/* Signup card */}
        <Card className="w-full shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1
                ? 'Create your account'
                : 'Complete your profile'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-name"
                      className="text-sm font-medium text-foreground"
                    >
                      Full name
                    </label>

                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isSubmitting}
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>

                    <Input
                      id="signup-email"
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
                      htmlFor="signup-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        disabled={isSubmitting}
                        className="pr-11"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
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

                    <p className="text-xs text-muted-foreground">
                      Use at least 8 characters for your password.
                    </p>
                  </div>

                  {/* Continue */}
                  <Button
                    type="button"
                    className="mt-1 w-full"
                    onClick={handleContinue}
                    disabled={isSubmitting}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* Social placeholders */}
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>

                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-xs text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() =>
                        setError(
                          'Google authentication will be connected when the backend authentication system is added.',
                        )
                      }
                    >
                      <span className="mr-2 font-semibold">G</span>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() =>
                        setError(
                          'GitHub authentication will be connected when the backend authentication system is added.',
                        )
                      }
                    >
                      <GitBranch className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  {/* University */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-university"
                      className="text-sm font-medium text-foreground"
                    >
                      University / Institution
                    </label>

                    <Input
                      id="signup-university"
                      name="university"
                      type="text"
                      autoComplete="organization"
                      placeholder="Your university or institution"
                      value={university}
                      onChange={(event) =>
                        setUniversity(event.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </label>

                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-confirm-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        disabled={isSubmitting}
                        className="pr-11"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current,
                          )
                        }
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {confirmPassword && (
                      <p
                        className={`text-xs ${
                          password === confirmPassword
                            ? 'text-emerald-600'
                            : 'text-destructive'
                        }`}
                      >
                        {password === confirmPassword
                          ? 'Passwords match.'
                          : 'Passwords do not match.'}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(event) =>
                        setAgreeToTerms(event.target.checked)
                      }
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
                    />

                    <label
                      htmlFor="terms"
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      I agree to the{' '}
                      <Link
                        href="#"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="#"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
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

                  {/* Create account */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Back */}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep(1);
                    }}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </>
              )}

              {/* Error for step 1 */}
              {step === 1 && error && (
                <div
                  role="alert"
                  className="order-first rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Login */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Demo notice */}
        <div className="mt-4 rounded-lg border border-border/60 bg-card/50 px-4 py-3 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              Frontend demo mode
            </span>
            {' — '}
            account data is stored locally in your browser.
            Real authentication can be connected later.
          </p>
        </div>
      </div>
    </main>
  );
}