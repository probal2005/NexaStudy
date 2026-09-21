import { formatBytes } from './formatters';

export function getFileExtension(
  fileName: string,
): string {
  const parts = fileName.split('.');

  if (parts.length <= 1) {
    return '';
  }

  return parts.pop()?.toLowerCase() ?? '';
}

export function getFileNameWithoutExtension(
  fileName: string,
): string {
  const extension = getFileExtension(fileName);

  if (!extension) {
    return fileName;
  }

  return fileName.slice(
    0,
    -(extension.length + 1),
  );
}

export function isImageFile(
  file: File,
): boolean {
  return file.type.startsWith('image/');
}

export function isPdfFile(
  file: File,
): boolean {
  return (
    file.type === 'application/pdf' ||
    getFileExtension(file.name) === 'pdf'
  );
}

export function isTextFile(
  file: File,
): boolean {
  return (
    file.type.startsWith('text/') ||
    ['txt', 'md', 'csv', 'json'].includes(
      getFileExtension(file.name),
    )
  );
}

export function getFileTypeLabel(
  file: File,
): string {
  if (isPdfFile(file)) {
    return 'PDF';
  }

  if (isImageFile(file)) {
    return 'Image';
  }

  if (isTextFile(file)) {
    return 'Text';
  }

  const extension = getFileExtension(file.name);

  return extension
    ? extension.toUpperCase()
    : 'File';
}

export function getFileMetadata(
  file: File,
) {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    formattedSize: formatBytes(file.size),
    extension: getFileExtension(file.name),
    category: getFileTypeLabel(file),
  };
}

export function createFilePreviewUrl(
  file: File,
): string {
  return URL.createObjectURL(file);
}

export function revokeFilePreviewUrl(
  url: string,
): void {
  URL.revokeObjectURL(url);
}