import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { Bin, SortField } from '../types/bin';

export function useBins(sortField: SortField = 'createdAt') {
  return useLiveQuery(
    () => {
      // Always fetch all bins and sort in-memory to ensure consistent behavior
      return db.bins.toArray().then(bins => {
        // Handle null dates (they should sort last)
        if (sortField === 'inUseStartDate' || sortField === 'fermentingStartDate') {
          return bins.sort((a, b) => {
            const aVal = a[sortField] ? new Date(a[sortField]!).getTime() : -Infinity;
            const bVal = b[sortField] ? new Date(b[sortField]!).getTime() : -Infinity;
            return bVal - aVal; // Descending (newest first)
          });
        }

        // Sort by name or state (case-insensitive for strings)
        if (sortField === 'name') {
          return bins.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortField === 'state') {
          return bins.sort((a, b) => a.state.localeCompare(b.state));
        }

        // Default: sort by createdAt (ascending - oldest first)
        return bins.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
    },
    [sortField],
    [] as Bin[]
  );
}
