"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { STORAGE_KEYS } from "@/lib/config";

/**
 * Type definition for the Favorites Context value
 * 
 * This interface defines all the functionality available to components
 * that consume the FavoritesContext.
 */
interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

/**
 * Props for the FavoritesProvider component
 */
interface FavoritesProviderProps {
  children: React.ReactNode;
  initialFavorites?: number[];
}

/**
 * React Context for managing user's favorite characters
 * 
 * This context is initialized as undefined to enable proper error handling
 * when the hook is used outside of a provider.
 */
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/**
 * Provider component for the Favorites Context
 * 
 * This component manages the global state of user's favorite characters with:
 * - Automatic persistence to localStorage
 * - Optimistic updates for immediate UI feedback
 * - Error handling for localStorage operations
 * - Support for SSR (checks for window availability)
 * 
 * Key Features:
 * - Persists favorites across browser sessions
 * - Handles localStorage errors gracefully
 * - Prevents hydration issues in Next.js
 * - Optimized state updates with functional setState
 * 
 * @param {FavoritesProviderProps} props - Provider props
 * @returns {JSX.Element} Provider component wrapping children
 * 
 * 
 */
export const FavoritesProvider = ({
  children,
  initialFavorites = [],
}: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Effect: Load favorites from localStorage on component mount
   * 
   * This effect handles:
   * - SSR compatibility (checks for window object)
   * - Error handling for corrupted localStorage data
   * - Type safety for loaded data
   * - Setting the isLoaded flag to enable subsequent saves
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          
          // Validate that loaded data is actually an array
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
          }
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  /**
   * Effect: Save favorites to localStorage whenever favorites change
   * 
   * This effect:
   * - Only runs after initial load to prevent overwriting saved data
   * - Checks for browser environment (SSR safety)
   * - Handles localStorage errors gracefully
   * - Uses JSON serialization for array storage
   */
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      } catch (error) {
        // Handle cases where localStorage is full or disabled
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isLoaded]);

  /**
   * Adds a character to the favorites list
   * 
   * Uses functional state update to ensure we're working with the latest state.
   * Includes duplicate prevention to avoid adding the same character twice.
   * 
   * @param {number} id - Character ID to add to favorites
   */
  const addFavorite = (id: number) => {
    setFavorites((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  /**
   * Removes a character from the favorites list
   * 
   * Uses functional state update and array filter for safe removal.
   * 
   * @param {number} id - Character ID to remove from favorites
   */
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  /**
   * Checks if a character is currently in the favorites list
   * 
   * Provides O(n) lookup time. For large favorite lists, consider
   * using a Set for O(1) lookup, but arrays are simpler for small lists.
   * 
   * @param {number} id - Character ID to check
   * @returns {boolean} True if character is favorited
   */
  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  // Prepare the context value object
  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Custom hook for accessing the Favorites Context
 * 
 * This hook provides a clean interface for components to interact with
 * the favorites system. It includes error handling to ensure the hook
 * is only used within a FavoritesProvider.
 * 
 * @returns {FavoritesContextType} Favorites context value
 * @throws {Error} If used outside of FavoritesProvider
 * 
 * 
 * ```
 */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  
  // Provide helpful error message if hook is used incorrectly
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  
  return context;
};
