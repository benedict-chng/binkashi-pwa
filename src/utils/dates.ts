/**
 * Parse a date string to a Date object.
 * Handles null/undefined values and date strings.
 */
export function parseDate(dateString: string | Date | null | undefined): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  return new Date(dateString);
}

/**
 * Format a Date object to ISO string for form input.
 * Handles null values.
 */
export function formatDateForInput(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

/**
 * Get today's date at midnight (no time component).
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Check if two dates are the same day (ignoring time).
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
