import { useState, useEffect } from "react";

import { useFavorites } from "@/contexts/FavoritesContext";
import { fetchMultipleCharacters } from "@/lib/api";
import { Character } from "@/types";

export const useFavoriteCharacters = () => {
  const { favorites } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavoriteCharacters = async () => {
      if (favorites.length === 0) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use fetchMultipleCharacters for better performance
        const characterResults = await fetchMultipleCharacters(favorites);
        setCharacters(characterResults);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load favorite characters"
        );
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteCharacters();
  }, [favorites]);

  const refetch = () => {
    // Trigger a re-fetch by updating the favorites dependency
    // This is automatically handled by the useEffect dependency on favorites
  };

  return {
    characters,
    loading,
    error,
    refetch,
    isEmpty: favorites.length === 0,
    count: favorites.length,
  };
}; 