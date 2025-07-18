"use client";

import { useState, useEffect, useCallback } from "react";

import { fetchCharacter, fetchEpisodeByUrl } from "@/lib/api";
import { Character, Episode } from "@/types";

/**
 * Return type for the useCharacterDetails hook
 */
interface UseCharacterDetailsReturn {
  character: Character | null;
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching detailed character information with associated episodes
 * 
 * This hook implements a complex data fetching pattern that:
 * 1. Fetches character data by ID
 * 2. Extracts episode URLs from character data
 * 3. Fetches detailed episode information for each episode
 * 4. Handles loading and error states throughout the process
 * 
 * Key Features:
 * - Automatic data fetching when characterId changes
 * - Parallel episode fetching for optimal performance
 * - Comprehensive error handling with user-friendly messages
 * - Manual refetch capability for error recovery
 * - Proper cleanup of state on new requests
 * 
 * Performance Considerations:
 * - Uses Promise.all for parallel episode fetching
 * - Only fetches episodes if character has episode data
 * - Clears previous data before starting new requests
 * 
 * @param {string} characterId - The ID of the character to fetch details for
 * @returns {UseCharacterDetailsReturn} Object containing character data, episodes, and control functions
 * 
 *
 */
export const useCharacterDetails = (characterId: string): UseCharacterDetailsReturn => {
  // State for character data
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Core function that fetches character data and associated episodes
   * 
   * This function implements a complex data fetching workflow:
   * 
   * 1. **Character Fetch**: First fetches the character data by ID
   * 2. **Episode URL Extraction**: Extracts episode URLs from character.episode array
   * 3. **Parallel Episode Fetching**: Uses Promise.all to fetch all episodes simultaneously
   * 4. **State Updates**: Updates character and episodes state with fetched data
   * 5. **Error Handling**: Provides specific error messages and proper cleanup
   * 
   * The function handles several edge cases:
   * - Characters with no episodes
   * - Network failures during character or episode fetching
   * - Invalid character IDs (404 errors)
   * 
   * @async
   * @function fetchCharacterDetails
   */
  const fetchCharacterDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch character data
      const characterData = await fetchCharacter(characterId);
      setCharacter(characterData);

      // Fetch all episodes this character appears in
      if (characterData.episode && characterData.episode.length > 0) {
        // Create array of promises for parallel episode fetching
        // This is much faster than fetching episodes sequentially
        const episodePromises = characterData.episode.map((episodeUrl) =>
          fetchEpisodeByUrl(episodeUrl)
        );
        const episodeData = await Promise.all(episodePromises);
        setEpisodes(episodeData);
      } else {
        setEpisodes([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load character details";
      setError(errorMessage);
      setCharacter(null);
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  /**
   * Public refetch function for manual data reload
   * 
   * This function allows components to manually trigger a refetch,
   * useful for error recovery or refresh functionality.
   * 
   * @async
   * @function refetch
   */
  const refetch = async () => {
    await fetchCharacterDetails();
  };

  /**
   * Effect: Automatically fetch character details when characterId changes
   * 
   * This effect:
   * - Triggers when the component mounts
   * - Re-triggers when characterId changes (for navigation between characters)
   * - Only runs when characterId is provided (prevents unnecessary API calls)
   * 
   * The dependency array includes characterId to ensure refetching
   * when navigating between different character detail pages.
   */
  useEffect(() => {
    if (characterId) {
      fetchCharacterDetails();
    }
  }, [characterId, fetchCharacterDetails]); // Re-run when characterId changes

  return {
    character,
    episodes,
    loading,
    error,
    refetch,
  };
}; 