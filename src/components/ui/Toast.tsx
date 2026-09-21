'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';

import { cn } from '@/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

export interface AddToastInput {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: AddToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

const toastConfig: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    iconClassName: string;
    borderClassName: string;
    backgroundClassName: string;
    titleClassName: string;
    messageClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-green-500',
    borderClassName: 'border-green-200 dark:border-green-800',
    backgroundClassName: 'bg-green-50 dark:bg-green-950/40',
    titleClassName: 'text-green-900 dark:text-green-100',
    messageClassName: 'text-green-800 dark:text-green-200',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'text-red-500',
    borderClassName: 'border-red-200 dark:border-red-800',
    backgroundClassName: 'bg-red-50 dark:bg-red-950/40',
    titleClassName: 'text-red-900 dark:text-red-100',
    messageClassName: 'text-red-800 dark:text-red-200',
  },
  warning: {
    icon: TriangleAlert,
    iconClassName: 'text-yellow-500',
    borderClassName: 'border-yellow-200 dark:border-yellow-800',
    backgroundClassName: 'bg-yellow-50 dark:bg-yellow-950/40',
    titleClassName: 'text-yellow-900 dark:text-yellow-100',
    messageClassName: 'text-yellow-800 dark:text-yellow-200',
  },
  info: {
    icon: Info,
    iconClassName: 'text-blue-500',
    borderClassName: 'border-blue-200 dark:border-blue-800',
    backgroundClassName: 'bg-blue-50 dark:bg-blue-950/40',
    titleClassName: 'text-blue-900 dark:text-blue-100',
    messageClassName: 'text-blue-800 dark:text-blue-200',
  },
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((previous) =>
      previous.filter((toast) => toast.id !== id),
    );
  }, []);

  const addToast = useCallback(
    (toast: AddToastInput): string => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 9)}`;

      const duration =
        toast.duration === undefined
          ? DEFAULT_DURATION
          : Math.max(0, toast.duration);

      const nextToast: Toast = {
        ...toast,
        id,
        duration,
      };

      setToasts((previous) => [...previous, nextToast]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timersRef.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });

      timersRef.current.clear();
    };
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearToasts,
    }),
    [toasts, addToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        className={cn(
          'pointer-events-none fixed inset-x-4 bottom-4 z-50',
          'flex max-w-sm flex-col gap-2 sm:left-auto sm:right-4 sm:max-w-md',
        )}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({
  toast,
  onRemove,
}: ToastItemProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'pointer-events-auto w-full',
        'animate-slide-in',
        'rounded-xl border p-4 shadow-lg',
        'backdrop-blur-md',
        config.borderClassName,
        config.backgroundClassName,
      )}
      role={toast.type === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon
            className={cn('h-5 w-5', config.iconClassName)}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          {toast.description && (
            <p
              className={cn(
                'text-sm font-semibold',
                config.titleClassName,
              )}
            >
              {toast.description}
            </p>
          )}

          <p
            className={cn(
              'text-sm leading-5',
              toast.description && 'mt-0.5',
              config.messageClassName,
            )}
          >
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'shrink-0 rounded-md p-1',
            'text-muted-foreground',
            'transition-colors',
            'hover:bg-black/5 hover:text-foreground',
            'dark:hover:bg-white/10',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
          )}
          aria-label="Dismiss notification"
        >
          <X
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}