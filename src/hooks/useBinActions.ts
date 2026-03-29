import { db } from '../db/schema';
import type { BinFormData } from '../types/bin';
import { handleStorageError, handleIndexedDBError } from '../utils/errors';

export function useBinActions() {
  /**
   * Create a new bin in the database.
   */
  const createBin = async (data: BinFormData): Promise<number> => {
    try {
      const now = new Date();
      const id = await db.bins.add({
        name: data.name,
        state: data.state,
        inUseStartDate: data.inUseStartDate,
        fermentingStartDate: data.fermentingStartDate,
        image: data.image as Blob | null,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error && error.name === 'QuotaExceededError'
        ? handleStorageError(error)
        : handleIndexedDBError(error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Update an existing bin.
   */
  const updateBin = async (id: number, data: Partial<BinFormData>): Promise<void> => {
    try {
      const now = new Date();
      await db.bins.update(id, {
        ...(data.name && { name: data.name }),
        ...(data.state && { state: data.state }),
        ...(data.inUseStartDate !== undefined && { inUseStartDate: data.inUseStartDate }),
        ...(data.fermentingStartDate !== undefined && { fermentingStartDate: data.fermentingStartDate }),
        ...(data.image !== undefined && { image: data.image as Blob | null }),
        updatedAt: now,
      });
    } catch (error) {
      const errorMessage = error instanceof Error && error.name === 'QuotaExceededError'
        ? handleStorageError(error)
        : handleIndexedDBError(error);
      throw new Error(errorMessage);
    }
  };

  /**
   * Delete a bin.
   */
  const deleteBin = async (id: number): Promise<void> => {
    try {
      await db.bins.delete(id);
    } catch (error) {
      throw new Error(handleIndexedDBError(error));
    }
  };

  return { createBin, updateBin, deleteBin };
}
