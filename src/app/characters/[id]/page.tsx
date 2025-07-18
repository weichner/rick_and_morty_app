"use client";

import { use } from "react";
import { useCharacterDetails } from "@/hooks";
import { useFavorites } from "@/contexts/FavoritesContext";
import { CharacterHeader, EpisodeGrid } from "@/components/organisms";
import { LoadingSkeleton, ErrorMessage } from "@/components/molecules";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  // Hooks for data and state management
  const { character, episodes, loading, error, refetch } = useCharacterDetails(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleFavoriteToggle = () => {
    if (!character) return;
    
    if (isFavorite(character.id)) {
      removeFavorite(character.id);
    } else {
      addFavorite(character.id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton variant="character" />
          <div className="mt-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-6 bg-muted rounded animate-pulse mb-4"></div>
              <LoadingSkeleton 
                variant="episode" 
                count={6} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage 
            message={error} 
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  // Character not found
  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage 
            message={`Character with ID ${id} not found.`}
            variant="warning"
          />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Character Header */}
        <CharacterHeader
          character={character}
          isFavorite={isFavorite(character.id)}
          onFavoriteToggle={handleFavoriteToggle}
        />

        {/* Episodes Section */}
        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          <EpisodeGrid
            episodes={episodes}
            loading={false}
            onEpisodeClick={(episode) => {
              // Future enhancement: navigate to episode detail page
              console.log("Episode clicked:", episode.name);
            }}
          />
        </div>
      </div>
    </div>
  );
}
