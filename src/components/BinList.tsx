import { useState } from 'react';
import { useBins } from '../hooks/useBins';
import { BinCard } from './BinCard';
import { SortField } from '../types/bin';

export function BinList() {
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const bins = useBins(sortBy);

  if (bins === undefined) {
    return <div className="text-center text-gray-500 py-8">Loading bins...</div>;
  }

  if (bins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No bins yet</p>
        <p className="text-gray-400 text-sm">Create your first bin to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sorting controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bins</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="name">Name</option>
            <option value="state">State</option>
            <option value="inUseStartDate">In Use Date</option>
            <option value="fermentingStartDate">Fermenting Date</option>
          </select>
        </div>
      </div>

      {/* Bin grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bins.map((bin) => (
          <BinCard key={bin.id} bin={bin} />
        ))}
      </div>
    </div>
  );
}
