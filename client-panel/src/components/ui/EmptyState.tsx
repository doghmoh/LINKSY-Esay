import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Icon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#DC0032] hover:bg-[#c40029] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC0032]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;