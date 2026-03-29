import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { Bin, SortField } from '../types/bin';

export function useBins(sortField: SortField = 'createdAt') {
  return useLiveQuery(
    () => {
      let query = db.bins.orderBy(sortField);

      // Handle null dates (they should sort last)
      if (sortField === 'inUseStartDate' || sortField === 'fermentingStartDate') {
        return query.toArray().then(bins =>
          bins.sort((a, b) => {
            const aVal = a[sortField] ? new Date(a[sortField]!).getTime() : 0;
            const bVal = b[sortField] ? new Date(b[sortField]!).getTime() : 0;
            return bVal - aVal; // Descending (newest first)
          })
        );
      }

      // Default: ascending for strings and other fields
      return query.toArray();
    },
    [sortField],
    [] as Bin[]
  );
}
