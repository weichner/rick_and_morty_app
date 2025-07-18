"use client";

import { useState } from "react";

import { LoadMoreButton, LoadingSpinner } from "@/components/atoms";
import { LocationGrid } from "@/components/organisms";
import { useInfiniteLocations, useIntersectionObserver } from "@/hooks";
import { LocationFilters } from "@/types";

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState("");

  const {
    locations,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    loadMore,
    searchLocations,
    resetAndReload,
  } = useInfiniteLocations();
  
  // Intersection observer for automatic loading
  const loadMoreRef = useIntersectionObserver(
    loadMore,
    {
      threshold: 0.1,
      rootMargin: '0px 0px 200px 0px',
      enabled: hasMore && !loadingMore,
    }
  );

  // Helper function to create current filters
  const getCurrentFilters = (): LocationFilters => {
    const filters: LocationFilters = {};
    if (searchTerm.trim()) filters.name = searchTerm.trim();
    if (typeFilter.trim()) filters.type = typeFilter.trim();
    if (dimensionFilter.trim()) filters.dimension = dimensionFilter.trim();
    return filters;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocations(getCurrentFilters());
  };

  const handleViewDetails = (locationId: number) => {
    console.warn("View details for location:", locationId);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-danger-red mb-4">
            {error.includes('Rick&Morty universe') ? 'No Locations Found' : 'Error Loading Locations'}
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              setDimensionFilter('');
              resetAndReload();
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {error.includes('Rick&Morty universe') ? 'Back to All Locations' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-dokdo text-5xl font-bold text-[#97CE4C] mb-2">Locations</h1>
        <p className="text-muted-foreground">
          Discover all the dimensions and planets in the Rick and Morty
          multiverse
        </p>
        {total > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {total} locations found
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Search and Filters Section */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Search & Filters</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
            <input
              type="text"
              placeholder="Filter by type (e.g., Planet, Cluster)..."
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
            <input
              type="text"
              placeholder="Filter by dimension..."
              value={dimensionFilter}
              onChange={(e) => setDimensionFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#97CE4C] text-black rounded-lg hover:bg-[#97CE4C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {/* Clear Filters Button */}
          {(searchTerm || typeFilter || dimensionFilter) && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                  setDimensionFilter('');
                  resetAndReload();
                }}
                disabled={loading}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Locations Grid */}
        <LocationGrid
          locations={locations}
          loading={loading}
          error={error && !error.includes('Rick&Morty universe') ? error : null}
          onViewDetails={handleViewDetails}
        />

        {/* Load More / Infinite Scroll */}
        {!loading && !error && locations.length > 0 && (
          <>
            {/* Intersection observer target for automatic loading */}
            <div ref={loadMoreRef} className="h-4" />
            
            {/* Manual Load More Button */}
            <LoadMoreButton
              onClick={loadMore}
              loading={loadingMore}
              hasMore={hasMore}
              totalLoaded={locations.length}
              totalAvailable={total}
              contentType="locations"
            />
          </>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="py-8">
            <LoadingSpinner size="lg" />
            <p className="text-center text-muted-foreground mt-4">
              Loading more locations...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
