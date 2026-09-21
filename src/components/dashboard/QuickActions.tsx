'use client';

import {
  Calculator,
  CalendarPlus,
  FileText,
  ListTodo,
  NotebookPen,
  Play,
} from 'lucide-react';

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: typeof Calculator;
}

const actions: QuickAction[] = [
  {
    label: 'Add task',
    description: 'Create a new task',
    href: '/tasks',
    icon: ListTodo,
  },
  {
    label: 'Start studying',
    description: 'Open study session',
    href: '/study',
    icon: Play,
  },
  {
    label: 'New note',
    description: 'Capture an idea',
    href: '/notes',
    icon: NotebookPen,
  },
  {
    label: 'Calendar event',
    description: 'Schedule something',
    href: '/calendar',
    icon: CalendarPlus,
  },
  {
    label: 'Calculator',
    description: 'Solve calculations',
    href: '/calculators',
    icon: Calculator,
  },
  {
    label: 'Documents',
    description: 'Open your documents',
    href: '/documents',
    icon: FileText,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jump directly into your most-used tools.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              key={action.label}
              href={action.href}
              className="group rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </div>

              <p className="text-sm font-medium">
                {action.label}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {action.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}