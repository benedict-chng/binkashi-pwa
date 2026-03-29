import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { Bin } from '../types/bin';

export function useBin(id: number): Bin | undefined {
  return useLiveQuery(
    () => db.bins.get(id),
    [id]
  );
}
