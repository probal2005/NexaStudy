import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* -------------------------------------------------------------------------- */
/* Class Utilities                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Merge conditional classes and safely resolve Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

function toValidDate(date: string | Date): Date | null {
  const parsed =
    date instanceof Date
      ? new Date(date.getTime())
      : new Date(date);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

/* -------------------------------------------------------------------------- */
/* Date & Time Utilities                                                      */
/* -------------------------------------------------------------------------- */

export function formatDate(
  date: string | Date,
  _format = 'PPP',
): string {
  const parsed = toValidDate(date);

  if (!parsed) {
    return 'Invalid date';
  }

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const parsed = toValidDate(date);

  if (!parsed) {
    return 'Invalid time';
  }

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: string | Date): string {
  const parsed = toValidDate(date);

  if (!parsed) {
    return 'Invalid date';
  }

  return `${formatDate(parsed)} at ${formatTime(parsed)}`;
}

export function timeAgo(date: string | Date): string {
  const parsed = toValidDate(date);

  if (!parsed) {
    return 'Invalid date';
  }

  const now = Date.now();
  const timestamp = parsed.getTime();
  const difference = now - timestamp;

  if (difference < 0) {
    const futureMs = Math.abs(difference);
    const futureSeconds = Math.floor(futureMs / 1000);
    const futureMinutes = Math.floor(futureSeconds / 60);
    const futureHours = Math.floor(futureMinutes / 60);
    const futureDays = Math.floor(futureHours / 24);

    if (futureSeconds < 60) {
      return 'in a few seconds';
    }

    if (futureMinutes < 60) {
      return `in ${futureMinutes}m`;
    }

    if (futureHours < 24) {
      return `in ${futureHours}h`;
    }

    if (futureDays < 7) {
      return `in ${futureDays}d`;
    }

    return formatDate(parsed);
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(parsed);
}

/* -------------------------------------------------------------------------- */
/* String Utilities                                                           */
/* -------------------------------------------------------------------------- */

export function getInitials(name: string): string {
  const cleanedName = name.trim();

  if (!cleanedName) {
    return '';
  }

  return cleanedName
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(
  value: string,
  length: number,
): string {
  if (length <= 0) {
    return '';
  }

  if (value.length <= length) {
    return value;
  }

  if (length <= 3) {
    return value.slice(0, length);
  }

  return `${value.slice(0, length - 3)}...`;
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a lightweight unique ID.
 *
 * Not intended for security-sensitive or cryptographic purposes.
 */
export function generateId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* -------------------------------------------------------------------------- */
/* File Utilities                                                             */
/* -------------------------------------------------------------------------- */

export function getFileIcon(type: string): string {
  const normalized = type.toLowerCase().trim();

  /* Filename extension checks first. */
  if (
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/.test(normalized)
  ) {
    return 'image';
  }

  if (
    /\.(mp3|wav|ogg|m4a|aac|flac)$/.test(normalized)
  ) {
    return 'audio';
  }

  if (
    /\.(mp4|avi|mov|mkv|webm)$/.test(normalized)
  ) {
    return 'video';
  }

  if (
    /\.(zip|rar|tar|gz|7z)$/.test(normalized)
  ) {
    return 'archive';
  }

  if (
    /\.(ppt|pptx)$/.test(normalized)
  ) {
    return 'presentation';
  }

  if (
    /\.(xls|xlsx|csv)$/.test(normalized)
  ) {
    return 'table';
  }

  if (
    /\.(doc|docx|pdf|txt|rtf)$/.test(normalized)
  ) {
    return 'file-text';
  }

  if (
    normalized === 'md' ||
    normalized.endsWith('.md') ||
    normalized.includes('markdown')
  ) {
    return 'markdown';
  }

  /* MIME-type / descriptive checks. */
  if (
    normalized.includes('image')
  ) {
    return 'image';
  }

  if (
    normalized.includes('audio')
  ) {
    return 'audio';
  }

  if (
    normalized.includes('video')
  ) {
    return 'video';
  }

  if (
    normalized.includes('presentation') ||
    normalized.includes('powerpoint')
  ) {
    return 'presentation';
  }

  if (
    normalized.includes('spreadsheet') ||
    normalized.includes('excel')
  ) {
    return 'table';
  }

  if (
    normalized.includes('pdf') ||
    normalized.includes('document') ||
    normalized.includes('msword')
  ) {
    return 'file-text';
  }

  if (
    normalized.includes('zip') ||
    normalized.includes('rar') ||
    normalized.includes('tar') ||
    normalized.includes('compressed')
  ) {
    return 'archive';
  }

  return 'file';
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
  ];

  const base = 1024;

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(base)),
    units.length - 1,
  );

  const value = bytes / Math.pow(base, unitIndex);

  const decimals = unitIndex === 0 ? 0 : value >= 100 ? 0 : 1;

  return `${Number(value.toFixed(decimals))} ${units[unitIndex]}`;
}

/* -------------------------------------------------------------------------- */
/* Status / Priority Utilities                                                */
/* -------------------------------------------------------------------------- */

export function getPriorityColor(
  priority: string,
): string {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-500';

    case 'high':
      return 'bg-orange-500';

    case 'medium':
      return 'bg-yellow-500';

    case 'low':
      return 'bg-green-500';

    default:
      return 'bg-gray-500';
  }
}

export function getStatusColor(
  status: string,
): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'done':
      return 'text-green-600';

    case 'in_progress':
    case 'in-progress':
    case 'active':
      return 'text-blue-600';

    case 'overdue':
      return 'text-red-600';

    case 'pending':
    case 'not_started':
    case 'not-started':
      return 'text-gray-500';

    case 'submitted':
      return 'text-purple-600';

    default:
      return 'text-gray-500';
  }
}

export function getEventColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'class':
      return '#3B82F6';

    case 'exam':
      return '#EF4444';

    case 'assignment':
      return '#F59E0B';

    case 'study':
      return '#10B981';

    case 'personal':
      return '#8B5CF6';

    case 'reminder':
      return '#EC4899';

    case 'holiday':
      return '#14B8A6';

    default:
      return '#6B7280';
  }
}

/* -------------------------------------------------------------------------- */
/* Attendance Utilities                                                       */
/* -------------------------------------------------------------------------- */

export function calculateAttendancePercentage(
  attended: number,
  total: number,
): number {
  if (
    !Number.isFinite(attended) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return 0;
  }

  const safeAttended = clamp(
    Math.floor(attended),
    0,
    Math.floor(total),
  );

  return Math.round(
    (safeAttended / total) * 100,
  );
}

/**
 * Calculates how many additional classes must be attended
 * to reach a target percentage.
 *
 * `attended` and `total` represent classes held so far.
 *
 * `targetPercent` is the desired final attendance percentage.
 *
 * The result assumes future classes are attended.
 */
export function calculateRequiredToReachTarget(
  attended: number,
  total: number,
  targetPercent: number,
): {
  required: number;
  possible: boolean;
  projectedPercent: number;
} {
  if (
    !Number.isFinite(attended) ||
    !Number.isFinite(total) ||
    !Number.isFinite(targetPercent) ||
    total <= 0
  ) {
    return {
      required: 0,
      possible: false,
      projectedPercent: 0,
    };
  }

  const safeTotal = Math.max(
    0,
    Math.floor(total),
  );

  const safeAttended = clamp(
    Math.floor(attended),
    0,
    safeTotal,
  );

  const target = clamp(
    targetPercent,
    0,
    100,
  );

  const currentPercentage =
    (safeAttended / safeTotal) * 100;

  if (currentPercentage >= target) {
    return {
      required: 0,
      possible: true,
      projectedPercent: Math.round(currentPercentage),
    };
  }

  /*
   * We need:
   *
   * (attended + x) / (total + x) >= target / 100
   *
   * Therefore:
   *
   * x >= (target * total - 100 * attended)
   *      / (100 - target)
   */
  if (target >= 100) {
    return {
      required:
        safeAttended === safeTotal
          ? 0
          : Infinity,
      possible: safeAttended === safeTotal,
      projectedPercent:
        safeAttended === safeTotal ? 100 : 100,
    };
  }

  const required = Math.max(
    0,
    Math.ceil(
      (
        (target / 100) * safeTotal -
        safeAttended
      ) /
        (1 - target / 100),
    ),
  );

  const projectedPercent = Math.round(
    (
      (safeAttended + required) /
      (safeTotal + required)
    ) * 100,
  );

  return {
    required,
    possible: true,
    projectedPercent,
  };
}

/* -------------------------------------------------------------------------- */
/* GPA / Academic Utilities                                                   */
/* -------------------------------------------------------------------------- */

const STANDARD_GRADE_SCALE: Record<
  string,
  number
> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0,
};

const INDIA_GRADE_SCALE: Record<
  string,
  number
> = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  'C+': 5,
  C: 4,
  D: 3,
  F: 0,
};

export function getGradePoint(
  grade: string,
  system: 'standard' | 'india' = 'standard',
): number {
  const normalizedGrade = grade
    .trim()
    .toUpperCase();

  const scale =
    system === 'india'
      ? INDIA_GRADE_SCALE
      : STANDARD_GRADE_SCALE;

  return scale[normalizedGrade] ?? 0;
}

export function calculateGPA(
  entries: {
    grade: string;
    credits: number;
  }[],
  system: 'standard' | 'india' = 'standard',
): number {
  if (!entries.length) {
    return 0;
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const entry of entries) {
    if (
      !Number.isFinite(entry.credits) ||
      entry.credits <= 0
    ) {
      continue;
    }

    const gradePoint = getGradePoint(
      entry.grade,
      system,
    );

    totalPoints +=
      gradePoint * entry.credits;

    totalCredits += entry.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return Number(
    (totalPoints / totalCredits).toFixed(2),
  );
}

export function calculateCGPA(
  semesters: {
    gpa: number;
    credits: number;
  }[],
): number {
  if (!semesters.length) {
    return 0;
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const semester of semesters) {
    if (
      !Number.isFinite(semester.gpa) ||
      !Number.isFinite(semester.credits) ||
      semester.credits <= 0
    ) {
      continue;
    }

    totalPoints +=
      semester.gpa * semester.credits;

    totalCredits += semester.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return Number(
    (totalPoints / totalCredits).toFixed(2),
  );
}

export function calculatePercentageFromCGPA(
  cgpa: number,
  scale = 10,
  maxPercentage = 100,
): number {
  if (
    !Number.isFinite(cgpa) ||
    !Number.isFinite(scale) ||
    !Number.isFinite(maxPercentage) ||
    scale <= 0 ||
    maxPercentage <= 0
  ) {
    return 0;
  }

  return Number(
    ((cgpa / scale) * maxPercentage).toFixed(2),
  );
}

/* -------------------------------------------------------------------------- */
/* Financial / Calculator Utilities                                           */
/* -------------------------------------------------------------------------- */

export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number,
): number {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(discountedPrice) ||
    originalPrice <= 0
  ) {
    return 0;
  }

  return Number(
    (
      ((originalPrice - discountedPrice) /
        originalPrice) *
      100
    ).toFixed(2),
  );
}

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number,
): {
  interest: number;
  total: number;
} {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(time)
  ) {
    return {
      interest: 0,
      total: 0,
    };
  }

  const interest =
    (principal * rate * time) / 100;

  return {
    interest: Number(
      interest.toFixed(2),
    ),
    total: Number(
      (principal + interest).toFixed(2),
    ),
  };
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundsPerYear = 1,
): {
  interest: number;
  total: number;
} {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(time) ||
    !Number.isFinite(compoundsPerYear) ||
    compoundsPerYear <= 0
  ) {
    return {
      interest: 0,
      total: 0,
    };
  }

  const amount =
    principal *
    Math.pow(
      1 +
        rate /
          (100 * compoundsPerYear),
      compoundsPerYear * time,
    );

  return {
    interest: Number(
      (amount - principal).toFixed(2),
    ),
    total: Number(
      amount.toFixed(2),
    ),
  };
}

export function calculateBMI(
  weight: number,
  height: number,
): {
  bmi: number;
  category: string;
} {
  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(height) ||
    weight <= 0 ||
    height <= 0
  ) {
    return {
      bmi: 0,
      category: 'Invalid input',
    };
  }

  const heightInMeters =
    height / 100;

  const bmi =
    weight /
    Math.pow(heightInMeters, 2);

  let category = 'Underweight';

  if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
  } else if (bmi >= 30) {
    category = 'Obese';
  }

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
  };
}

export function calculateAge(
  birthDate: string | Date,
): number {
  const birth = toValidDate(birthDate);

  if (!birth) {
    return 0;
  }

  const today = new Date();

  if (birth > today) {
    return 0;
  }

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const monthDifference =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birth.getDate()
    )
  ) {
    age--;
  }

  return Math.max(0, age);
}

export function calculateDateDifference(
  start: string | Date,
  end: string | Date,
): {
  days: number;
  hours: number;
  minutes: number;
} {
  const startDate = toValidDate(start);
  const endDate = toValidDate(end);

  if (!startDate || !endDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const difference = Math.abs(
    endDate.getTime() -
      startDate.getTime(),
  );

  const days = Math.floor(
    difference /
      (1000 * 60 * 60 * 24),
  );

  const hours = Math.floor(
    (
      difference %
      (1000 * 60 * 60 * 24)
    ) /
      (1000 * 60 * 60),
  );

  const minutes = Math.floor(
    (
      difference %
      (1000 * 60 * 60)
    ) /
      (1000 * 60),
  );

  return {
    days,
    hours,
    minutes,
  };
}

/* -------------------------------------------------------------------------- */
/* Math Utilities                                                             */
/* -------------------------------------------------------------------------- */

function gcd(
  first: number,
  second: number,
): number {
  let a = Math.abs(
    Math.trunc(first),
  );

  let b = Math.abs(
    Math.trunc(second),
  );

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a;
}

export function calculateFraction(
  numerator: number,
  denominator: number,
): {
  decimal: number;
  simplified: string;
} {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return {
      decimal: NaN,
      simplified: 'Undefined',
    };
  }

  if (numerator === 0) {
    return {
      decimal: 0,
      simplified: '0/1',
    };
  }

  const divisor = gcd(
    numerator,
    denominator,
  );

  if (divisor === 0) {
    return {
      decimal: NaN,
      simplified: 'Undefined',
    };
  }

  let simplifiedNumerator =
    numerator / divisor;

  let simplifiedDenominator =
    denominator / divisor;

  if (simplifiedDenominator < 0) {
    simplifiedNumerator *= -1;
    simplifiedDenominator *= -1;
  }

  return {
    decimal: Number(
      (numerator / denominator).toFixed(4),
    ),
    simplified:
      `${simplifiedNumerator}/${simplifiedDenominator}`,
  };
}

export function calculateRatio(
  first: number,
  second: number,
): string {
  if (
    !Number.isFinite(first) ||
    !Number.isFinite(second) ||
    second === 0
  ) {
    return 'Undefined';
  }

  if (first === 0) {
    return '0:1';
  }

  const divisor = gcd(first, second);

  if (divisor === 0) {
    return 'Undefined';
  }

  let a = first / divisor;
  let b = second / divisor;

  if (b < 0) {
    a *= -1;
    b *= -1;
  }

  return `${a}:${b}`;
}

/* -------------------------------------------------------------------------- */
/* Temperature Conversion                                                     */
/* -------------------------------------------------------------------------- */

export function celsiusToFahrenheit(
  celsius: number,
): number {
  return Number(
    ((celsius * 9) / 5 + 32).toFixed(2),
  );
}

export function fahrenheitToCelsius(
  fahrenheit: number,
): number {
  return Number(
    (
      ((fahrenheit - 32) * 5) /
      9
    ).toFixed(2),
  );
}

export function celsiusToKelvin(
  celsius: number,
): number {
  return Number(
    (celsius + 273.15).toFixed(2),
  );
}

export function kelvinToCelsius(
  kelvin: number,
): number {
  return Number(
    (kelvin - 273.15).toFixed(2),
  );
}

export function fahrenheitToKelvin(
  fahrenheit: number,
): number {
  return celsiusToKelvin(
    fahrenheitToCelsius(fahrenheit),
  );
}

export function kelvinToFahrenheit(
  kelvin: number,
): number {
  return celsiusToFahrenheit(
    kelvinToCelsius(kelvin),
  );
}

/* -------------------------------------------------------------------------- */
/* Length / Weight / Volume / Speed Conversions                               */
/* -------------------------------------------------------------------------- */

export function metersToFeet(
  meters: number,
): number {
  return Number(
    (meters * 3.28084).toFixed(2),
  );
}

export function feetToMeters(
  feet: number,
): number {
  return Number(
    (feet / 3.28084).toFixed(2),
  );
}

export function kgToPounds(
  kilograms: number,
): number {
  return Number(
    (kilograms * 2.20462).toFixed(2),
  );
}

export function poundsToKg(
  pounds: number,
): number {
  return Number(
    (pounds / 2.20462).toFixed(2),
  );
}

export function kmToMiles(
  kilometers: number,
): number {
  return Number(
    (kilometers * 0.621371).toFixed(2),
  );
}

export function milesToKm(
  miles: number,
): number {
  return Number(
    (miles * 1.60934).toFixed(2),
  );
}

export function litersToGallons(
  liters: number,
): number {
  return Number(
    (liters * 0.264172).toFixed(2),
  );
}

export function gallonsToLiters(
  gallons: number,
): number {
  return Number(
    (gallons / 0.264172).toFixed(2),
  );
}

export function mpsToKph(
  metersPerSecond: number,
): number {
  return Number(
    (metersPerSecond * 3.6).toFixed(2),
  );
}

export function kphToMps(
  kilometersPerHour: number,
): number {
  return Number(
    (kilometersPerHour / 3.6).toFixed(2),
  );
}

export function mpsToMph(
  metersPerSecond: number,
): number {
  return Number(
    (metersPerSecond * 2.23694).toFixed(2),
  );
}

export function kmToM(
  kilometers: number,
): number {
  return kilometers * 1000;
}

export function mToKm(
  meters: number,
): number {
  return meters / 1000;
}

/* -------------------------------------------------------------------------- */
/* Digital Storage Conversion                                                 */
/* -------------------------------------------------------------------------- */

export function bytesToKB(
  bytes: number,
): number {
  return bytes / 1024;
}

export function KBToBytes(
  kilobytes: number,
): number {
  return kilobytes * 1024;
}

export function bytesToMB(
  bytes: number,
): number {
  return bytes / (1024 * 1024);
}

export function MBToBytes(
  megabytes: number,
): number {
  return megabytes * 1024 * 1024;
}

/* -------------------------------------------------------------------------- */
/* Number Base Conversion                                                     */
/* -------------------------------------------------------------------------- */

export function decimalToBinary(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Math.trunc(value).toString(2);
}

export function binaryToDecimal(
  binary: string,
): number {
  const value = binary.trim();

  if (!/^[01]+$/.test(value)) {
    return NaN;
  }

  return parseInt(value, 2);
}

export function decimalToOctal(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Math.trunc(value).toString(8);
}

export function octalToDecimal(
  octal: string,
): number {
  const value = octal.trim();

  if (!/^[0-7]+$/.test(value)) {
    return NaN;
  }

  return parseInt(value, 8);
}

export function decimalToHex(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Math.trunc(value)
    .toString(16)
    .toUpperCase();
}

export function hexToDecimal(
  hex: string,
): number {
  const value = hex.trim();

  if (!/^[0-9a-f]+$/i.test(value)) {
    return NaN;
  }

  return parseInt(value, 16);
}