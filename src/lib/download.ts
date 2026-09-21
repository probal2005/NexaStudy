export function downloadBlob(
  blob: Blob,
  filename: string,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

export function downloadText(
  content: string,
  filename: string,
  mimeType = 'text/plain;charset=utf-8',
): void {
  const blob = new Blob([content], {
    type: mimeType,
  });

  downloadBlob(blob, filename);
}

export function downloadJson<T>(
  data: T,
  filename: string,
): void {
  const content = JSON.stringify(
    data,
    null,
    2,
  );

  downloadText(
    content,
    filename.endsWith('.json')
      ? filename
      : `${filename}.json`,
    'application/json;charset=utf-8',
  );
}

export function downloadCsv(
  rows: Array<Record<string, unknown>>,
  filename: string,
): void {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeValue = (
    value: unknown,
  ): string => {
    const text = String(value ?? '');

    if (
      text.includes(',') ||
      text.includes('"') ||
      text.includes('\n')
    ) {
      return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
  };

  const csv = [
    headers.map(escapeValue).join(','),
    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeValue(row[header]),
        )
        .join(','),
    ),
  ].join('\n');

  downloadText(
    csv,
    filename.endsWith('.csv')
      ? filename
      : `${filename}.csv`,
    'text/csv;charset=utf-8',
  );
}