export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function isRequired(
  value: string,
  fieldName = 'This field',
): ValidationResult {
  if (!value.trim()) {
    return {
      valid: false,
      message: `${fieldName} is required.`,
    };
  }

  return { valid: true };
}

export function isEmail(
  value: string,
): ValidationResult {
  const email = value.trim();

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(email)
    ? { valid: true }
    : {
        valid: false,
        message: 'Enter a valid email address.',
      };
}

export function isUrl(
  value: string,
): ValidationResult {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Unsupported protocol');
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      message: 'Enter a valid URL.',
    };
  }
}

export function isNumberInRange(
  value: number,
  min: number,
  max: number,
  fieldName = 'Value',
): ValidationResult {
  if (!Number.isFinite(value)) {
    return {
      valid: false,
      message: `${fieldName} must be a number.`,
    };
  }

  if (value < min || value > max) {
    return {
      valid: false,
      message: `${fieldName} must be between ${min} and ${max}.`,
    };
  }

  return { valid: true };
}

export function isPositiveNumber(
  value: number,
  fieldName = 'Value',
): ValidationResult {
  if (!Number.isFinite(value) || value <= 0) {
    return {
      valid: false,
      message: `${fieldName} must be greater than zero.`,
    };
  }

  return { valid: true };
}

export function validatePassword(
  password: string,
): ValidationResult {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must contain at least 8 characters.',
    };
  }

  return { valid: true };
}

export function passwordsMatch(
  password: string,
  confirmPassword: string,
): ValidationResult {
  return password === confirmPassword
    ? { valid: true }
    : {
        valid: false,
        message: 'Passwords do not match.',
      };
}

export function validateFileSize(
  file: File,
  maxSizeMB: number,
): ValidationResult {
  const maxBytes =
    maxSizeMB * 1024 * 1024;

  return file.size <= maxBytes
    ? { valid: true }
    : {
        valid: false,
        message: `${file.name} exceeds the ${maxSizeMB}MB limit.`,
      };
}

export function validateFileType(
  file: File,
  acceptedTypes: string[],
): ValidationResult {
  if (acceptedTypes.length === 0) {
    return { valid: true };
  }

  const valid = acceptedTypes.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(
        type.slice(0, -1),
      );
    }

    return file.type === type;
  });

  return valid
    ? { valid: true }
    : {
        valid: false,
        message: `${file.name} has an unsupported file type.`,
      };
}