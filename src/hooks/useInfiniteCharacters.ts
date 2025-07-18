"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Character, ApiResponse, CharacterFilters } from '@/types';
import { fetchCharacters } from '@/lib/api';

/**
 * Return type for the useInfiniteCharacters hook
 * Contains all necessary state and functions for managing infinite character loading
 */
interface UseInfiniteCharactersReturn {
  characters: Character[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  loadMore: () => Promise<void>;
  reset: () => void;
  resetAndReload: () => Promise<void>;
  searchCharacters: (filters: CharacterFilters) => Promise<void>;
}

/**
 * Custom hook for managing infinite loading of Rick and Morty characters
 * 
 * This hook implements a sophisticated infinite scroll pattern that handles:
 * - Progressive loading of character pages
 * - Search functionality with dynamic filtering
 * - State management for loading, error, and pagination states
 * - Optimized re-renders using useCallback and useRef
 * 
 * Key Features:
 * - Automatic initial load on mount
 * - Support for search filters (name, status, species, gender)
 * - Separate loading states for initial load vs. "load more"
 * - Graceful error handling with user-friendly messages
 * - Memory-efficient pagination tracking
 * 
 * @returns {UseInfiniteCharactersReturn} Object containing characters data and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   characters,
 *   loading,
 *   loadMore,
 *   searchCharacters,
 *   hasMore
 * } = useInfiniteCharacters();
 * 
 * // Search for characters
 * searchCharacters({ name: "Rick", status: "Alive" });
 * 
 * // Load more characters (typically called by intersection observer)
 * loadMore();
 * ```
 */
export const useInfiniteCharacters = (): UseInfiniteCharactersReturn => {
  // Character data and pagination state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false); // Initial loading state
  const [loadingMore, setLoadingMore] = useState(false); // Loading more items state
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Current active filters - stored to enable "load more" functionality
  const [currentFilters, setCurrentFilters] = useState<CharacterFilters>({});
  
  // Ref to prevent multiple initial loads on mount
  const isInitialLoad = useRef(true);

  /**
   * Core function that handles all character loading logic
   * 
   * This function is the heart of the infinite scroll implementation.
   * It handles both initial searches and progressive loading of additional pages.
   * 
   * @param {number} page - The page number to load (1-based)
   * @param {CharacterFilters} filters - Filter criteria for the API call
   * @param {boolean} isNewSearch - Whether this is a new search (replaces data) or load more (appends data)
   */
  const loadCharacters = useCallback(async (page: number, filters: CharacterFilters, isNewSearch: boolean = false) => {
    try {
      // Set appropriate loading state based on operation type
      if (isNewSearch) {
        setLoading(true); // Show main loading spinner for new searches
      } else {
        setLoadingMore(true); // Show "loading more" indicator for pagination
      }
      setError(null);

      // Prepare API request with pagination
      const requestFilters = { ...filters, page };
      const response: ApiResponse<Character> = await fetchCharacters(requestFilters);

      if (isNewSearch) {
        // For new searches, replace all characters with fresh results
        setCharacters(response.results);
      } else {
        // For load more operations, append new characters to existing array
        setCharacters(prev => [...prev, ...response.results]);
      }

      // Update pagination metadata from API response
      setCurrentPage(page);
      setTotalPages(response.info.pages);
      setTotal(response.info.count);
      setHasMore(!!response.info.next); // API provides null when no more pages
      setCurrentFilters(filters); // Store filters for subsequent "load more" calls
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load characters';
      
      // Handle specific API error cases with user-friendly messages
      if (errorMessage.includes('404')) {
        setError('That character does not exist in the Rick&Morty universe');
        if (isNewSearch) {
          setCharacters([]); // Clear results for failed searches
        }
              } else {
          setError(errorMessage);
          if (isNewSearch) {
            setCharacters([]); // Clear results for failed searches
          }
        }
    } finally {
      // Always reset loading states regardless of success/failure
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  /**
   * Loads the next page of characters using current filters
   * 
   * This function is typically called by an intersection observer
   * when the user scrolls near the bottom of the character list.
   * It includes safety checks to prevent duplicate requests.
   */
  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous requests and respect pagination limits
    if (loadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    await loadCharacters(nextPage, currentFilters, false);
  }, [currentPage, currentFilters, hasMore, loadingMore, loadCharacters]);

  /**
   * Initiates a new character search with the provided filters
   * 
   * This resets pagination and replaces the current character list
   * with results matching the new search criteria.
   * 
   * @param {CharacterFilters} filters - Search filters (name, status, species, etc.)
   */
  const searchCharacters = useCallback(async (filters: CharacterFilters) => {
    await loadCharacters(1, filters, true);
  }, [loadCharacters]);

  /**
   * Resets all state to initial values
   * 
   * Useful for clearing search results or handling navigation changes
   */
  const reset = useCallback(() => {
    setCharacters([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotal(0);
    setHasMore(false);
    setCurrentFilters({});
  }, []);

  /**
   * Resets state and immediately loads the first page with no filters
   * 
   * Useful for "clear all filters" functionality or returning to default state
   */
  const resetAndReload = useCallback(async () => {
    reset();
    await loadCharacters(1, {}, true);
  }, [reset, loadCharacters]);

  /**
   * Effect: Load initial characters on component mount
   * 
   * Uses a ref to ensure this only runs once, even in React's StrictMode
   * which can cause effects to run twice in development.
   */
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      loadCharacters(1, {}, true);
    }
  }, [loadCharacters]);

  return {
    characters,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    totalPages,
    total,
    loadMore,
    reset,
    resetAndReload,
    searchCharacters,
  };
}; 