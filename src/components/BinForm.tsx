import { useState } from 'react';
import type { BinFormData, BinState } from '../types/bin';
import { BIN_STATES, getStateLabel } from '../types/bin';
import { useBinActions } from '../hooks/useBinActions';
import { handleStateTransition } from '../hooks/useStateTransitions';
import { formatDateForInput } from '../utils/dates';

interface BinFormProps {
  onSubmit: (data: BinFormData) => void;
  initialData?: BinFormData;
  submitLabel?: string;
}

export function BinForm({ onSubmit, initialData, submitLabel = 'Create Bin' }: BinFormProps) {
  const { createBin } = useBinActions();

  const [formData, setFormData] = useState<BinFormData>(initialData || {
    name: '',
    state: 'Empty',
    inUseStartDate: null,
    fermentingStartDate: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to create bin:', error);
      setErrors({ submit: 'Failed to create bin. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="e.g., Kitchen Bin"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* State field */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          id="state"
          value={formData.state}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <label htmlFor="inUseStartDate" className="block text-sm font-medium text-gray-700 mb-1">
          In Use Start Date
        </label>
        <input
          type="date"
          id="inUseStartDate"
          value={formatDateForInput(formData.inUseStartDate)}
          onChange={(e) => handleFieldChange('inUseStartDate', e.target.value ? new Date(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSubmitting || formData.state === 'Empty'}
        />
        {formData.state === 'Empty' && (
          <p className="text-xs text-gray-500 mt-1">Cleared when state is Empty</p>
        )}
      </div>

      {/* Fermenting Start Date field */}
      <div>
        <label htmlFor="fermentingStartDate" className="block text-sm font-medium text-gray-700 mb-1">
          Fermenting Start Date
        </label>
        <input
          type="date"
          id="fermentingStartDate"
          value={formatDateForInput(formData.fermentingStartDate)}
          onChange={(e) => handleFieldChange('fermentingStartDate', e.target.value ? new Date(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSubmitting || formData.state === 'Empty'}
        />
        {formData.state === 'Empty' && (
          <p className="text-xs text-gray-500 mt-1">Cleared when state is Empty</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Creating...' : submitLabel}
      </button>

      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}
    </form>
  );
}
