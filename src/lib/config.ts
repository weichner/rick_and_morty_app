// Application Configuration

export const CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    ENDPOINTS: {
      CHARACTERS: "/character",
      EPISODES: "/episode",
      LOCATIONS: "/location",
    },
  },
  APP: {
    NAME: "Rick and Morty Explorer",
    VERSION: "1.0.0",
  },
  FEATURES: {
    ENABLE_FAVORITES: true,
    ENABLE_SEARCH: true,
    ENABLE_FILTERS: true,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 50,
  },
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    FAVORITES_KEY: "rick-morty-favorites",
    FILTERS_KEY: "rick-morty-filters",
  },
} as const;

// API Endpoints helper functions
export const getApiUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>) => {
  const url = new URL(`${CONFIG.API.BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
};

// Local storage keys
export const STORAGE_KEYS = {
  FAVORITES: CONFIG.CACHE.FAVORITES_KEY,
  FILTERS: CONFIG.CACHE.FILTERS_KEY,
  THEME: "rick-morty-theme",
} as const;
