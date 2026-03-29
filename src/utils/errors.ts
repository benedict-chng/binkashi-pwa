/**
 * Error handling utilities for Binkashi app.
 * Provides user-friendly error messages for common error scenarios.
 */

/**
 * Handle storage-related errors.
 * @param error - The error object
 * @returns User-friendly error message
 */
export function handleStorageError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unknown storage error occurred';
  }

  const errorMessage = 'message' in error ? String(error.message) : '';
  const errorName = 'name' in error ? String(error.name) : '';

  // Detect QuotaExceededError
  if (errorName === 'QuotaExceededError' || errorMessage.toLowerCase().includes('quota')) {
    return 'Storage quota exceeded. Delete some bins or images to free up space.';
  }

  // Generic storage error
  return `Storage error: ${errorMessage || 'Failed to save data'}`;
}

/**
 * Handle camera/file permission errors.
 * @param error - The error object
 * @returns User-friendly error message
 */
export function handleCameraError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unknown camera error occurred';
  }

  const errorMessage = 'message' in error ? String(error.message) : '';
  const errorName = 'name' in error ? String(error.name) : '';

  // Detect permission denied
  if (errorName === 'NotAllowedError' || errorMessage.toLowerCase().includes('permission')) {
    return 'Camera permission denied. Enable camera access in browser settings or use file upload instead.';
  }

  // Detect NotReadableError (device in use)
  if (errorName === 'NotReadableError' || errorMessage.toLowerCase().includes('readable')) {
    return 'Camera is already in use by another application.';
  }

  // Detect NotFoundError (no camera)
  if (errorName === 'NotFoundError' || errorMessage.toLowerCase().includes('camera')) {
    return 'No camera found on this device.';
  }

  // Generic camera error
  return `Camera error: ${errorMessage || 'Failed to access camera'}`;
}

/**
 * Handle IndexedDB database errors.
 * @param error - The error object
 * @returns User-friendly error message
 */
export function handleIndexedDBError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unknown database error occurred';
  }

  const errorMessage = 'message' in error ? String(error.message) : '';
  const errorName = 'name' in error ? String(error.name) : '';

  // Detect transaction timeout
  if (errorName === 'TransactionInactiveError' || errorMessage.toLowerCase().includes('timeout')) {
    return 'Database operation timed out. Please try again.';
  }

  // Detect constraint errors
  if (
    errorName === 'ConstraintError' ||
    errorMessage.toLowerCase().includes('constraint') ||
    errorMessage.toLowerCase().includes('duplicate')
  ) {
    return 'Database constraint violation. Please check your data.';
  }

  // Detect database errors
  if (errorName === 'InvalidStateError' || errorMessage.toLowerCase().includes('invalid state')) {
    return 'Database is in an invalid state. Please refresh the page.';
  }

  // Detect version errors
  if (errorName === 'VersionError' || errorMessage.toLowerCase().includes('version')) {
    return 'Database version mismatch. Please refresh the page.';
  }

  // Generic IndexedDB error
  return `Database error: ${errorMessage || 'Failed to access database'}`;
}

/**
 * Handle service worker errors.
 * @param error - The error object
 * @returns User-friendly error message
 */
export function handleServiceWorkerError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unknown service worker error occurred';
  }

  const errorMessage = 'message' in error ? String(error.message) : '';

  // Generic service worker error
  return `App update failed: ${errorMessage || 'Refresh the page to try again'}`;
}

/**
 * Handle generic errors with a fallback message.
 * @param error - The error object
 * @param fallbackMessage - Fallback message if error parsing fails
 * @returns User-friendly error message
 */
export function handleGenericError(error: unknown, fallbackMessage: string = 'An unexpected error occurred'): string {
  if (!error || typeof error !== 'object') {
    return fallbackMessage;
  }

  const errorMessage = 'message' in error ? String(error.message) : '';

  return errorMessage || fallbackMessage;
}
