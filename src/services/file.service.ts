import {
  createFilePreviewUrl,
  getFileMetadata,
  revokeFilePreviewUrl,
} from '@/lib/file';

export interface FileServiceMetadata {
  name: string;
  size: number;
  type: string;
  extension: string;
  lastModified: number;
}

export function inspectFile(file: File): FileServiceMetadata {
  const metadata = getFileMetadata(file);

  return {
    ...metadata,
    lastModified: file.lastModified,
  };
}

export function createPreview(file: File): string | null {
  return createFilePreviewUrl(file);
}

export function revokePreview(url: string): void {
  revokeFilePreviewUrl(url);
}

export function validateUpload(
  file: File,
  options?: {
    maxSize?: number;
    allowedTypes?: string[];
  },
): { valid: boolean; error?: string } {
  if (options?.maxSize && file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(
        options.maxSize / 1024 / 1024,
      )} MB.`,
    };
  }

  if (
    options?.allowedTypes &&
    options.allowedTypes.length > 0 &&
    !options.allowedTypes.includes(file.type)
  ) {
    return {
      valid: false,
      error: 'This file type is not supported.',
    };
  }

  return {
    valid: true,
  };
}