import { useState, useEffect } from 'react';
import type { BinFormData, BinState } from '../types/bin';
import { BIN_STATES, getStateLabel } from '../types/bin';
import { useBinActions } from '../hooks/useBinActions';
import { handleStateTransition } from '../hooks/useStateTransitions';
import { formatDateForInput } from '../utils/dates';
import { compressImage } from '../utils/imageCompression';
import { useToast } from './Toast';
import { LoadingState } from './LoadingState';
import { handleCameraError } from '../utils/errors';

interface BinFormProps {
  onSubmit: (data: BinFormData) => void;
  initialData?: BinFormData;
  submitLabel?: string;
}

export function BinForm({ onSubmit, initialData, submitLabel = 'Create Bin' }: BinFormProps) {
  const { createBin } = useBinActions();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<BinFormData>(initialData || {
    name: '',
    state: 'Empty',
    inUseStartDate: null,
    fermentingStartDate: null,
    image: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle image preview from initialData (for edit mode)
  useEffect(() => {
    if (initialData?.image) {
      const previewUrl = URL.createObjectURL(initialData.image);
      setImagePreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [initialData?.image]);

  const handleFieldChange = (field: keyof BinFormData, value: any) => {
    // Handle state transition when state changes
    if (field === 'state') {
      const newState = value as BinState;
      const { inUseStartDate, fermentingStartDate } = handleStateTransition(newState, formData);
      setFormData({ ...formData, state: newState, inUseStartDate, fermentingStartDate });
      return;
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file', 'error');
          return;
        }

        setIsCompressing(true);
        showToast('Compressing image...', 'info');

        // Compress image before storage
        const compressedImage = await compressImage(file, {
          maxWidth: 1200,
          quality: 0.8,
          maxSizeKB: 500,
        });

        const previewUrl = URL.createObjectURL(compressedImage);
        setImagePreview(previewUrl);
        setFormData({ ...formData, image: compressedImage });
        showToast('Image selected', 'info');
      }
    } catch (error) {
      console.error('Failed to select image:', error);
      const errorMessage = handleCameraError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    try {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setFormData({ ...formData, image: null });
      showToast('Image removed', 'info');
    } catch (error) {
      console.error('Failed to remove image:', error);
      showToast('Failed to remove image', 'error');
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createBin(formData);
      // Clear image preview after successful submission
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      showToast('Bin saved successfully', 'success');
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to create bin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save bin';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="e.g., Kitchen Bin"
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* State field */}
      <div>
        <label htmlFor="state" className="block text-base font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          id="state"
          value={formData.state}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSubmitting}
        >
          {BIN_STATES.map((state) => (
            <option key={state} value={state}>
              {getStateLabel(state)}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Changing state may auto-set or clear dates
        </p>
      </div>

      {/* In Use Start Date field */}
      <div>
        <label htmlFor="inUseStartDate" className="block text-base font-medium text-gray-700 mb-1">
          In Use Start Date
        </label>
        <input
          type="date"
          id="inUseStartDate"
          value={formatDateForInput(formData.inUseStartDate)}
          onChange={(e) => handleFieldChange('inUseStartDate', e.target.value ? new Date(e.target.value) : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSubmitting}
        />
        {formData.state === 'Empty' && (
          <p className="text-xs text-gray-500 mt-1">Date will be cleared when state changes to Empty</p>
        )}
      </div>

      {/* Fermenting Start Date field */}
      <div>
        <label htmlFor="fermentingStartDate" className="block text-base font-medium text-gray-700 mb-1">
          Fermenting Start Date
        </label>
        <input
          type="date"
          id="fermentingStartDate"
          value={formatDateForInput(formData.fermentingStartDate)}
          onChange={(e) => handleFieldChange('fermentingStartDate', e.target.value ? new Date(e.target.value) : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSubmitting}
        />
        {formData.state === 'Empty' && (
          <p className="text-xs text-gray-500 mt-1">Date will be cleared when state changes to Empty</p>
        )}
      </div>

      {/* Image section */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">
          Image
        </label>
        <p className="text-xs text-gray-500 mb-2">Optional: Add a photo of your bin</p>

        {/* Image preview */}
        {imagePreview && (
          <div className="mb-3 relative">
            <img
              src={imagePreview}
              alt="Bin preview"
              className="max-w-full h-48 object-cover rounded-md border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSubmitting || isCompressing}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {/* Image upload buttons */}
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting || isCompressing}
              className="hidden"
              id="upload-photo"
            />
            <label
              htmlFor="upload-photo"
              className={`block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                isCompressing ? 'opacity-75' : ''
              }`}
            >
              {isCompressing ? 'Compressing...' : 'Upload Photo'}
            </label>
          </div>

          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={isSubmitting || isCompressing}
              className="hidden"
              id="take-photo"
            />
            <label
              htmlFor="take-photo"
              className={`block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                isCompressing ? 'opacity-75' : ''
              }`}
            >
              {isCompressing ? 'Compressing...' : 'Take Photo'}
            </label>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting || isCompressing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>

      {/* Loading state during submission */}
      {isSubmitting && (
        <div className="modal-fade-in">
          <LoadingState message="Saving..." size="small" />
        </div>
      )}
    </form>
  );
}
