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

/**
 * Calculates the number of days between inUseStartDate and current date
 * @param inUseStartDate - The date the bin started being used
 * @param state - The current bin state
 * @returns Number of days in use, or 0 if state is Empty or date is null
 */
export const calculateDaysInUse = (
  inUseStartDate: Date | null,
  state: 'Empty' | 'In Use' | 'Fermenting'
): number => {
  // Return 0 if bin is Empty (per DISP-03)
  if (state === 'Empty') {
    return 0;
  }

  // Return 0 if no start date
  if (!inUseStartDate) {
    return 0;
  }

  const startDate = new Date(inUseStartDate);
  const currentDate = new Date();

  // Reset time components to compare only dates (not times)
  startDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diffInMs = currentDate.getTime() - startDate.getTime();

  // Convert milliseconds to days (round down)
  const daysInUse = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Ensure non-negative (handles future dates)
  return Math.max(0, daysInUse);
};
