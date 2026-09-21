'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog, EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  BookOpen,
  X,
} from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

type EventType =
  | 'class'
  | 'exam'
  | 'assignment'
  | 'study'
  | 'personal'
  | 'reminder'
  | 'holiday';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: EventType;
  color: string;
  subjectId: string | null;
  taskId: string | null;
  recurring: boolean;
  reminder: number;
  createdAt: string;
}

interface EventFormData {
  title: string;
  description: string;
  type: EventType;
  allDay: boolean;
  date: string;
  startTime: string;
  endTime: string;
  reminder: number;
  subjectId: string;
  color: string;
}

const eventColors: Record<EventType, string> = {
  class: '#3B82F6',
  exam: '#EF4444',
  assignment: '#F59E0B',
  study: '#10B981',
  personal: '#8B5CF6',
  reminder: '#EC4899',
  holiday: '#14B8A6',
};

const eventLabels: Record<EventType, string> = {
  class: 'Class',
  exam: 'Exam',
  assignment: 'Assignment',
  study: 'Study',
  personal: 'Personal',
  reminder: 'Reminder',
  holiday: 'Holiday',
};

const eventIcons: Record<EventType, typeof CalendarIcon> = {
  class: CalendarIcon,
  exam: AlertTriangle,
  assignment: Clock,
  study: CheckCircle2,
  personal: User,
  reminder: Bell,
  holiday: MapPin,
};

const subjectOptions = [
  { id: 's1', name: 'DBMS' },
  { id: 's2', name: 'Physics' },
  { id: 's3', name: 'Mathematics' },
  { id: 's4', name: 'Chemistry' },
  { id: 's5', name: 'Economics' },
];

const seedEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Physics Lab - Optics Experiment',
    description: 'Optics lab session. Bring lab manual and safety goggles.',
    start: new Date(2026, 8, 19, 10, 0),
    end: new Date(2026, 8, 19, 12, 0),
    allDay: false,
    type: 'class',
    color: eventColors.class,
    subjectId: 's2',
    taskId: null,
    recurring: false,
    reminder: 30,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '2',
    title: 'DBMS Tutorial',
    description: 'Tutorial on query optimization techniques.',
    start: new Date(2026, 8, 19, 14, 0),
    end: new Date(2026, 8, 19, 15, 30),
    allDay: false,
    type: 'class',
    color: eventColors.class,
    subjectId: 's1',
    taskId: null,
    recurring: true,
    reminder: 15,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '3',
    title: 'Study Group - Calculus',
    description:
      'Group study session for Calculus II. Focus on integration techniques.',
    start: new Date(2026, 8, 19, 16, 0),
    end: new Date(2026, 8, 19, 18, 0),
    allDay: false,
    type: 'study',
    color: eventColors.study,
    subjectId: 's3',
    taskId: null,
    recurring: false,
    reminder: 60,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '4',
    title: 'Maths Mid-term Exam',
    description: 'Calculus II mid-term. Covers chapters 1-6.',
    start: new Date(2026, 8, 24, 9, 0),
    end: new Date(2026, 8, 24, 11, 0),
    allDay: false,
    type: 'exam',
    color: eventColors.exam,
    subjectId: 's3',
    taskId: null,
    recurring: false,
    reminder: 60,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '5',
    title: 'DBMS Project Submission',
    description:
      'Final project submission deadline. Upload to course portal.',
    start: new Date(2026, 8, 22, 23, 59),
    end: new Date(2026, 8, 22, 23, 59),
    allDay: false,
    type: 'assignment',
    color: eventColors.assignment,
    subjectId: 's1',
    taskId: null,
    recurring: false,
    reminder: 240,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '6',
    title: 'Chemistry Lab - Titration',
    description:
      'Acid-base titration experiment. Prepare worksheet beforehand.',
    start: new Date(2026, 8, 21, 13, 0),
    end: new Date(2026, 8, 21, 16, 0),
    allDay: false,
    type: 'class',
    color: eventColors.class,
    subjectId: 's4',
    taskId: null,
    recurring: false,
    reminder: 30,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '7',
    title: 'Weekend Study Plan',
    description: 'Review all subjects for upcoming week. 4 hours planned.',
    start: new Date(2026, 8, 20, 9, 0),
    end: new Date(2026, 8, 20, 13, 0),
    allDay: false,
    type: 'study',
    color: eventColors.study,
    subjectId: null,
    taskId: null,
    recurring: false,
    reminder: 30,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '8',
    title: 'Doctor Appointment',
    description: 'Annual health checkup at city hospital.',
    start: new Date(2026, 8, 23, 10, 0),
    end: new Date(2026, 8, 23, 11, 0),
    allDay: false,
    type: 'personal',
    color: eventColors.personal,
    subjectId: null,
    taskId: null,
    recurring: false,
    reminder: 60,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '9',
    title: 'Library Study Session',
    description: 'Study in the library. Focus on Economics topics.',
    start: new Date(2026, 8, 25, 14, 0),
    end: new Date(2026, 8, 25, 17, 0),
    allDay: false,
    type: 'study',
    color: eventColors.study,
    subjectId: 's5',
    taskId: null,
    recurring: false,
    reminder: 15,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '10',
    title: 'Physics Final Exam',
    description: 'Comprehensive final exam. All chapters.',
    start: new Date(2026, 9, 15, 9, 0),
    end: new Date(2026, 9, 15, 12, 0),
    allDay: false,
    type: 'exam',
    color: eventColors.exam,
    subjectId: 's2',
    taskId: null,
    recurring: false,
    reminder: 1440,
    createdAt: '2026-09-15T10:00:00',
  },
  {
    id: '11',
    title: 'Holi Festival',
    description: "India's festival of colors - no classes.",
    start: new Date(2026, 2, 25, 0, 0),
    end: new Date(2026, 2, 25, 23, 59),
    allDay: true,
    type: 'holiday',
    color: eventColors.holiday,
    subjectId: null,
    taskId: null,
    recurring: false,
    reminder: 0,
    createdAt: '2026-09-15T10:00:00',
  },
];

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createDateFromInputs(
  date: string,
  time: string,
  fallbackTime: string,
) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = (time || fallbackTime).split(':').map(Number);

  return new Date(
    year,
    month - 1,
    day,
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
  );
}

function getInitialFormData(date: Date): EventFormData {
  return {
    title: '',
    description: '',
    type: 'study',
    allDay: false,
    date: toDateInputValue(date),
    startTime: '09:00',
    endTime: '10:00',
    reminder: 15,
    subjectId: '',
    color: eventColors.study,
  };
}

function getSubjectName(subjectId: string | null) {
  if (!subjectId) return null;
  return subjectOptions.find((subject) => subject.id === subjectId)?.name ?? null;
}

export default function CalendarPage() {
  const initialDate = new Date(2026, 8, 19);

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [today] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);

  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  const [showEventDialog, setShowEventDialog] = useState(false);

  const [formData, setFormData] = useState<EventFormData>(
    getInitialFormData(initialDate),
  );

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const weeks: (Date | null)[][] = [];
    let dayIndex = 1 - firstDay;

    while (dayIndex <= days) {
      const week: (Date | null)[] = [];

      for (let i = 0; i < 7; i += 1) {
        if (dayIndex < 1 || dayIndex > days) {
          week.push(null);
        } else {
          week.push(new Date(year, month, dayIndex));
        }

        dayIndex += 1;
      }

      weeks.push(week);
    }

    return weeks;
  }, [currentDate]);

  const dayEvents = useMemo(
    () =>
      events
        .filter((event) => isSameDay(event.start, currentDate))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events, currentDate],
  );

  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay());
    return date;
  }, [currentDate]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return date;
      }),
    [weekStart],
  );

  const weekEvents = useMemo(() => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 7);

    return events
      .filter((event) => event.start >= start && event.start < end)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, weekStart]);

  const agendaEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => a.start.getTime() - b.start.getTime(),
      ),
    [events],
  );

  const openCreateDialog = (date = currentDate) => {
    setFormData(getInitialFormData(date));
    setShowEventDialog(true);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrev = () => {
    const date = new Date(currentDate);

    if (viewMode === 'month') {
      date.setMonth(date.getMonth() - 1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setDate(date.getDate() - 1);
    }

    setCurrentDate(date);
  };

  const goToNext = () => {
    const date = new Date(currentDate);

    if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setDate(date.getDate() + 1);
    }

    setCurrentDate(date);
  };

  const handleCreateEvent = () => {
    if (!formData.title.trim() || !formData.date) return;

    const start = formData.allDay
      ? createDateFromInputs(formData.date, '00:00', '00:00')
      : createDateFromInputs(formData.date, formData.startTime, '09:00');

    const end = formData.allDay
      ? createDateFromInputs(formData.date, '23:59', '23:59')
      : createDateFromInputs(formData.date, formData.endTime, '10:00');

    if (end < start) {
      return;
    }

    const newEvent: CalendarEvent = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      start,
      end,
      allDay: formData.allDay,
      type: formData.type,
      color: formData.color,
      subjectId: formData.subjectId || null,
      taskId: null,
      recurring: false,
      reminder: formData.reminder,
      createdAt: new Date().toISOString(),
    };

    setEvents((previous) => [...previous, newEvent]);
    setCurrentDate(start);
    setShowEventDialog(false);
    setSelectedEvent(newEvent);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    setEvents((previous) =>
      previous.filter((event) => event.id !== selectedEvent.id),
    );

    setSelectedEvent(null);
  };

  const renderEventCard = (
    event: CalendarEvent,
    compact = false,
  ) => {
    const Icon = eventIcons[event.type];

    return (
      <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEvent(event)}
        className={cn(
          'w-full text-left rounded-lg border border-border transition-colors hover:bg-muted/50',
          compact ? 'p-2' : 'p-3',
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: event.color }}
          >
            <Icon size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {event.title}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {event.allDay
                ? 'All day'
                : `${formatTime(event.start)} - ${formatTime(event.end)}`}
            </p>

            {!compact && event.description && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {event.description}
              </p>
            )}

            {!compact && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className="text-[10px]"
                  style={{
                    backgroundColor: event.color,
                    color: 'white',
                  }}
                >
                  {eventLabels[event.type]}
                </Badge>

                {getSubjectName(event.subjectId) && (
                  <span className="text-[10px] text-muted-foreground">
                    {getSubjectName(event.subjectId)}
                  </span>
                )}

                {event.reminder > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {event.reminder}m reminder
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Manage classes, exams, study sessions and personal events.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {(['month', 'week', 'day', 'agenda'] as ViewMode[]).map(
              (view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setViewMode(view)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                    viewMode === view
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  {view}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>

          <div className="flex items-center rounded-md border border-input">
            <button
              type="button"
              onClick={goToPrev}
              className="rounded-l-md p-2 hover:bg-accent"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="min-w-[150px] px-3 py-1.5 text-center text-sm font-medium">
              {viewMode === 'month' && formatMonth(currentDate)}
              {viewMode === 'week' &&
                `${formatDate(weekStart)} - ${formatDate(
                  weekDays[6],
                )}`}
              {viewMode === 'day' && formatDate(currentDate)}
              {viewMode === 'agenda' && 'All Events'}
            </span>

            <button
              type="button"
              onClick={goToNext}
              className="rounded-r-md p-2 hover:bg-accent"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Button onClick={() => openCreateDialog()}>
            <Plus size={14} />
            Add Event
          </Button>
        </div>
      </div>

      {/* Month */}
      {viewMode === 'month' && (
        <div className="grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-0 overflow-auto pt-4">
            <div className="min-w-[720px]">
              <div className="mb-2 grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-semibold text-muted-foreground"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthDays.flat().map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[110px] rounded-lg border border-transparent"
                      />
                    );
                  }

                  const dayEventsForDate = events
                    .filter((event) => isSameDay(event.start, day))
                    .sort(
                      (a, b) =>
                        a.start.getTime() - b.start.getTime(),
                    );

                  const isToday = isSameDay(day, today);
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setCurrentDate(day)}
                      className={cn(
                        'min-h-[110px] rounded-lg border p-2 text-left transition-colors hover:bg-muted/40',
                        isToday && 'border-primary ring-1 ring-primary/30',
                        !isCurrentMonth &&
                          'bg-muted/20 text-muted-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                          isToday &&
                            'bg-primary text-primary-foreground',
                        )}
                      >
                        {day.getDate()}
                      </span>

                      <div className="space-y-1">
                        {dayEventsForDate.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="truncate rounded px-1.5 py-1 text-[10px] font-medium text-white"
                            style={{
                              backgroundColor: event.color,
                            }}
                            onClick={(eventClick) => {
                              eventClick.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}

                        {dayEventsForDate.length > 3 && (
                          <p className="px-1 text-[10px] text-muted-foreground">
                            +{dayEventsForDate.length - 3} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Card className="min-h-0 overflow-hidden xl:mt-4">
            <CardContent className="h-full overflow-y-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {formatDate(currentDate)}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {dayEvents.length}{' '}
                    {dayEvents.length === 1 ? 'event' : 'events'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateDialog(currentDate)}
                  className="rounded-md p-2 hover:bg-muted"
                  aria-label="Add event"
                >
                  <Plus size={16} />
                </button>
              </div>

              {dayEvents.length === 0 ? (
                <EmptyState
                  icon={<CalendarIcon size={20} />}
                  title="No events today"
                  description="Add an event to your calendar."
                />
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event) =>
                    renderEventCard(event),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Week */}
      {viewMode === 'week' && (
        <div className="min-h-0 flex-1 overflow-auto pt-4">
          <div className="grid min-w-[850px] grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dateEvents = weekEvents.filter((event) =>
                isSameDay(event.start, day),
              );

              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[500px] rounded-xl border border-border p-2',
                    isSelected && 'ring-1 ring-primary/30',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentDate(day)}
                    className="mb-3 w-full rounded-lg p-2 text-center hover:bg-muted"
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      {day.toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </p>
                    <span
                      className={cn(
                        'mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                        isToday &&
                          'bg-primary text-primary-foreground',
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </button>

                  <div className="space-y-2">
                    {dateEvents.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => openCreateDialog(day)}
                        className="w-full rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground hover:bg-muted"
                      >
                        + Add event
                      </button>
                    ) : (
                      dateEvents.map((event) =>
                        renderEventCard(event, true),
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day */}
      {viewMode === 'day' && (
        <div className="min-h-0 flex-1 overflow-y-auto pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {formatDate(currentDate)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {dayEvents.length} scheduled{' '}
                {dayEvents.length === 1 ? 'event' : 'events'}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => openCreateDialog(currentDate)}
            >
              <Plus size={14} />
              Add Event
            </Button>
          </div>

          <div className="space-y-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourEvents = dayEvents.filter(
                (event) => event.start.getHours() === hour,
              );

              return (
                <div
                  key={hour}
                  className="grid min-h-[72px] grid-cols-[70px_minmax(0,1fr)] border-t border-border/60"
                >
                  <div className="pt-2 text-xs text-muted-foreground">
                    {hour === 0
                      ? '12 AM'
                      : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                          ? '12 PM'
                          : `${hour - 12} PM`}
                  </div>

                  <div className="space-y-2 p-1">
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="w-full rounded-lg p-3 text-left text-white shadow-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: event.color }}
                      >
                        <p className="font-medium">{event.title}</p>
                        <p className="mt-1 text-xs opacity-85">
                          {event.allDay
                            ? 'All day'
                            : `${formatTime(event.start)} - ${formatTime(
                                event.end,
                              )}`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda */}
      {viewMode === 'agenda' && (
        <div className="min-h-0 flex-1 overflow-y-auto pt-4">
          {agendaEvents.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon size={20} />}
              title="No events"
              description="Your calendar is empty."
            />
          ) : (
            <div className="mx-auto max-w-4xl space-y-3">
              {agendaEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 shrink-0 text-center">
                      <p className="text-xs font-medium text-muted-foreground">
                        {event.start.toLocaleDateString('en-US', {
                          weekday: 'short',
                        })}
                      </p>
                      <p className="text-2xl font-bold">
                        {event.start.getDate()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.start.toLocaleDateString('en-US', {
                          month: 'short',
                        })}
                      </p>
                    </div>

                    <div className="h-16 w-px bg-border" />

                    <div className="min-w-0 flex-1">
                      {renderEventCard(event)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event detail */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event'}
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: selectedEvent.color }}
              >
                {(() => {
                  const Icon = eventIcons[selectedEvent.type];
                  return <Icon size={20} />;
                })()}
              </div>

              <div className="min-w-0">
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: selectedEvent.color,
                    color: 'white',
                  }}
                >
                  {eventLabels[selectedEvent.type]}
                </Badge>

                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedEvent.allDay
                    ? 'All day'
                    : `${formatTime(
                        selectedEvent.start,
                      )} - ${formatTime(selectedEvent.end)}`}
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedEvent.start)}
                </p>
              </div>
            </div>

            {selectedEvent.description && (
              <div>
                <p className="mb-1 text-sm font-medium">Description</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Event type
                </p>
                <p className="mt-1 text-sm font-medium">
                  {eventLabels[selectedEvent.type]}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Reminder</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedEvent.reminder > 0
                    ? `${selectedEvent.reminder} minutes before`
                    : 'No reminder'}
                </p>
              </div>

              {getSubjectName(selectedEvent.subjectId) && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Subject
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <BookOpen size={14} />
                    {getSubjectName(selectedEvent.subjectId)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground">
                  Recurring
                </p>
                <p className="mt-1 text-sm font-medium">
                  {selectedEvent.recurring ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteEvent}
              >
                <Trash2 size={13} />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Create event */}
      <Dialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        title="Add Event"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateEvent();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Event title..."
            value={formData.title}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                title: event.target.value,
              }))
            }
          />

          <textarea
            placeholder="Description (optional)..."
            value={formData.description}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            className="h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Event type
              </label>

              <select
                value={formData.type}
                onChange={(event) => {
                  const type = event.target.value as EventType;

                  setFormData((previous) => ({
                    ...previous,
                    type,
                    color: eventColors[type],
                  }));
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
              >
                {Object.entries(eventLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Subject
              </label>

              <select
                value={formData.subjectId}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    subjectId: event.target.value,
                  }))
                }
                className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No subject</option>

                {subjectOptions.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formData.allDay}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  allDay: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-input accent-primary"
            />

            <span className="text-sm text-muted-foreground">
              All day event
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Date
              </label>

              <Input
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            {!formData.allDay && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Start
                  </label>

                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        startTime: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    End
                  </label>

                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        endTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.reminder > 0}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    reminder: event.target.checked ? 15 : 0,
                  }))
                }
                className="h-4 w-4 rounded border-input accent-primary"
              />

              <span className="text-sm text-muted-foreground">
                Reminder
              </span>
            </label>

            {formData.reminder > 0 && (
              <select
                value={formData.reminder}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    reminder: Number(event.target.value),
                  }))
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={1440}>1 day</option>
              </select>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEventDialog(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !formData.title.trim() ||
                !formData.date ||
                (!formData.allDay &&
                  !!formData.startTime &&
                  !!formData.endTime &&
                  createDateFromInputs(
                    formData.date,
                    formData.endTime,
                    '10:00',
                  ) <
                    createDateFromInputs(
                      formData.date,
                      formData.startTime,
                      '09:00',
                    ))
              }
            >
              <Plus size={14} />
              Add Event
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}