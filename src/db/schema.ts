import Dexie, { Table } from 'dexie';

export interface Bin {
  id?: number;
  name: string;
  state: 'Empty' | 'In Use' | 'Fermenting';
  inUseStartDate: Date | null;
  fermentingStartDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class BinkashiDB extends Dexie {
  bins!: Table<Bin>;

  constructor() {
    super('BinkashiDB');
    this.version(1).stores({
      bins: '++id, name, state, inUseStartDate, fermentingStartDate, createdAt, updatedAt'
    });
  }
}

export const db = new BinkashiDB();
