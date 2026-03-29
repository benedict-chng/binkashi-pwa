import { useEffect, useState } from 'react';
import type { Bin } from '../types/bin';
import { getStateLabel, formatBinDate } from '../types/bin';

interface BinCardProps {
  bin: Bin;
  onImageClick?: (imageUrl: string) => void;
  onDelete?: (id: string) => void;
}

export function BinCard({ bin, onImageClick, onDelete }: BinCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bin.image) {
      const url = URL.createObjectURL(bin.image);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [bin.image]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${bin.name}"?`)) {
      onDelete?.(bin.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt={bin.name}
            className="w-full h-48 object-cover cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onImageClick?.(imageUrl)}
          />
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-label="Delete bin"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{bin.name}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">State:</span>
          <span className={`font-medium ${
            bin.state === 'Empty' ? 'text-gray-500' :
            bin.state === 'In Use' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {getStateLabel(bin.state)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">In Use Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.inUseStartDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Fermenting Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.fermentingStartDate)}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
