'use client';

import { useCallback, useState } from 'react';

export interface FileUploadOptions {
  accept?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
}

export interface FileUploadState {
  files: File[];
  errors: string[];
  isDragging: boolean;
}

function matchesAcceptedType(
  file: File,
  acceptedTypes: string[],
): boolean {
  if (acceptedTypes.length === 0) {
    return true;
  }

  return acceptedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }

    return file.type === type;
  });
}

export function useFileUpload(
  options: FileUploadOptions = {},
) {
  const {
    accept = [],
    maxFiles = 10,
    maxSizeMB = 20,
    multiple = true,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    errors: [],
    isDragging: false,
  });

  const validateFiles = useCallback(
    (incomingFiles: File[]): File[] => {
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of incomingFiles) {
        if (!matchesAcceptedType(file, accept)) {
          errors.push(`${file.name}: unsupported file type.`);
          continue;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
          errors.push(
            `${file.name}: exceeds ${maxSizeMB}MB limit.`,
          );
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
      }

      setState((previous) => ({
        ...previous,
        errors,
      }));

      return validFiles.slice(0, maxFiles);
    },
    [accept, maxFiles, maxSizeMB],
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      const validated = validateFiles(incomingFiles);

      setState((previous) => {
        const combined = multiple
          ? [...previous.files, ...validated]
          : validated.slice(0, 1);

        return {
          ...previous,
          files: combined.slice(0, maxFiles),
        };
      });
    },
    [maxFiles, multiple, validateFiles],
  );

  const removeFile = useCallback((index: number) => {
    setState((previous) => ({
      ...previous,
      files: previous.files.filter(
        (_, fileIndex) => fileIndex !== index,
      ),
    }));
  }, []);

  const clearFiles = useCallback(() => {
    setState({
      files: [],
      errors: [],
      isDragging: false,
    });
  }, []);

  const setDragging = useCallback((isDragging: boolean) => {
    setState((previous) => ({
      ...previous,
      isDragging,
    }));
  }, []);

  return {
    files: state.files,
    errors: state.errors,
    isDragging: state.isDragging,
    addFiles,
    removeFile,
    clearFiles,
    setDragging,
  };
}