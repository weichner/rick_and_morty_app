// Rick and Morty API Client
// This module provides a comprehensive interface to the Rick and Morty API
// with proper error handling, type safety, and optimized data fetching patterns

import { CONFIG, getApiUrl } from "./config";
import {
  Character,
  Episode,
  Location,
  ApiResponse,
  CharacterFilters,
  EpisodeFilters,
  LocationFilters,
  ApiError,
} from "@/types";

/**
 * Extracts character ID from a Rick and Morty API character URL
 * 
 * The API returns character references as full URLs (e.g., "https://rickandmortyapi.com/api/character/42")
 * This utility extracts just the numeric ID for easier processing.
 * 
 * @param {string} url - Full character URL from the API
 * @returns {number} Character ID, or 0 if extraction fails
 *
 */
export const extractCharacterIdFromUrl = (url: string): number => {
  const match = url.match(/\/character\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Extracts multiple character IDs from an array of character URLs
 * 
 * Commonly used when processing location residents or episode characters
 * which are provided as arrays of character URLs.
 * 
 * @param {string[]} urls - Array of character URLs
 * @returns {number[]} Array of character IDs (excludes invalid URLs)
 * 
 * 
 */
export const extractCharacterIdsFromUrls = (urls: string[]): number[] => {
  return urls.map(extractCharacterIdFromUrl).filter(id => id > 0);
};

/**
 * Generic API fetcher with comprehensive error handling
 * 
 * This is the core function that handles all HTTP communication with the Rick and Morty API.
 * It provides consistent error handling and response processing across all API endpoints.
 * 
 * Features:
 * - Automatic JSON parsing
 * - HTTP error status handling
 * - TypeScript generic support for response typing
 * - Consistent error message formatting
 * 
 * @template T - The expected response type
 * @param {string} url - Complete API endpoint URL
 * @returns {Promise<T>} Parsed API response
 * @throws {Error} When API request fails or returns non-2xx status
 * 
 */
const apiCall = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);

    // Handle HTTP error status codes
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Parse and return JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw known errors, wrap unknown errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown API error occurred");
  }
};

// =============================================================================
// CHARACTER API FUNCTIONS
// =============================================================================

/**
 * Fetches paginated character data with optional filtering
 * 
 * This is the primary function for loading character lists with support for:
 * - Pagination (page parameter)
 * - Name search
 * - Status filtering (Alive, Dead, unknown)
 * - Species filtering
 * - Gender filtering
 * 
 * @param {CharacterFilters} filters - Optional filter criteria
 * @returns {Promise<ApiResponse<Character>>} Paginated character response
 * 
 * 
 */
export const fetchCharacters = async (
  filters: CharacterFilters = {}
): Promise<ApiResponse<Character>> => {
  const url = getApiUrl(CONFIG.API.ENDPOINTS.CHARACTERS, filters);
  return apiCall<ApiResponse<Character>>(url);
};

/**
 * Fetches a single character by ID
 * 
 * @param {string | number} id - Character ID
 * @returns {Promise<Character>} Character data
 * @throws {Error} If character doesn't exist (404)
 */
export const fetchCharacter = async (
  id: string | number
): Promise<Character> => {
  const url = getApiUrl(`${CONFIG.API.ENDPOINTS.CHARACTERS}/${id}`);
  return apiCall<Character>(url);
};

/**
 * Fetches multiple characters by their IDs in a single API call
 * 
 * This is a performance optimization that allows fetching multiple characters
 * with one request instead of multiple individual requests.
 * The API supports comma-separated IDs for batch fetching.
 * 
 * @param {number[]} ids - Array of character IDs to fetch
 * @returns {Promise<Character[]>} Array of character data
 * 
 * 
 */
export const fetchMultipleCharacters = async (
  ids: number[]
): Promise<Character[]> => {
  if (ids.length === 0) return [];
  
  const url = getApiUrl(`${CONFIG.API.ENDPOINTS.CHARACTERS}/${ids.join(",")}`);
  const result = await apiCall<Character | Character[]>(url);
  
  // API returns single object for one ID, array for multiple IDs
  return Array.isArray(result) ? result : [result];
};

/**
 * Fetches characters by their API URLs (used for location residents)
 * 
 * Locations provide resident data as arrays of character URLs.
 * This function converts those URLs to character IDs and fetches the character data.
 * 
 * @param {string[]} urls - Array of character URLs
 * @returns {Promise<Character[]>} Array of character data
 */
export const fetchCharactersByUrls = async (
  urls: string[]
): Promise<Character[]> => {
  const ids = extractCharacterIdsFromUrls(urls);
  return fetchMultipleCharacters(ids);
};

// =============================================================================
// EPISODE API FUNCTIONS
// =============================================================================

/**
 * Fetches paginated episode data with optional filtering
 * 
 * @param {EpisodeFilters} filters - Optional filter criteria (name, episode code)
 * @returns {Promise<ApiResponse<Episode>>} Paginated episode response
 */
export const fetchEpisodes = async (
  filters: EpisodeFilters = {}
): Promise<ApiResponse<Episode>> => {
  const url = getApiUrl(CONFIG.API.ENDPOINTS.EPISODES, filters);
  return apiCall<ApiResponse<Episode>>(url);
};

/**
 * Fetches a single episode by ID
 * 
 * @param {string | number} id - Episode ID
 * @returns {Promise<Episode>} Episode data
 */
export const fetchEpisode = async (id: string | number): Promise<Episode> => {
  const url = getApiUrl(`${CONFIG.API.ENDPOINTS.EPISODES}/${id}`);
  return apiCall<Episode>(url);
};

/**
 * Fetches episode data using the complete episode URL
 * 
 * Characters contain episode references as full URLs.
 * This function fetches episode data directly from those URLs.
 * 
 * @param {string} episodeUrl - Complete episode URL from character data
 * @returns {Promise<Episode>} Episode data
 */
export const fetchEpisodeByUrl = async (
  episodeUrl: string
): Promise<Episode> => {
  return apiCall<Episode>(episodeUrl);
};

// =============================================================================
// LOCATION API FUNCTIONS
// =============================================================================

/**
 * Fetches paginated location data with optional filtering
 * 
 * @param {LocationFilters} filters - Optional filter criteria
 * @returns {Promise<ApiResponse<Location>>} Paginated location response
 */
export const fetchLocations = async (
  filters: LocationFilters = {}
): Promise<ApiResponse<Location>> => {
  const url = getApiUrl(CONFIG.API.ENDPOINTS.LOCATIONS, filters);
  return apiCall<ApiResponse<Location>>(url);
};

/**
 * Fetches a single location by ID
 * 
 * @param {string | number} id - Location ID
 * @returns {Promise<Location>} Location data
 */
export const fetchLocation = async (id: string | number): Promise<Location> => {
  const url = getApiUrl(`${CONFIG.API.ENDPOINTS.LOCATIONS}/${id}`);
  return apiCall<Location>(url);
};

// =============================================================================
// SEARCH FUNCTIONS
// =============================================================================

/**
 * Searches characters by name with additional filter support
 * 
 * This function provides a simplified search interface that handles the common
 * case where the API returns 404 for "no results" (which we convert to empty array).
 * 
 * @param {string} searchTerm - Character name to search for
 * @param {Omit<CharacterFilters, "name">} additionalFilters - Additional filters to apply
 * @returns {Promise<Character[]>} Array of matching characters (empty if none found)
 */
export const searchCharacters = async (
  searchTerm: string,
  additionalFilters: Omit<CharacterFilters, "name"> = {}
): Promise<Character[]> => {
  try {
    const response = await fetchCharacters({
      name: searchTerm,
      ...additionalFilters,
    });
    return response.results;
  } catch (error) {
    // The API returns 404 when no results are found, which we handle as empty results
    if (error instanceof Error && error.message.includes("404")) {
      return [];
    }
    throw error;
  }
};

/**
 * Searches episodes by name
 * 
 * @param {string} searchTerm - Episode name to search for
 * @returns {Promise<Episode[]>} Array of matching episodes (empty if none found)
 */
export const searchEpisodes = async (
  searchTerm: string
): Promise<Episode[]> => {
  try {
    const response = await fetchEpisodes({ name: searchTerm });
    return response.results;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return [];
    }
    throw error;
  }
};

/**
 * Searches locations by name
 * 
 * @param {string} searchTerm - Location name to search for
 * @returns {Promise<Location[]>} Array of matching locations (empty if none found)
 */
export const searchLocations = async (
  searchTerm: string
): Promise<Location[]> => {
  try {
    const response = await fetchLocations({ name: searchTerm });
    return response.results;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return [];
    }
    throw error;
  }
};
