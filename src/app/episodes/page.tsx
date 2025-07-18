"use client";

import { useState } from 'react';

import { LoadMoreButton, LoadingSpinner } from '@/components/atoms';
import { LoadingSkeleton } from '@/components/molecules';
import { EpisodeGrid } from '@/components/organisms';
import { useInfiniteEpisodes, useIntersectionObserver } from '@/hooks';

export default function EpisodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [episodeCode, setEpisodeCode] = useState('');

  const {
    episodes,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    loadMore,
    searchEpisodes,
    resetAndReload,
  } = useInfiniteEpisodes();
  
  // Intersection observer for automatic loading
  const loadMoreRef = useIntersectionObserver(
    loadMore,
    {
      threshold: 0.1,
      rootMargin: '0px 0px 200px 0px',
      enabled: hasMore && !loadingMore,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build filters for the search
    const filters = {
      ...(searchTerm.trim() && { name: searchTerm.trim() }),
      ...(episodeCode.trim() && { episode: episodeCode.trim() }),
    };
    
    // Search episodes with filters
    searchEpisodes(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setEpisodeCode('');
    // Reset and reload all episodes
    resetAndReload();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-danger-red mb-4">
            {error.includes('episode does not exist') ? 'No Episodes Found' : 'Error Loading Episodes'}
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setEpisodeCode('');
              resetAndReload();
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {error.includes('episode does not exist') ? 'Back to All Episodes' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-dokdo text-5xl font-bold text-[#97CE4C] mb-2">Episodes</h1>
        <p className="text-muted-foreground">
          Explore all episodes from the Rick and Morty series
        </p>
        {!loading && (
          <p className="text-sm text-muted-foreground mt-2">
            Total: {total} episodes
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Section */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Search Episodes</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search episodes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
            <input
              type="text"
              placeholder="Filter by episode code (e.g., S01E01)..."
              value={episodeCode}
              onChange={(e) => setEpisodeCode(e.target.value)}
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
          
          {/* Clear Filters Button - Repositioned and restyled */}
          {(searchTerm || episodeCode) && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleClearFilters}
                disabled={loading}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Episodes Content */}
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton 
              variant="episode" 
              count={6} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            />
          </div>
        ) : episodes.length > 0 ? (
          <EpisodeGrid 
            episodes={episodes}
            loading={false}
            onEpisodeClick={(episode) => {
              // Future enhancement: navigate to episode detail page
              console.warn("Episode clicked:", episode.name);
            }}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📺</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Episodes Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or clear the filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More / Infinite Scroll */}
        {!loading && episodes.length > 0 && (
          <>
            {/* Intersection observer target for automatic loading */}
            <div ref={loadMoreRef} className="h-4" />
            
            {/* Manual Load More Button */}
            <LoadMoreButton
              onClick={loadMore}
              loading={loadingMore}
              hasMore={hasMore}
              totalLoaded={episodes.length}
              totalAvailable={total}
              contentType="episodes"
            />
          </>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="py-8">
            <LoadingSpinner size="lg" />
            <p className="text-center text-muted-foreground mt-4">
              Loading more episodes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
