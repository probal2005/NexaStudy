export type DateInput =
  | string
  | number
  | Date;

function toDate(value: DateInput): Date {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  return new Date(value);
}

export function isValidDate(
  value: DateInput,
): boolean {
  return !Number.isNaN(toDate(value).getTime());
}

export function formatDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    options,
  ).format(date);
}

export function formatDateTime(
  value: DateInput,
): string {
  return formatDate(value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(
  value: DateInput,
): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return 'Invalid time';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function toDateInputValue(
  value: DateInput,
): string {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');
  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isToday(
  value: DateInput,
): boolean {
  const date = toDate(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isPastDate(
  value: DateInput,
): boolean {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return false;
  }

  const target = new Date(date);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return target.getTime() < today.getTime();
}

export function isFutureDate(
  value: DateInput,
): boolean {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return false;
  }

  const target = new Date(date);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return target.getTime() > today.getTime();
}

export function differenceInDays(
  start: DateInput,
  end: DateInput,
): number {
  const startDate = toDate(start);
  const endDate = toDate(end);

  const difference =
    endDate.getTime() - startDate.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );
}

export function addDays(
  value: DateInput,
  days: number,
): Date {
  const date = toDate(value);

  date.setDate(date.getDate() + days);

  return date;
}

export function startOfDay(
  value: DateInput,
): Date {
  const date = toDate(value);

  date.setHours(0, 0, 0, 0);

  return date;
}

export function endOfDay(
  value: DateInput,
): Date {
  const date = toDate(value);

  date.setHours(23, 59, 59, 999);

  return date;
}