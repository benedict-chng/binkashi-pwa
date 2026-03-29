import type { Bin as DBBin } from '../db/schema';

export type BinState = 'Empty' | 'In Use' | 'Fermenting';

export interface Bin extends DBBin {
  state: BinState;
}

export type SortField = 'name' | 'state' | 'createdAt' | 'inUseStartDate' | 'fermentingStartDate';

export interface BinFormData {
  name: string;
  state: BinState;
  inUseStartDate: Date | null;
  fermentingStartDate: Date | null;
  image?: File | Blob | null;
}

export const BIN_STATES: BinState[] = ['Empty', 'In Use', 'Fermenting'];

export const getStateLabel = (state: BinState): string => {
  const labels: Record<BinState, string> = {
    'Empty': 'Empty',
    'In Use': 'In Use',
    'Fermenting': 'Fermenting'
  };
  return labels[state];
};

export const formatBinDate = (date: Date | null): string => {
  if (!date) return 'Not set';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};
