'use client';

import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';

import { cn } from '@/utils';

/* -------------------------------------------------------------------------- */
/* Badge                                                                       */
/* -------------------------------------------------------------------------- */

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const badgeVariants = {
  variant: {
    default:
      'border-transparent bg-primary text-primary-foreground shadow-sm',

    secondary:
      'border-transparent bg-secondary text-secondary-foreground',

    destructive:
      'border-red-200 bg-red-500/10 text-red-600 dark:border-red-800 dark:text-red-400',

    outline:
      'border border-border bg-transparent text-foreground',
  },

  size: {
    default:
      'rounded-full px-2.5 py-0.5 text-xs font-medium',

    sm:
      'rounded-full px-2 py-0.5 text-[10px] font-medium',

    lg:
      'rounded-full px-3 py-1 text-sm font-medium',

    icon:
      'flex h-6 w-6 items-center justify-center rounded-full',
  },
} as const;

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* ProgressBar                                                                 */
/* -------------------------------------------------------------------------- */

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'error';
  variant?: 'default' | 'gradient' | 'striped';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  size = 'md',
  color = 'default',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;

  const percentage = Math.min(
    Math.max((value / safeMax) * 100, 0),
    100,
  );

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  } as const;

  const colorMap = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  } as const;

  const variantStyles = {
    default: '',
    gradient:
      'bg-gradient-to-r from-primary to-accent',

    striped:
      'bg-gradient-to-r from-primary/30 via-primary to-primary/30 bg-[length:400%_400%] animate-shimmer',
  } as const;

  return (
    <div className="flex w-full items-center gap-2">
      {label && (
        <span className="w-20 shrink-0 truncate text-xs text-muted-foreground">
          {label}
        </span>
      )}

      <div
        className={cn(
          'flex-1 overflow-hidden rounded-full bg-muted',
          sizes[size],
          className,
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={Math.min(
          Math.max(value, 0),
          safeMax,
        )}
        aria-label={label ?? 'Progress'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorMap[color],
            variantStyles[variant],
          )}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {showLabel && (
        <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* InfoCard                                                                    */
/* -------------------------------------------------------------------------- */

interface InfoCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  value?: string | number;
  trend?: string;
  className?: string;
}

export function InfoCard({
  icon,
  title,
  description,
  value,
  trend,
  className,
}: InfoCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg bg-muted/50 p-3',
        className,
      )}
    >
      {icon && (
        <div
          className="mt-0.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">
            {title}
          </p>

          {value !== undefined && (
            <span className="ml-auto shrink-0 text-sm font-semibold">
              {value}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        )}

        {trend && (
          <p className="mt-1 text-xs font-medium text-primary">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EmptyState                                                                  */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div
          className="mb-3 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <p className="text-sm font-medium text-foreground">
        {title}
      </p>

      {description && (
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            'mt-4 rounded-lg px-4 py-2 text-sm font-medium',
            'bg-primary text-primary-foreground',
            'transition-colors hover:bg-primary/90',
            'focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Spinner                                                                     */
/* -------------------------------------------------------------------------- */

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Spinner({
  size = 20,
  className,
  label = 'Loading',
}: SpinnerProps) {
  return (
    <span
      className="inline-flex items-center justify-center"
      role="status"
      aria-label={label}
    >
      <svg
        className={cn('animate-spin', className)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />

        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
        />
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                      */
/* -------------------------------------------------------------------------- */

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: string;
}

export function Avatar({
  src,
  alt = 'User avatar',
  size = 40,
  className,
  fallback = 'U',
}: AvatarProps) {
  const initials =
    fallback.trim().slice(0, 2).toUpperCase() || 'U';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className={cn(
          'rounded-full object-cover',
          className,
        )}
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'flex items-center justify-center rounded-full',
        'bg-gradient-to-br from-primary to-accent',
        'font-bold text-primary-foreground',
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {initials}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dialog                                                                      */
/* -------------------------------------------------------------------------- */

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={
        description ? descriptionId : undefined
      }
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        className={cn(
          'relative z-10 w-full max-w-lg',
          'rounded-xl border border-border',
          'bg-card shadow-xl',
          'animate-modal-in',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'shrink-0 rounded-md p-1.5',
              'text-muted-foreground',
              'transition-colors',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-ring',
            )}
            aria-label="Close dialog"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

export function Menu({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function MenuTrigger({
  children,
  className,
  onClick,
  ariaLabel,
}: MenuTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-md p-1',
        'transition-colors',
        'hover:bg-muted',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* MenuItem                                                                    */
/* -------------------------------------------------------------------------- */

interface MenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  className?: string;
  disabled?: boolean;
}

export function MenuItem({
  children,
  icon,
  onClick,
  danger = false,
  className,
  disabled = false,
}: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2',
        'rounded-md px-3 py-2',
        'text-left text-sm',
        'transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        danger
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20'
          : 'text-foreground hover:bg-muted',
        className,
      )}
    >
      {icon && (
        <span
          className="flex shrink-0"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span className="min-w-0 flex-1">
        {children}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                        */
/* -------------------------------------------------------------------------- */

export function Tabs({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="flex gap-1 overflow-x-auto rounded-lg bg-muted/30 p-1"
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function Tab({
  children,
  active = false,
  onClick,
  disabled = false,
}: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-0 flex-1 rounded-md px-3 py-1.5',
        'text-sm transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Switch                                                                      */
/* -------------------------------------------------------------------------- */

interface SwitchProps {
  checked?: boolean;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Switch({
  checked = false,
  onChange,
  className,
  id,
  disabled = false,
  ariaLabel,
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          'relative h-5 w-9 rounded-full',
          'transition-colors duration-200',
          'ring-offset-background',
          checked
            ? 'bg-primary'
            : 'bg-muted-foreground/30',
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5',
            'h-4 w-4 rounded-full',
            'bg-white shadow-sm',
            'transition-transform duration-200',
            checked
              ? 'translate-x-4'
              : 'translate-x-0',
          )}
        />
      </span>
    </label>
  );
}