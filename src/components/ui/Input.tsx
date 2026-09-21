'use client';

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';

import { cn } from '@/utils';

/* -------------------------------------------------------------------------- */
/* Input variants                                                              */
/* -------------------------------------------------------------------------- */

const inputVariants = {
  variant: {
    default:
      'bg-background border-input shadow-sm',

    outline:
      'bg-background border-input',
  },

  size: {
    'icon-xs':
      'h-6 w-6',

    'icon-sm':
      'h-8 w-8',

    'icon-md':
      'h-10 w-10',

    'icon-lg':
      'h-12 w-12',

    'icon-xl':
      'h-14 w-14',

    default:
      'h-9 px-3',

    sm:
      'h-8 px-2 text-xs',

    lg:
      'h-10 px-4 text-sm',

    icon:
      'h-9 w-9',

    'icon-round':
      'h-9 w-9 rounded-full border-2 border-input',

    'h-12':
      'h-12 px-4 text-base',

    'h-14':
      'h-14 px-4 text-lg',

    'icon-gradient':
      'h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Input                                                                       */
/* -------------------------------------------------------------------------- */

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size'
  > {
  icon?: ReactNode;
  error?: string;
  label?: string;
  variant?: keyof typeof inputVariants.variant;
  inputSize?: keyof typeof inputVariants.size;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'default',
      type = 'text',
      error,
      icon,
      label,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const generatedId = id ?? `nexastudy-input-${reactId}`;

    const errorId = error
      ? `${generatedId}-error`
      : undefined;

    const describedBy = [
      ariaDescribedBy,
      errorId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={generatedId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              disabled
                ? 'text-muted-foreground/60'
                : 'text-foreground',
            )}
          >
            {label}

            {required && (
              <span
                className="ml-1 text-red-500"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              className={cn(
                'pointer-events-none absolute left-3 top-1/2',
                '-translate-y-1/2',
                'text-muted-foreground',
                disabled && 'opacity-50',
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={generatedId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'flex w-full rounded-md border',
              'bg-background px-3 py-2 text-sm',
              'transition-colors',
              'file:border-0 file:bg-transparent',
              'file:text-sm file:font-medium',
              'file:text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-ring',
              'focus:ring-offset-0',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50',
              'disabled:bg-muted/50',
              icon && 'pl-10',
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
              inputVariants.variant[variant],
              inputVariants.size[inputSize],
              className,
            )}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-xs font-medium text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

/* -------------------------------------------------------------------------- */
/* Textarea                                                                    */
/* -------------------------------------------------------------------------- */

export function Textarea({
  className,
  disabled,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      disabled={disabled}
      className={cn(
        'flex min-h-20 w-full rounded-md border',
        'border-input bg-background',
        'px-3 py-2 text-sm',
        'transition-colors',
        'placeholder:text-muted-foreground',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-0',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'disabled:bg-muted/50',
        'resize-none',
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Label                                                                       */
/* -------------------------------------------------------------------------- */

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border',
        'bg-card shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* CardHeader                                                                  */
/* -------------------------------------------------------------------------- */

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* CardTitle                                                                   */
/* -------------------------------------------------------------------------- */

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-base font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* CardContent                                                                 */
/* -------------------------------------------------------------------------- */

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'p-6 pt-0',
        className,
      )}
      {...props}
    />
  );
}