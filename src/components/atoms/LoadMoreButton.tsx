import React from 'react';

import { LoadingSpinner } from './LoadingSpinner';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
  totalLoaded?: number;
  totalAvailable?: number;
  className?: string;
  contentType?: 'characters' | 'episodes' | 'locations';
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  hasMore = true,
  totalLoaded,
  totalAvailable,
  className = '',
  contentType = 'characters',
}) => {
  if (!hasMore) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">
          {totalLoaded && totalAvailable ? (
            <>Showing all {totalLoaded} of {totalAvailable} {contentType}</>
          ) : (
            `No more ${contentType} to load`
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="px-8 py-3 bg-[#97CE4C] text-black rounded-lg hover:bg-[#97CE4C]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[160px]"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Loading...</span>
          </div>
        ) : (
          `Load More ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`
        )}
      </button>
      
      {totalLoaded && totalAvailable && (
        <p className="text-sm text-muted-foreground mt-2">
          Showing {totalLoaded} of {totalAvailable} {contentType}
        </p>
      )}
    </div>
  );
}; 