import type { BinState } from '../types/bin';

/**
 * Apply state transition rules when bin state changes.
 *
 * Rules:
 * - When state is 'Empty': Clear inUseStartDate and fermentingStartDate
 * - When state is 'In Use': Set inUseStartDate to today (if not set)
 * - When state is 'Fermenting': Set fermentingStartDate to today (if not set)
 *
 * @param newState - The new bin state
 * @param currentData - Current bin form data
 * @returns Updated form data with state transitions applied
 */
export function handleStateTransition(
  newState: BinState,
  currentData: {
    inUseStartDate: Date | null;
    fermentingStartDate: Date | null;
  }
): {
  inUseStartDate: Date | null;
  fermentingStartDate: Date | null;
} {
  let { inUseStartDate, fermentingStartDate } = currentData;

  switch (newState) {
    case 'Empty':
      // Clear both dates when bin is emptied
      inUseStartDate = null;
      fermentingStartDate = null;
      break;

    case 'In Use':
      // Set inUseStartDate to today if not already set
      if (!inUseStartDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        inUseStartDate = today;
      }
      // Keep fermentingStartDate unchanged
      break;

    case 'Fermenting':
      // Set fermentingStartDate to today if not already set
      if (!fermentingStartDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        fermentingStartDate = today;
      }
      // Keep inUseStartDate unchanged
      break;
  }

  return { inUseStartDate, fermentingStartDate };
}
