"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

import { fetchEpisodes } from '@/lib/api';
import { Episode, ApiResponse, EpisodeFilters } from '@/types';

interface UseInfiniteEpisodesReturn {
  episodes: Episode[];
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
  searchEpisodes: (filters: EpisodeFilters) => Promise<void>;
}

export const useInfiniteEpisodes = (): UseInfiniteEpisodesReturn => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<EpisodeFilters>({});
  const isInitialLoad = useRef(true);

  const loadEpisodes = useCallback(async (page: number, filters: EpisodeFilters, isNewSearch: boolean = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const requestFilters = { ...filters, page };
      const response: ApiResponse<Episode> = await fetchEpisodes(requestFilters);

      if (isNewSearch) {
        // For new searches, replace all episodes
        setEpisodes(response.results);
      } else {
        // For load more, append to existing episodes
        setEpisodes(prev => [...prev, ...response.results]);
      }

      setCurrentPage(page);
      setTotalPages(response.info.pages);
      setTotal(response.info.count);
      setHasMore(!!response.info.next);
      setCurrentFilters(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load episodes';
      
      if (errorMessage.includes('404')) {
        setError('The episode does not exist');
        if (isNewSearch) {
          setEpisodes([]);
        }
      } else {
        setError(errorMessage);
        if (isNewSearch) {
          setEpisodes([]);
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
    await loadEpisodes(nextPage, currentFilters, false);
  }, [currentPage, currentFilters, hasMore, loadingMore, loadEpisodes]);

  const searchEpisodes = useCallback(async (filters: EpisodeFilters) => {
    await loadEpisodes(1, filters, true);
  }, [loadEpisodes]);

  const reset = useCallback(() => {
    setEpisodes([]);
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
    await loadEpisodes(1, {}, true);
  }, [reset, loadEpisodes]);

  // Load initial episodes on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      loadEpisodes(1, {}, true);
    }
  }, [loadEpisodes]);

  return {
    episodes,
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
    searchEpisodes,
  };
}; 