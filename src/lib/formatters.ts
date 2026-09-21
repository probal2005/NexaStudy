import { round } from './utils';

export function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
  }).format(value);
}

export function formatPercentage(
  value: number,
  decimals = 0,
): string {
  return `${round(value, decimals)}%`;
}

export function formatDuration(
  totalMinutes: number,
): string {
  const minutes = Math.max(0, Math.floor(totalMinutes));

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatDurationLong(
  totalMinutes: number,
): string {
  const minutes = Math.max(0, Math.floor(totalMinutes));

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(
      `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
    );
  }

  if (remainingMinutes > 0) {
    parts.push(
      `${remainingMinutes} ${
        remainingMinutes === 1 ? 'minute' : 'minutes'
      }`,
    );
  }

  return parts.length > 0 ? parts.join(' ') : '0 minutes';
}

export function formatBytes(
  bytes: number,
  decimals = 1,
): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024),
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    Math.max(0, decimals),
  )} ${units[index] ?? 'Bytes'}`;
}

export function formatGpa(
  gpa: number,
): string {
  return gpa.toFixed(2);
}

export function formatGradePoint(
  gradePoint: number,
): string {
  return gradePoint.toFixed(1);
}

export function formatTemperature(
  value: number,
  unit: 'C' | 'F' = 'C',
): string {
  return `${Math.round(value)}°${unit}`;
}

export function formatWindSpeed(
  speed: number,
  unit = 'km/h',
): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatCompactNumber(
  value: number,
): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}