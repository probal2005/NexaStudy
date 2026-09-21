'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, EmptyState } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Plus,
  Search,
  Clock,
  BookMarked,
  ChevronRight,
  Calendar as CalendarIcon,
  Target,
  X,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

type ExamType = 'midterm' | 'final' | 'quiz' | 'lab' | 'viva';
type ExamStatus = 'upcoming' | 'completed' | 'missed';

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  type: ExamType;
  preparation: number;
  notes: string;
  status: ExamStatus;
}

interface ExamForm {
  title: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  type: ExamType;
  preparation: string;
  notes: string;
}

const initialExams: Exam[] = [
  {
    id: '1',
    title: 'Physics Mid-term',
    subject: 'PH201 - Physics',
    date: 'Wed, Sep 24 2026',
    time: '10:00 AM',
    venue: 'Lab 301',
    type: 'midterm',
    preparation: 65,
    notes: 'Covers chapters 1-5. Formulas sheet allowed.',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Chemistry Final',
    subject: 'CH201 - Chemistry',
    date: 'Fri, Oct 10 2026',
    time: '9:00 AM',
    venue: 'Main Hall',
    type: 'final',
    preparation: 30,
    notes: 'Comprehensive exam. All 12 chapters.',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'DBMS Quiz 2',
    subject: 'CS201 - DBMS',
    date: 'Mon, Sep 29 2026',
    time: '2:00 PM',
    venue: 'Classroom 204',
    type: 'quiz',
    preparation: 80,
    notes: 'Focus on normalization and SQL joins.',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Calculus Mid-term',
    subject: 'MA201 - Calculus',
    date: 'Tue, Sep 16 2026',
    time: '11:00 AM',
    venue: 'Auditorium A',
    type: 'midterm',
    preparation: 100,
    notes: '',
    status: 'completed',
  },
  {
    id: '5',
    title: 'English Viva',
    subject: 'EN201 - English',
    date: 'Thu, Sep 11 2026',
    time: '10:30 AM',
    venue: 'Dept Office',
    type: 'viva',
    preparation: 90,
    notes: '',
    status: 'completed',
  },
  {
    id: '6',
    title: 'Data Structures Lab',
    subject: 'CS202 - DS',
    date: 'Sat, Sep 13 2026',
    time: '1:00 PM',
    venue: 'CS Lab 101',
    type: 'lab',
    preparation: 100,
    notes: 'Implement linked list operations.',
    status: 'completed',
  },
];

const typeLabels: Record<ExamType, string> = {
  midterm: 'Mid-term',
  final: 'Final',
  quiz: 'Quiz',
  lab: 'Lab',
  viva: 'Viva',
};

const typeColors: Record<ExamType, string> = {
  midterm: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  final: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  quiz: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  lab: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  viva: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
};

const statusColors: Record<ExamStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  missed: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

const emptyForm: ExamForm = {
  title: '',
  subject: '',
  date: '',
  time: '',
  venue: '',
  type: 'midterm',
  preparation: '0',
  notes: '',
};

function clampPreparation(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | ExamType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ExamStatus>('all');

  const [showForm, setShowForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [form, setForm] = useState<ExamForm>(emptyForm);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch =
        !query ||
        exam.title.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query) ||
        exam.venue.toLowerCase().includes(query) ||
        exam.notes.toLowerCase().includes(query);

      const matchesType =
        filterType === 'all' || exam.type === filterType;

      const matchesStatus =
        filterStatus === 'all' || exam.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [exams, search, filterType, filterStatus]);

  const stats = useMemo(() => {
    const upcoming = exams.filter((exam) => exam.status === 'upcoming');
    const completed = exams.filter((exam) => exam.status === 'completed');
    const missed = exams.filter((exam) => exam.status === 'missed');

    const avgPrep =
      upcoming.length > 0
        ? Math.round(
            upcoming.reduce((sum, exam) => sum + exam.preparation, 0) /
              upcoming.length,
          )
        : 0;

    return {
      upcoming: upcoming.length,
      completed: completed.length,
      missed: missed.length,
      avgPrep,
      total: exams.length,
    };
  }, [exams]);

  const openAddExam = () => {
    setForm(emptyForm);
    setSelectedExam(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
  };

  const handleFormChange = (
    field: keyof ExamForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddExam = () => {
    const title = form.title.trim();
    const subject = form.subject.trim();
    const date = form.date.trim();
    const time = form.time.trim();
    const venue = form.venue.trim();

    if (!title || !subject || !date || !time || !venue) {
      return;
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      subject,
      date,
      time,
      venue,
      type: form.type,
      preparation: clampPreparation(form.preparation),
      notes: form.notes.trim(),
      status: 'upcoming',
    };

    setExams((current) => [newExam, ...current]);
    closeForm();
  };

  const updatePreparation = (id: string, preparation: number) => {
    setExams((current) =>
      current.map((exam) =>
        exam.id === id
          ? {
              ...exam,
              preparation: clampPreparation(String(preparation)),
            }
          : exam,
      ),
    );

    setSelectedExam((current) =>
      current?.id === id
        ? {
            ...current,
            preparation: clampPreparation(String(preparation)),
          }
        : current,
    );
  };

  const markCompleted = (id: string) => {
    setExams((current) =>
      current.map((exam) =>
        exam.id === id
          ? {
              ...exam,
              status: 'completed',
              preparation: 100,
            }
          : exam,
      ),
    );

    setSelectedExam((current) =>
      current?.id === id
        ? {
            ...current,
            status: 'completed',
            preparation: 100,
          }
        : current,
    );
  };

  const markMissed = (id: string) => {
    setExams((current) =>
      current.map((exam) =>
        exam.id === id
          ? {
              ...exam,
              status: 'missed',
            }
          : exam,
      ),
    );

    setSelectedExam((current) =>
      current?.id === id
        ? {
            ...current,
            status: 'missed',
          }
        : current,
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-sm">
              <GraduationCap size={18} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Exams
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Track exam schedules, preparation progress, and venues.
          </p>
        </div>

        <Button
          onClick={openAddExam}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Exam
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">
                {stats.upcoming}
              </div>
              <CalendarIcon className="text-blue-500" size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                {stats.completed}
              </div>
              <CheckCircle2 className="text-green-500" size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-600">
                {stats.avgPrep}%
              </div>
              <Target className="text-purple-500" size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">
                {stats.total}
              </div>
              <BookMarked className="text-muted-foreground" size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preparation */}
      <Card>
        <CardContent className="p-4">
          <ProgressBar
            value={stats.avgPrep}
            max={100}
            label={`Average Upcoming Preparation: ${stats.avgPrep}%`}
            color="success"
          />
        </CardContent>
      </Card>

      {/* Main list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Exams</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {filtered.length} of {exams.length} exams shown
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={openAddExam}
              className="gap-2 self-start"
            >
              <Plus size={14} />
              Add Exam
            </Button>
          </div>

          {/* Filters */}
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={17}
              />
              <Input
                placeholder="Search title, subject, venue..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>

            <select
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              value={filterType}
              onChange={(event) =>
                setFilterType(event.target.value as 'all' | ExamType)
              }
            >
              <option value="all">All Types</option>
              <option value="midterm">Mid-term</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
              <option value="lab">Lab</option>
              <option value="viva">Viva</option>
            </select>

            <select
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(
                  event.target.value as 'all' | ExamStatus,
                )
              }
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              title="No exams found"
              description="Try a different search or filter, or add a new exam."
            />
          ) : (
            <div className="grid gap-3">
              {filtered.map((exam) => (
                <div
                  key={exam.id}
                  className="group flex flex-col gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
                >
                  <div
                    className={cn(
                      'hidden h-14 w-1 rounded-full sm:block',
                      exam.status === 'completed'
                        ? 'bg-green-500'
                        : exam.status === 'upcoming'
                          ? 'bg-blue-500'
                          : 'bg-red-500',
                    )}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {exam.title}
                      </h3>

                      <Badge
                        className={cn(
                          'text-xs',
                          typeColors[exam.type],
                        )}
                      >
                        {typeLabels[exam.type]}
                      </Badge>

                      <Badge
                        className={cn(
                          'text-xs capitalize',
                          statusColors[exam.status],
                        )}
                      >
                        {exam.status}
                      </Badge>
                    </div>

                    <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon size={14} />
                        {exam.date}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {exam.time}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <BookMarked size={14} />
                        {exam.subject}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Target size={14} />
                        {exam.venue}
                      </span>
                    </div>

                    {exam.notes && (
                      <p className="mt-2 text-xs italic text-muted-foreground">
                        {exam.notes}
                      </p>
                    )}

                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Preparation
                        </span>
                        <span className="font-semibold text-foreground">
                          {exam.preparation}%
                        </span>
                      </div>

                      <ProgressBar
                        value={exam.preparation}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 sm:flex-col lg:flex-row">
                    {exam.status === 'upcoming' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updatePreparation(
                              exam.id,
                              Math.min(100, exam.preparation + 10),
                            )
                          }
                          title="Increase preparation by 10%"
                        >
                          +10%
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markCompleted(exam.id)}
                          title="Mark exam as completed"
                        >
                          <CheckCircle2 size={15} />
                          <span className="hidden xl:inline">
                            Done
                          </span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markMissed(exam.id)}
                          title="Mark exam as missed"
                        >
                          <AlertTriangle size={15} />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedExam(exam)}
                      aria-label={`View ${exam.title}`}
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Exam Dialog */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-exam-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-5 py-4">
              <div>
                <h2
                  id="add-exam-title"
                  className="text-lg font-semibold"
                >
                  Add New Exam
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add the exam details to your academic schedule.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={closeForm}
                aria-label="Close add exam form"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Exam Title
                </label>
                <Input
                  value={form.title}
                  onChange={(event) =>
                    handleFormChange('title', event.target.value)
                  }
                  placeholder="e.g. Data Structures Final"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Subject
                </label>
                <Input
                  value={form.subject}
                  onChange={(event) =>
                    handleFormChange('subject', event.target.value)
                  }
                  placeholder="e.g. CS202 - Data Structures"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Exam Type
                </label>
                <select
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  value={form.type}
                  onChange={(event) =>
                    handleFormChange(
                      'type',
                      event.target.value,
                    )
                  }
                >
                  <option value="midterm">Mid-term</option>
                  <option value="final">Final</option>
                  <option value="quiz">Quiz</option>
                  <option value="lab">Lab</option>
                  <option value="viva">Viva</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Date
                </label>
                <Input
                  type="text"
                  value={form.date}
                  onChange={(event) =>
                    handleFormChange('date', event.target.value)
                  }
                  placeholder="e.g. Mon, Oct 12 2026"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Time
                </label>
                <Input
                  type="text"
                  value={form.time}
                  onChange={(event) =>
                    handleFormChange('time', event.target.value)
                  }
                  placeholder="e.g. 10:00 AM"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Venue
                </label>
                <Input
                  value={form.venue}
                  onChange={(event) =>
                    handleFormChange('venue', event.target.value)
                  }
                  placeholder="e.g. Main Hall"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Preparation %
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.preparation}
                  onChange={(event) =>
                    handleFormChange(
                      'preparation',
                      event.target.value,
                    )
                  }
                  placeholder="0 - 100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    handleFormChange('notes', event.target.value)
                  }
                  placeholder="Important topics, instructions, allowed materials..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="ghost" onClick={closeForm}>
                Cancel
              </Button>

              <Button
                onClick={handleAddExam}
                disabled={
                  !form.title.trim() ||
                  !form.subject.trim() ||
                  !form.date.trim() ||
                  !form.time.trim() ||
                  !form.venue.trim()
                }
              >
                <Plus size={15} />
                Add Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Details Dialog */}
      {selectedExam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-details-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between border-b border-border p-5">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="exam-details-title"
                    className="text-lg font-semibold"
                  >
                    {selectedExam.title}
                  </h2>

                  <Badge
                    className={cn(
                      'text-xs',
                      typeColors[selectedExam.type],
                    )}
                  >
                    {typeLabels[selectedExam.type]}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedExam.subject}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExam(null)}
                aria-label="Close exam details"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedExam.date}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedExam.time}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Venue
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedExam.venue}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    className={cn(
                      'mt-1 text-xs capitalize',
                      statusColors[selectedExam.status],
                    )}
                  >
                    {selectedExam.status}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Preparation
                  </span>
                  <span className="text-sm font-semibold">
                    {selectedExam.preparation}%
                  </span>
                </div>

                <ProgressBar
                  value={selectedExam.preparation}
                  max={100}
                />
              </div>

              {selectedExam.notes && (
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedExam.notes}
                  </p>
                </div>
              )}

              {selectedExam.status === 'upcoming' && (
                <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      updatePreparation(
                        selectedExam.id,
                        Math.min(
                          100,
                          selectedExam.preparation + 10,
                        ),
                      )
                    }
                  >
                    +10% Preparation
                  </Button>

                  <Button
                    onClick={() => markCompleted(selectedExam.id)}
                  >
                    <CheckCircle2 size={15} />
                    Mark Completed
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}