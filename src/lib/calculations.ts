import { round } from './utils';

export interface GpaCourseInput {
  credits: number;
  gradePoint: number;
}

export function calculateGpa(
  courses: GpaCourseInput[],
): number {
  const validCourses = courses.filter(
    (course) =>
      Number.isFinite(course.credits) &&
      Number.isFinite(course.gradePoint) &&
      course.credits > 0,
  );

  const totalCredits = validCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  if (totalCredits === 0) {
    return 0;
  }

  const weightedPoints = validCourses.reduce(
    (sum, course) =>
      sum +
      course.credits * course.gradePoint,
    0,
  );

  return round(
    weightedPoints / totalCredits,
    2,
  );
}

export function calculateTotalCredits(
  courses: GpaCourseInput[],
): number {
  return courses.reduce(
    (sum, course) =>
      sum +
      (Number.isFinite(course.credits)
        ? course.credits
        : 0),
    0,
  );
}

export interface SemesterGpaInput {
  gpa: number;
  credits: number;
}

export function calculateCgpa(
  semesters: SemesterGpaInput[],
): number {
  const validSemesters = semesters.filter(
    (semester) =>
      semester.credits > 0 &&
      Number.isFinite(semester.gpa),
  );

  const totalCredits = validSemesters.reduce(
    (sum, semester) =>
      sum + semester.credits,
    0,
  );

  if (totalCredits === 0) {
    return 0;
  }

  const weightedGpa = validSemesters.reduce(
    (sum, semester) =>
      sum +
      semester.gpa * semester.credits,
    0,
  );

  return round(
    weightedGpa / totalCredits,
    2,
  );
}

export function calculatePercentageFromGpa(
  gpa: number,
  multiplier = 9.5,
): number {
  if (!Number.isFinite(gpa)) {
    return 0;
  }

  return round(gpa * multiplier, 2);
}

export function calculateAttendance(
  attended: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return round(
    (attended / total) * 100,
    2,
  );
}

export function requiredClassesForAttendance(
  attended: number,
  total: number,
  targetPercentage: number,
): number {
  if (
    total <= 0 ||
    targetPercentage <= 0 ||
    targetPercentage >= 100
  ) {
    return 0;
  }

  const currentPercentage =
    calculateAttendance(attended, total);

  if (currentPercentage >= targetPercentage) {
    return 0;
  }

  let additionalClasses = 0;

  while (
    calculateAttendance(
      attended + additionalClasses,
      total + additionalClasses,
    ) < targetPercentage
  ) {
    additionalClasses += 1;

    if (additionalClasses > 10000) {
      break;
    }
  }

  return additionalClasses;
}

export function maximumAbsencesAllowed(
  attended: number,
  total: number,
  minimumPercentage: number,
): number {
  if (
    total <= 0 ||
    minimumPercentage <= 0 ||
    minimumPercentage >= 100
  ) {
    return 0;
  }

  let absences = 0;

  while (
    calculateAttendance(
      attended,
      total + absences + 1,
    ) >= minimumPercentage
  ) {
    absences += 1;

    if (absences > 10000) {
      break;
    }
  }

  return absences;
}

export function calculateTaskCompletionRate(
  completed: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return round(
    Math.min(completed, total) / total * 100,
    2,
  );
}

export function calculateProgress(
  completed: number,
  target: number,
): number {
  if (target <= 0) {
    return 0;
  }

  return round(
    Math.min(Math.max(completed / target, 0), 1) *
      100,
    2,
  );
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
): number {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }

  const heightMeters = heightCm / 100;

  return round(
    weightKg /
      (heightMeters * heightMeters),
    2,
  );
}

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  years: number,
): number {
  return round(
    (principal * rate * years) / 100,
    2,
  );
}

export function calculateLoanEmi(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (
    principal <= 0 ||
    months <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return round(
      principal / months,
      2,
    );
  }

  const emi =
    (principal *
      monthlyRate *
      (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1);

  return round(emi, 2);
}