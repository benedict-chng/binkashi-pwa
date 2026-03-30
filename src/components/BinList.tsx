import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBins } from '../hooks/useBins';
import { useBinActions } from '../hooks/useBinActions';
import { BinCard } from './BinCard';
import { ImageModal } from './ImageModal';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { useToast } from './Toast';
import type { SortField } from '../types/bin';

export function BinList() {
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const bins = useBins(sortBy);
  const { deleteBin } = useBinActions();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBin(id);
      showToast('Bin deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete bin:', error);
      showToast('Failed to delete bin', 'error');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/bins/${id}/edit`);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (bins === undefined) {
    return <LoadingState message="Loading bins..." size="medium" />;
  }

  if (bins.length === 0) {
    return (
      <EmptyState
        icon={<span role="img" aria-label="Compost bin">🗑️</span>}
        title="No bins yet"
        message="Create your first bin to get started"
        action={
          <Link
            to="/bins/new"
            className="btn-primary bg-sky-surge text-black px-6 py-3 rounded-md text-base font-medium"
          >
            Create First Bin
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Sorting controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-black leading-tight">My Bins</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-dim-grey font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="px-4 py-2 border border-khaki-beige rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-surge focus:border-sky-surge input-base"
          >
            <option value="name">Name</option>
            <option value="state">State</option>
            <option value="daysInUse">Days in Use</option>
            <option value="inUseStartDate">In Use Date</option>
            <option value="fermentingStartDate">Fermenting Date</option>
          </select>
        </div>
      </div>

      {/* Bin grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bins.map((bin) => (
          <BinCard key={bin.id} bin={bin} onImageClick={handleImageClick} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>

      {/* Image modal */}
      <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
    </div>
  );
}
