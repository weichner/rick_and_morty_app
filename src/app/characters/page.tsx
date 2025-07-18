"use client";

import { useState } from 'react';
import { useInfiniteCharacters, useIntersectionObserver } from '@/hooks';
import { useFavorites } from '@/contexts/FavoritesContext';
import { CharacterCard } from '@/components/molecules';
import { LoadMoreButton, LoadingSpinner } from '@/components/atoms';
import { Character } from '@/types';

// Note: metadata export doesn't work in client components, so we'll handle SEO differently
export default function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');

  const {
    characters,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    loadMore,
    searchCharacters,
    resetAndReload,
  } = useInfiniteCharacters();
  
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

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
    
    // Build filters object only with non-empty values
    const filters = {
      ...(searchTerm.trim() && { name: searchTerm.trim() }),
      ...(statusFilter && { status: statusFilter as Character['status'] }),
      ...(speciesFilter && { species: speciesFilter }),
    };
    
    // Trigger search with current filters
    searchCharacters(filters);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSpeciesChange = (value: string) => {
    setSpeciesFilter(value);
  };

  const handleFavoriteToggle = (characterId: number) => {
    if (isFavorite(characterId)) {
      removeFavorite(characterId);
    } else {
      addFavorite(characterId);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-danger-red mb-4">
            {error.includes('Rick&Morty universe') ? 'No Characters Found' : 'Error Loading Characters'}
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setSpeciesFilter('');
              resetAndReload();
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {error.includes('Rick&Morty universe') ? 'Back to All Characters' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-dokdo text-5xl font-bold text-[#97CE4C] mb-2">
          Characters
        </h1>
        <p className="text-muted-foreground">
          Discover all characters from the Rick and Morty universe
        </p>
      </div>

      <div className="space-y-6">
        {/* Search and Filters Section */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Search & Filters</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            >
              <option value="">All Status</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
            <select 
              value={speciesFilter}
              onChange={(e) => handleSpeciesChange(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            >
              <option value="">All Species</option>
              <option value="human">Human</option>
              <option value="alien">Alien</option>
              <option value="robot">Robot</option>
              <option value="animal">Animal</option>
            </select>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#97CE4C] text-black rounded-lg hover:bg-[#97CE4C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {/* Clear Filters Button - Repositioned and restyled */}
          {(searchTerm || statusFilter || speciesFilter) && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSpeciesFilter('');
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Characters Grid */}
        {!loading && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={isFavorite(character.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && characters.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">No characters found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More / Infinite Scroll */}
        {!loading && characters.length > 0 && (
          <>
            {/* Intersection observer target for automatic loading */}
            <div ref={loadMoreRef} className="h-4" />
            
            {/* Manual Load More Button */}
            <LoadMoreButton
              onClick={loadMore}
              loading={loadingMore}
              hasMore={hasMore}
              totalLoaded={characters.length}
              totalAvailable={total}
              contentType="characters"
            />
          </>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="py-8">
            <LoadingSpinner size="lg" />
            <p className="text-center text-muted-foreground mt-4">
              Loading more characters...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
