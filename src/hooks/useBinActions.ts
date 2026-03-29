import { db } from '../db/schema';
import { Bin, BinFormData } from '../types/bin';

export function useBinActions() {
  /**
   * Create a new bin in the database.
   */
  const createBin = async (data: BinFormData): Promise<number> => {
    const now = new Date();
    const id = await db.bins.add({
      name: data.name,
      state: data.state,
      inUseStartDate: data.inUseStartDate,
      fermentingStartDate: data.fermentingStartDate,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  };

  /**
   * Update an existing bin.
   */
  const updateBin = async (id: number, data: Partial<BinFormData>): Promise<void> => {
    const now = new Date();
    await db.bins.update(id, {
      ...(data.name && { name: data.name }),
      ...(data.state && { state: data.state }),
      ...(data.inUseStartDate !== undefined && { inUseStartDate: data.inUseStartDate }),
      ...(data.fermentingStartDate !== undefined && { fermentingStartDate: data.fermentingStartDate }),
      updatedAt: now,
    });
  };

  /**
   * Delete a bin.
   */
  const deleteBin = async (id: number): Promise<void> => {
    await db.bins.delete(id);
  };

  return { createBin, updateBin, deleteBin };
}
