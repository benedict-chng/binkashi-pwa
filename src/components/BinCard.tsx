import { useEffect, useState, useRef } from 'react';
import type { Bin } from '../types/bin';
import { getStateLabel, formatBinDate } from '../types/bin';

interface BinCardProps {
  bin: Bin;
  onImageClick?: (imageUrl: string) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function BinCard({ bin, onImageClick, onDelete, onEdit }: BinCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if browser supports native lazy loading
    const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;

    if (bin.image && !imageUrl && supportsLazyLoading) {
      // Native lazy loading is supported, load image immediately
      // The browser will handle lazy loading via loading="lazy" attribute
      const url = URL.createObjectURL(bin.image);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (bin.image && !imageUrl && !supportsLazyLoading) {
      // Use IntersectionObserver for browsers without native lazy loading (e.g., Safari < 15.4)
      if (!imageRef.current) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && bin.image && !imageUrl) {
              const url = URL.createObjectURL(bin.image);
              setImageUrl(url);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(imageRef.current);
      observerRef.current = observer;

      return () => {
        observer.disconnect();
      };
    }
  }, [bin.image]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${bin.name}"?`)) {
      if (bin.id !== undefined) {
        onDelete?.(bin.id);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Mark as loaded to stop showing placeholder
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden card-hover">
      {bin.image && (
        <div className="relative">
          {/* Image container */}
          {!imageLoaded && (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          )}

          {imageError && (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Image failed to load</p>
            </div>
          )}

          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl}
              alt={bin.name}
              loading="lazy"
              className={`w-full h-48 object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300 ease-in-out ${
                !imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              onClick={() => onImageClick?.(imageUrl)}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          <div className="absolute top-2 right-2 flex gap-2">
            {onEdit && bin.id !== undefined && (
              <button
                onClick={() => onEdit(bin.id!)}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Edit bin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Delete bin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">{bin.name}</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">State:</span>
          <span className={`font-semibold ${
            bin.state === 'Empty' ? 'text-gray-500' :
            bin.state === 'In Use' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {getStateLabel(bin.state)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">In Use Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.inUseStartDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Fermenting Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.fermentingStartDate)}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
