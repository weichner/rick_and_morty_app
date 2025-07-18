"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { STORAGE_KEYS } from "@/lib/config";
import { CharacterFilters, EpisodeFilters, LocationFilters } from "@/types";

interface FilterContextType {
  characterFilters: CharacterFilters;
  episodeFilters: EpisodeFilters;
  locationFilters: LocationFilters;
  updateCharacterFilters: (filters: Partial<CharacterFilters>) => void;
  updateEpisodeFilters: (filters: Partial<EpisodeFilters>) => void;
  updateLocationFilters: (filters: Partial<LocationFilters>) => void;
  clearCharacterFilters: () => void;
  clearEpisodeFilters: () => void;
  clearLocationFilters: () => void;
  clearAllFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: React.ReactNode;
}

const defaultCharacterFilters: CharacterFilters = {
  name: "",
  status: undefined,
  species: "",
  type: "",
  gender: undefined,
  page: 1,
};

const defaultEpisodeFilters: EpisodeFilters = {
  name: "",
  episode: "",
  page: 1,
};

const defaultLocationFilters: LocationFilters = {
  name: "",
  type: "",
  dimension: "",
  page: 1,
};

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [characterFilters, setCharacterFilters] = useState<CharacterFilters>(
    defaultCharacterFilters
  );
  const [episodeFilters, setEpisodeFilters] = useState<EpisodeFilters>(
    defaultEpisodeFilters
  );
  const [locationFilters, setLocationFilters] = useState<LocationFilters>(
    defaultLocationFilters
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFilters = localStorage.getItem(STORAGE_KEYS.FILTERS);
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters);
          if (parsedFilters.character) {
            setCharacterFilters({
              ...defaultCharacterFilters,
              ...parsedFilters.character,
            });
          }
          if (parsedFilters.episode) {
            setEpisodeFilters({
              ...defaultEpisodeFilters,
              ...parsedFilters.episode,
            });
          }
          if (parsedFilters.location) {
            setLocationFilters({
              ...defaultLocationFilters,
              ...parsedFilters.location,
            });
          }
        }
      } catch (error) {
        console.error("Error loading filters from localStorage:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        const filtersToSave = {
          character: characterFilters,
          episode: episodeFilters,
          location: locationFilters,
        };
        localStorage.setItem(
          STORAGE_KEYS.FILTERS,
          JSON.stringify(filtersToSave)
        );
      } catch (error) {
        console.error("Error saving filters to localStorage:", error);
      }
    }
  }, [characterFilters, episodeFilters, locationFilters, isLoaded]);

  const updateCharacterFilters = (filters: Partial<CharacterFilters>) => {
    setCharacterFilters((prev) => ({ ...prev, ...filters }));
  };

  const updateEpisodeFilters = (filters: Partial<EpisodeFilters>) => {
    setEpisodeFilters((prev) => ({ ...prev, ...filters }));
  };

  const updateLocationFilters = (filters: Partial<LocationFilters>) => {
    setLocationFilters((prev) => ({ ...prev, ...filters }));
  };

  const clearCharacterFilters = () => {
    setCharacterFilters(defaultCharacterFilters);
  };

  const clearEpisodeFilters = () => {
    setEpisodeFilters(defaultEpisodeFilters);
  };

  const clearLocationFilters = () => {
    setLocationFilters(defaultLocationFilters);
  };

  const clearAllFilters = () => {
    clearCharacterFilters();
    clearEpisodeFilters();
    clearLocationFilters();
  };

  const value: FilterContextType = {
    characterFilters,
    episodeFilters,
    locationFilters,
    updateCharacterFilters,
    updateEpisodeFilters,
    updateLocationFilters,
    clearCharacterFilters,
    clearEpisodeFilters,
    clearLocationFilters,
    clearAllFilters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
