"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Location, ApiResponse, LocationFilters } from '@/types';
import { fetchLocations } from '@/lib/api';

interface UseInfiniteLocationsReturn {
  locations: Location[];
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
  searchLocations: (filters: LocationFilters) => Promise<void>;
}

export const useInfiniteLocations = (): UseInfiniteLocationsReturn => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<LocationFilters>({});
  const isInitialLoad = useRef(true);

  const loadLocations = useCallback(async (page: number, filters: LocationFilters, isNewSearch: boolean = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const requestFilters = { ...filters, page };
      const response: ApiResponse<Location> = await fetchLocations(requestFilters);

      if (isNewSearch) {
        // For new searches, replace all locations
        setLocations(response.results);
      } else {
        // For load more, append to existing locations
        setLocations(prev => [...prev, ...response.results]);
      }

      setCurrentPage(page);
      setTotalPages(response.info.pages);
      setTotal(response.info.count);
      setHasMore(!!response.info.next);
      setCurrentFilters(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load locations';
      
      if (errorMessage.includes('404')) {
        setError('That location does not exist in the Rick&Morty universe');
        if (isNewSearch) {
          setLocations([]);
        }
      } else {
        setError(errorMessage);
        if (isNewSearch) {
          setLocations([]);
        }
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    await loadLocations(nextPage, currentFilters, false);
  }, [currentPage, currentFilters, hasMore, loadingMore, loadLocations]);

  const searchLocations = useCallback(async (filters: LocationFilters) => {
    await loadLocations(1, filters, true);
  }, [loadLocations]);

  const reset = useCallback(() => {
    setLocations([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotal(0);
    setHasMore(false);
    setCurrentFilters({});
  }, []);

  const resetAndReload = useCallback(async () => {
    reset();
    await loadLocations(1, {}, true);
  }, [reset, loadLocations]);

  // Load initial locations on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      loadLocations(1, {}, true);
    }
  }, [loadLocations]);

  return {
    locations,
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
    searchLocations,
  };
}; 