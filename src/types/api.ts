// Rick and Morty API Type Definitions

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse<T> {
  info: Info;
  results: T[];
}

// Location reference type (used in origin and location)
export interface LocationRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: LocationRef;
  location: LocationRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

// Filter interfaces
export interface CharacterFilters {
  name?: string;
  status?: Character["status"];
  species?: string;
  type?: string;
  gender?: Character["gender"];
  page?: number;
}

export interface EpisodeFilters {
  name?: string;
  episode?: string;
  page?: number;
}

export interface LocationFilters {
  name?: string;
  type?: string;
  dimension?: string;
  page?: number;
}

// API Error interface
export interface ApiError {
  error: string;
  message?: string;
}
