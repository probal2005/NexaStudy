'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, EmptyState, Dialog } from '@/components/ui/Header';
import { cn } from '@/utils';
import {
  Calculator,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Award,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface GPASubject {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface SemesterGPA {
  id: string;
  name: string;
  subjects: GPASubject[];
  gpa: number;
  credits: number;
}

type GradeSystem = 'standard' | 'india';

interface GradeOption {
  value: string;
  label: string;
  point: number;
}

const STANDARD_GRADES: GradeOption[] = [
  { value: 'A+', label: 'A+', point: 4.0 },
  { value: 'A', label: 'A', point: 4.0 },
  { value: 'A-', label: 'A-', point: 3.7 },
  { value: 'B+', label: 'B+', point: 3.3 },
  { value: 'B', label: 'B', point: 3.0 },
  { value: 'B-', label: 'B-', point: 2.7 },
  { value: 'C+', label: 'C+', point: 2.3 },
  { value: 'C', label: 'C', point: 2.0 },
  { value: 'C-', label: 'C-', point: 1.7 },
  { value: 'D+', label: 'D+', point: 1.3 },
  { value: 'D', label: 'D', point: 1.0 },
  { value: 'F', label: 'F', point: 0.0 },
];

const INDIA_GRADES: GradeOption[] = [
  { value: 'O', label: 'O (Outstanding)', point: 10.0 },
  { value: 'A+', label: 'A+', point: 9.0 },
  { value: 'A', label: 'A', point: 8.0 },
  { value: 'B+', label: 'B+', point: 7.0 },
  { value: 'B', label: 'B', point: 6.0 },
  { value: 'C+', label: 'C+', point: 5.0 },
  { value: 'C', label: 'C', point: 4.0 },
  { value: 'D', label: 'D', point: 3.0 },
  { value: 'F', label: 'F', point: 0.0 },
];

const STORAGE_KEY = 'nexastudy_gpa_data_v1';

const DEFAULT_SUBJECTS: GPASubject[] = [
  {
    id: 'current-1',
    name: 'Database Management Systems',
    credits: 4,
    grade: 'A',
    gradePoint: 4.0,
  },
  {
    id: 'current-2',
    name: 'Thermodynamics',
    credits: 4,
    grade: 'B+',
    gradePoint: 3.3,
  },
  {
    id: 'current-3',
    name: 'Calculus II',
    credits: 4,
    grade: 'A-',
    gradePoint: 3.7,
  },
  {
    id: 'current-4',
    name: 'Physical Chemistry',
    credits: 3,
    grade: 'B',
    gradePoint: 3.0,
  },
  {
    id: 'current-5',
    name: 'Microeconomics',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
  },
];

const DEFAULT_SEMESTERS: SemesterGPA[] = [
  {
    id: 'semester-1',
    name: 'Semester 1',
    subjects: [
      {
        id: 's1',
        name: 'Physics I',
        credits: 4,
        grade: 'A',
        gradePoint: 4.0,
      },
      {
        id: 's2',
        name: 'Chemistry I',
        credits: 4,
        grade: 'B+',
        gradePoint: 3.3,
      },
      {
        id: 's3',
        name: 'Mathematics I',
        credits: 4,
        grade: 'A-',
        gradePoint: 3.7,
      },
      {
        id: 's4',
        name: 'English',
        credits: 2,
        grade: 'B',
        gradePoint: 3.0,
      },
    ],
    gpa: 3.57,
    credits: 14,
  },
  {
    id: 'semester-2',
    name: 'Semester 2',
    subjects: [
      {
        id: 's5',
        name: 'Physics II',
        credits: 4,
        grade: 'A-',
        gradePoint: 3.7,
      },
      {
        id: 's6',
        name: 'Organic Chemistry',
        credits: 4,
        grade: 'B+',
        gradePoint: 3.3,
      },
      {
        id: 's7',
        name: 'Mathematics II',
        credits: 4,
        grade: 'A',
        gradePoint: 4.0,
      },
      {
        id: 's8',
        name: 'Computer Science I',
        credits: 3,
        grade: 'A',
        gradePoint: 4.0,
      },
    ],
    gpa: 3.74,
    credits: 15,
  },
];

function round(value: number, digits = 2) {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function calculateGPA(subjects: GPASubject[]) {
  const validSubjects = subjects.filter(
    subject =>
      Number.isFinite(subject.credits) &&
      subject.credits > 0 &&
      Number.isFinite(subject.gradePoint),
  );

  const totalCredits = validSubjects.reduce(
    (total, subject) => total + subject.credits,
    0,
  );

  if (totalCredits <= 0) {
    return 0;
  }

  const totalPoints = validSubjects.reduce(
    (total, subject) => total + subject.gradePoint * subject.credits,
    0,
  );

  return round(totalPoints / totalCredits);
}

function calculateTotalCredits(subjects: GPASubject[]) {
  return subjects.reduce(
    (total, subject) =>
      total + (Number.isFinite(subject.credits) ? subject.credits : 0),
    0,
  );
}

function calculateTotalPoints(subjects: GPASubject[]) {
  return subjects.reduce(
    (total, subject) =>
      total +
      (Number.isFinite(subject.gradePoint) && Number.isFinite(subject.credits)
        ? subject.gradePoint * subject.credits
        : 0),
    0,
  );
}

function calculateSemesterFromSubjects(
  name: string,
  subjects: GPASubject[],
): SemesterGPA {
  return {
    id: `semester-${Date.now()}`,
    name,
    subjects,
    gpa: calculateGPA(subjects),
    credits: calculateTotalCredits(subjects),
  };
}

function findGradePoint(
  grade: string,
  gradeScale: GradeOption[],
  fallback = 0,
) {
  return gradeScale.find(option => option.value === grade)?.point ?? fallback;
}

/**
 * When switching systems, exact grade labels that exist in both systems
 * are preserved. Grades that don't exist in the new scale are mapped
 * to the nearest grade based on normalized performance.
 */
function convertGrade(
  subject: GPASubject,
  fromSystem: GradeSystem,
  toSystem: GradeSystem,
): GPASubject {
  if (fromSystem === toSystem) {
    return {
      ...subject,
      gradePoint: findGradePoint(
        subject.grade,
        toSystem === 'india' ? INDIA_GRADES : STANDARD_GRADES,
        subject.gradePoint,
      ),
    };
  }

  const targetScale = toSystem === 'india' ? INDIA_GRADES : STANDARD_GRADES;
  const sourceMax = fromSystem === 'india' ? 10 : 4;

  const normalized = Math.max(
    0,
    Math.min(1, subject.gradePoint / sourceMax),
  );

  const targetPoint = normalized * (toSystem === 'india' ? 10 : 4);

  const closest = targetScale.reduce((best, current) => {
    const currentDistance = Math.abs(current.point - targetPoint);
    const bestDistance = Math.abs(best.point - targetPoint);

    return currentDistance < bestDistance ? current : best;
  });

  return {
    ...subject,
    grade: closest.value,
    gradePoint: closest.point,
  };
}

function getPerformance(gpa: number, system: GradeSystem) {
  const excellentThreshold = system === 'india' ? 8.5 : 3.5;
  const goodThreshold = system === 'india' ? 6.5 : 2.5;

  if (gpa >= excellentThreshold) {
    return {
      label: 'Excellent',
      className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    };
  }

  if (gpa >= goodThreshold) {
    return {
      label: 'Good',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    };
  }

  return {
    label: 'Needs Improvement',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  };
}

function getClassification(cgpa: number, system: GradeSystem) {
  if (system === 'india') {
    if (cgpa >= 9) return 'Outstanding';
    if (cgpa >= 8) return 'Excellent';
    if (cgpa >= 7) return 'Very Good';
    if (cgpa >= 6) return 'Good';
    if (cgpa >= 5) return 'Average';
    if (cgpa > 0) return 'Pass';
    return '—';
  }

  if (cgpa >= 3.7) return 'Distinction';
  if (cgpa >= 3.0) return 'First Class';
  if (cgpa >= 2.0) return 'Second Class';
  if (cgpa > 0) return 'Pass';

  return '—';
}

export default function GPAPage() {
  const [system, setSystem] = useState<GradeSystem>('standard');

  const [subjects, setSubjects] =
    useState<GPASubject[]>(DEFAULT_SUBJECTS);

  const [semesters, setSemesters] =
    useState<SemesterGPA[]>(DEFAULT_SEMESTERS);

  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newSubject, setNewSubject] = useState({
    name: '',
    credits: 3,
    grade: 'A',
  });

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const gradeScale =
    system === 'india' ? INDIA_GRADES : STANDARD_GRADES;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (
        parsed &&
        Array.isArray(parsed.subjects) &&
        Array.isArray(parsed.semesters)
      ) {
        setSystem(parsed.system === 'india' ? 'india' : 'standard');
        setSubjects(parsed.subjects);
        setSemesters(parsed.semesters);
      }
    } catch {
      // Ignore malformed local data and keep safe defaults.
    }
  }, []);

  const currentGPA = useMemo(
    () => calculateGPA(subjects),
    [subjects],
  );

  const totalCredits = useMemo(
    () => calculateTotalCredits(subjects),
    [subjects],
  );

  const totalGradePoints = useMemo(
    () => calculateTotalPoints(subjects),
    [subjects],
  );

  const totalSemesterCredits = useMemo(
    () =>
      semesters.reduce(
        (total, semester) => total + semester.credits,
        0,
      ),
    [semesters],
  );

  const cgpa = useMemo(() => {
    if (totalSemesterCredits <= 0) {
      return currentGPA;
    }

    const totalWeightedPoints = semesters.reduce(
      (total, semester) =>
        total + semester.gpa * semester.credits,
      0,
    );

    return round(totalWeightedPoints / totalSemesterCredits);
  }, [semesters, totalSemesterCredits, currentGPA]);

  const maxGPA = system === 'india' ? 10 : 4;

  const normalizedPercentage =
    maxGPA > 0 ? round((cgpa / maxGPA) * 100) : 0;

  const performance = getPerformance(currentGPA, system);
  const classification = getClassification(cgpa, system);

  const handleSystemChange = () => {
    const nextSystem: GradeSystem =
      system === 'standard' ? 'india' : 'standard';

    const convertedSubjects = subjects.map(subject =>
      convertGrade(subject, system, nextSystem),
    );

    setSystem(nextSystem);
    setSubjects(convertedSubjects);

    setNewSubject({
      name: '',
      credits: 3,
      grade: nextSystem === 'india' ? 'A' : 'A',
    });

    setSaveMessage(
      `Switched to ${
        nextSystem === 'india' ? 'India 10-point' : 'Standard 4-point'
      } scale.`,
    );

    window.setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleAddSubject = () => {
    const name = newSubject.name.trim();

    if (!name) {
      return;
    }

    const credits = Number(newSubject.credits);

    if (!Number.isFinite(credits) || credits < 1 || credits > 10) {
      return;
    }

    const gradeOption = gradeScale.find(
      option => option.value === newSubject.grade,
    );

    const subject: GPASubject = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      name,
      credits,
      grade: newSubject.grade,
      gradePoint: gradeOption?.point ?? 0,
    };

    setSubjects(prev => [...prev, subject]);
    setShowAddDialog(false);

    setNewSubject({
      name: '',
      credits: 3,
      grade: gradeScale[0]?.value ?? 'A',
    });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev =>
      prev.filter(subject => subject.id !== id),
    );
  };

  const handleGradeChange = (id: string, grade: string) => {
    const gradeOption = gradeScale.find(
      option => option.value === grade,
    );

    setSubjects(prev =>
      prev.map(subject =>
        subject.id === id
          ? {
              ...subject,
              grade,
              gradePoint: gradeOption?.point ?? 0,
            }
          : subject,
      ),
    );
  };

  const handleCreditsChange = (id: string, value: string) => {
    const credits = Number(value);

    if (!Number.isFinite(credits)) {
      return;
    }

    setSubjects(prev =>
      prev.map(subject =>
        subject.id === id
          ? {
              ...subject,
              credits: Math.max(1, Math.min(10, credits)),
            }
          : subject,
      ),
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          system,
          subjects,
          semesters,
          savedAt: new Date().toISOString(),
        }),
      );

      setSaveMessage('GPA data saved locally.');

      window.setTimeout(() => {
        setSaveMessage(null);
      }, 2500);
    } catch {
      setSaveMessage('Unable to save GPA data in this browser.');

      window.setTimeout(() => {
        setSaveMessage(null);
      }, 2500);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset current GPA subjects and saved GPA data?',
    );

    if (!confirmed) {
      return;
    }

    setSystem('standard');
    setSubjects(DEFAULT_SUBJECTS);
    setSemesters(DEFAULT_SEMESTERS);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }

    setSaveMessage('GPA data has been reset.');

    window.setTimeout(() => {
      setSaveMessage(null);
    }, 2500);
  };

  const handleSaveCurrentSemester = () => {
    if (subjects.length === 0) {
      return;
    }

    const semesterNumber = semesters.length + 1;

    const newSemester = calculateSemesterFromSubjects(
      `Semester ${semesterNumber}`,
      subjects.map(subject => ({ ...subject })),
    );

    setSemesters(prev => [...prev, newSemester]);

    setSaveMessage(
      `Current semester saved as Semester ${semesterNumber}.`,
    );

    window.setTimeout(() => {
      setSaveMessage(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">
            GPA / CGPA Calculator
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate, track and save your academic performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSystemChange}
            title="Switch grading scale"
          >
            {system === 'standard'
              ? 'India 10-point'
              : 'Standard 4-point'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAddDialog(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Save notification */}
      {saveMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          <CheckCircle2 size={16} />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Scale notice */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/20">
        <AlertCircle
          size={17}
          className="mt-0.5 flex-shrink-0 text-blue-500"
        />

        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">
            {system === 'standard'
              ? 'Standard 4.0 grading scale'
              : 'India 10.0 grading scale'}
          </p>

          <p className="mt-1">
            GPA rules vary between universities. Use the grading
            scale officially provided by your institution.
            Switching scales converts the displayed subjects to
            the nearest equivalent grade; it is not an official
            academic conversion.
          </p>
        </div>
      </div>

      {/* Main GPA cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current GPA */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Current Semester GPA
              </CardTitle>

              <Badge variant="outline">
                {subjects.length}{' '}
                {subjects.length === 1 ? 'subject' : 'subjects'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Circular GPA */}
              <div className="relative flex-shrink-0">
                <svg
                  className="h-32 w-32"
                  viewBox="0 0 100 100"
                  aria-label={`Current GPA ${currentGPA} out of ${maxGPA}`}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth="8"
                    strokeDasharray={`${
                      Math.max(
                        0,
                        Math.min(1, currentGPA / maxGPA),
                      ) * 264
                    } 264`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {currentGPA.toFixed(2)}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    / {maxGPA.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* GPA information */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Credits
                  </span>
                  <span className="font-semibold">
                    {totalCredits}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Grade Points
                  </span>
                  <span className="font-semibold">
                    {totalGradePoints.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Performance
                  </span>

                  <Badge
                    className={cn(
                      'text-sm',
                      performance.className,
                    )}
                  >
                    {performance.label}
                  </Badge>
                </div>

                <ProgressBar
                  value={currentGPA}
                  max={maxGPA}
                  showLabel
                  color="success"
                  className="mt-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CGPA */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-200/20">
          <CardHeader>
            <CardTitle className="text-base">
              Cumulative CGPA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {cgpa.toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">
                / {maxGPA.toFixed(1)}
              </p>

              <div className="mt-2">
                <Badge className="text-base px-3 py-1">
                  {classification}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  Normalized Percentage
                </span>

                <span className="font-semibold">
                  {normalizedPercentage.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Previous Semesters
                </span>

                <span className="font-semibold">
                  {semesters.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Total Credits
                </span>

                <span className="font-semibold">
                  {totalSemesterCredits}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleSave}
              >
                <Save size={12} />
                Save
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1 text-destructive"
              >
                <RotateCcw size={12} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-base">
              Current Semester Subjects
            </CardTitle>

            <Badge variant="outline">
              {subjects.length} subjects · {totalCredits} credits
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {subjects.length === 0 ? (
            <EmptyState
              icon={<Calculator size={24} />}
              title="No subjects added"
              description="Add subjects to calculate your current GPA."
              action={{
                label: 'Add Subject',
                onClick: () => setShowAddDialog(true),
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                      Subject
                    </th>

                    <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">
                      Credits
                    </th>

                    <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">
                      Grade
                    </th>

                    <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">
                      Grade Point
                    </th>

                    <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map(subject => (
                    <tr
                      key={subject.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">
                          {subject.name}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={subject.credits}
                          onChange={event =>
                            handleCreditsChange(
                              subject.id,
                              event.target.value,
                            )
                          }
                          className="mx-auto w-20 text-center"
                          aria-label={`${subject.name} credits`}
                        />
                      </td>

                      <td className="px-4 py-3 text-center">
                        <select
                          value={subject.grade}
                          onChange={event =>
                            handleGradeChange(
                              subject.id,
                              event.target.value,
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm cursor-pointer"
                          aria-label={`${subject.name} grade`}
                        >
                          {gradeScale.map(option => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            system === 'india'
                              ? subject.gradePoint >= 7
                                ? 'text-green-600'
                                : subject.gradePoint >= 5
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              : subject.gradePoint >= 3
                                ? 'text-green-600'
                                : subject.gradePoint >= 2
                                  ? 'text-blue-600'
                                  : 'text-red-600',
                          )}
                        >
                          {subject.gradePoint.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteSubject(subject.id)
                          }
                          className="inline-flex p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                          aria-label={`Remove ${subject.name}`}
                          title="Remove subject"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="bg-primary/5">
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-sm font-semibold"
                    >
                      GPA: {currentGPA.toFixed(2)} /{' '}
                      {maxGPA.toFixed(1)}
                    </td>

                    <td className="px-4 py-3" />

                    <td
                      colSpan={2}
                      className="px-4 py-3 text-right text-sm text-muted-foreground"
                    >
                      Total: {totalCredits} credits ·{' '}
                      {totalGradePoints.toFixed(2)} grade points
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Semester history */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Semester History
            </h3>

            <p className="text-sm text-muted-foreground">
              Previously saved semester performance.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveCurrentSemester}
            disabled={subjects.length === 0}
            className="gap-1.5"
          >
            <Save size={13} />
            Save Current Semester
          </Button>
        </div>

        {semesters.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="mx-auto mb-2 text-muted-foreground" size={24} />
              <p className="text-sm font-medium">
                No semester history yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Save your current semester to build your academic
                history.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {semesters.map(semester => (
              <Card key={semester.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                        <Award size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {semester.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {semester.subjects.length}{' '}
                          {semester.subjects.length === 1
                            ? 'subject'
                            : 'subjects'}{' '}
                          · {semester.credits} credits
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-primary">
                        {semester.gpa.toFixed(2)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        GPA
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {semester.subjects.map(subject => (
                      <div
                        key={subject.id}
                        className="p-2.5 rounded-lg bg-muted/50"
                      >
                        <p className="font-medium text-xs truncate">
                          {subject.name}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {subject.credits} cr · {subject.grade}{' '}
                          ({subject.gradePoint.toFixed(1)})
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add subject dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Add Subject"
      >
        <form
          onSubmit={event => {
            event.preventDefault();
            handleAddSubject();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Subject name..."
            value={newSubject.name}
            onChange={event =>
              setNewSubject(previous => ({
                ...previous,
                name: event.target.value,
              }))
            }
            error={
              !newSubject.name.trim()
                ? 'Subject name is required'
                : undefined
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Credits
              </label>

              <Input
                type="number"
                min={1}
                max={10}
                value={newSubject.credits}
                onChange={event =>
                  setNewSubject(previous => ({
                    ...previous,
                    credits:
                      Number(event.target.value) || 1,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Grade
              </label>

              <select
                value={newSubject.grade}
                onChange={event =>
                  setNewSubject(previous => ({
                    ...previous,
                    grade: event.target.value,
                  }))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm cursor-pointer"
              >
                {gradeScale.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label} ({option.point})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!newSubject.name.trim()}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Subject
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Grade reference */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold">
              Grade Reference (
              {system === 'standard'
                ? '4.0 Scale'
                : '10.0 Scale'}
              )
            </h3>

            <Badge variant="outline">
              {gradeScale.length} grades
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
            {gradeScale.map(option => (
              <div
                key={option.value}
                className="p-2 rounded bg-muted/50 text-center"
              >
                <span className="font-semibold">
                  {option.label}
                </span>

                <span className="text-muted-foreground">
                  {' '}
                  → {option.point}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground mt-3 flex items-start gap-1.5">
            <AlertCircle
              size={11}
              className="mt-0.5 flex-shrink-0"
            />

            <span>
              These are reference scales only. Your university may
              use a different grading policy, grade-point mapping,
              or percentage conversion formula.
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}