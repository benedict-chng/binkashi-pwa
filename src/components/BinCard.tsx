import { useEffect, useState } from 'react';
import type { Bin } from '../types/bin';
import { getStateLabel, formatBinDate } from '../types/bin';

interface BinCardProps {
  bin: Bin;
  onImageClick?: (imageUrl: string) => void;
}

export function BinCard({ bin, onImageClick }: BinCardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={bin.name}
          className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick?.(imageUrl)}
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{bin.name}</h3>

      <div className="space-y-1 text-sm">
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
