interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingState({ message, size = 'medium' }: LoadingStateProps) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 modal-fade-in">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-green-600 border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-gray-500 mt-4 text-sm">{message}</p>
      )}
    </div>
  );
}
