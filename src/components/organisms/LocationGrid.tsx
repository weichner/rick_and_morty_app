import React from "react";
import { Location } from "@/types";
import { LocationCard } from "@/components/molecules";
import { LoadingSkeleton, ErrorMessage } from "@/components/molecules";

interface LocationGridProps {
  locations: Location[];
  loading?: boolean;
  error?: string | null;
  onViewDetails?: (locationId: number) => void;
}

export const LocationGrid: React.FC<LocationGridProps> = ({
  locations,
  loading = false,
  error = null,
  onViewDetails,
}) => {
  if (error) {
    return (
      <div className="col-span-full">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
          variant="error"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
          >
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="flex gap-2 mb-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-6xl mb-4">🌍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No locations found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

LocationGrid.displayName = "LocationGrid"; 