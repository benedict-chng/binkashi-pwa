import type { Bin as DBBin } from '../db/schema';

export type BinState = 'Empty' | 'In Use' | 'Fermenting';

export interface Bin extends DBBin {
  state: BinState;
}

export type SortField = 'name' | 'state' | 'createdAt' | 'inUseStartDate' | 'fermentingStartDate' | 'daysInUse';

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
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
