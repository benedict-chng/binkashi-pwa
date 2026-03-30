import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center modal-scale-in">
      {icon && (
        <div className="mb-6 text-6xl transition-transform duration-300 ease-in-out hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
      <p className="text-dim-grey mb-6 max-w-sm">{message}</p>
      {action && <div className="modal-fade-in">{action}</div>}
    </div>
  );
}
