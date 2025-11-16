import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-red"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span className="sr-only">Chargement...</span> {/* Screen reader text */}
      </div>
    </div>
  );
};

export default LoadingSpinner;
