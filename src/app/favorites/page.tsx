"use client";

import { useState } from "react";
import { useFavoriteCharacters } from "@/hooks";
import { useFavorites } from "@/contexts/FavoritesContext";
import { CharacterCard } from "@/components/molecules";
import { LoadingSkeleton, ErrorMessage } from "@/components/molecules";
import { Character } from "@/types";

type SortOption = "name" | "species" | "status" | "origin";

export default function FavoritesPage() {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const { characters, loading, error, isEmpty, count } = useFavoriteCharacters();
  const { clearFavorites, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteToggle = (characterId: number) => {
    removeFavorite(characterId);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      clearFavorites();
    }
  };

  // Sort characters based on selected option
  const sortedCharacters = [...characters].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "species":
        return a.species.localeCompare(b.species);
      case "status":
        return a.status.localeCompare(b.status);
      case "origin":
        return a.origin.name.localeCompare(b.origin.name);
      default:
        return 0;
    }
  });

  // Filter characters by status if filter is selected
  const filteredCharacters = statusFilter
    ? sortedCharacters.filter((character) => character.status === statusFilter)
    : sortedCharacters;

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-muted-foreground">Loading your favorite characters...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <LoadingSkeleton variant="character" count={8} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            Your favorite characters from the Rick and Morty universe
          </p>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            Your favorite characters from the Rick and Morty universe
          </p>
        </div>

        <div className="text-center py-16">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <span className="text-4xl">❤️</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring characters and add them to your favorites to see them here!
          </p>
          <a
            href="/characters"
            className="inline-flex px-6 py-3 bg-[#97CE4C] text-black rounded-lg hover:bg-[#97CE4C]/90 transition-colors"
          >
            Browse Characters
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-dokdo text-5xl font-bold text-[#97CE4C] mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          Your favorite characters from the Rick and Morty universe
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-foreground font-medium">
              {filteredCharacters.length} of {count} favorites
              {statusFilter && ` (filtered by ${statusFilter})`}
            </span>
            <button 
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
              disabled={count === 0}
            >
              Clear all
            </button>
          </div>

          <div className="flex gap-4">
            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm"
            >
              <option value="">All Status</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>

            {/* Sort Options */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="species">Sort by Species</option>
              <option value="status">Sort by Status</option>
              <option value="origin">Sort by Origin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isFavorite={isFavorite(character.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">No characters match your filter</h3>
          <p className="text-muted-foreground mb-4">
            Try changing the status filter to see more characters.
          </p>
          <button
            onClick={() => setStatusFilter("")}
            className="px-4 py-2 bg-[#97CE4C] text-black rounded-lg hover:bg-[#97CE4C]/90 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
