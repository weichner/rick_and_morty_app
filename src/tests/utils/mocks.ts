import { Character, Episode, Location, ApiResponse } from '../../types/api';

// Mock Character data
export const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "Earth (C-137)",
    url: "/api/location/1"
  },
  location: {
    name: "Citadel of Ricks",
    url: "/api/location/3"
  },
  image: "/mock-images/character-1.jpeg",
  episode: [
    "/api/episode/1",
    "/api/episode/2"
  ],
  url: "/api/character/1",
  created: "2017-11-04T18:48:46.250Z"
};

export const mockCharacter2: Character = {
  id: 2,
  name: "Morty Smith",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: {
    name: "unknown",
    url: ""
  },
  location: {
    name: "Citadel of Ricks",
    url: "/api/location/3"
  },
  image: "/mock-images/character-2.jpeg",
  episode: [
    "/api/episode/1",
    "/api/episode/2"
  ],
  url: "/api/character/2",
  created: "2017-11-04T18:50:21.651Z"
};

// Mock Episode data
export const mockEpisode: Episode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: [
    "/api/character/1",
    "/api/character/2"
  ],
  url: "/api/episode/1",
  created: "2017-11-10T12:56:33.798Z"
};

// Mock Location data
export const mockLocation: Location = {
  id: 1,
  name: "Earth (C-137)",
  type: "Planet",
  dimension: "Dimension C-137",
  residents: [
    "/api/character/38",
    "/api/character/45"
  ],
  url: "/api/location/1",
  created: "2017-11-10T12:42:04.162Z"
};

// Mock API Responses
export const mockCharacterResponse: ApiResponse<Character> = {
  info: {
    count: 826,
    pages: 42,
    next: "/api/character/?page=2",
    prev: null
  },
  results: [mockCharacter, mockCharacter2]
};

export const mockEpisodeResponse: ApiResponse<Episode> = {
  info: {
    count: 51,
    pages: 3,
    next: "/api/episode/?page=2",
    prev: null
  },
  results: [mockEpisode]
};

export const mockLocationResponse: ApiResponse<Location> = {
  info: {
    count: 126,
    pages: 7,
    next: "/api/location/?page=2",
    prev: null
  },
  results: [mockLocation]
};

// Mock API functions
export const mockApi = {
  fetchCharacters: jest.fn(),
  fetchCharacter: jest.fn(),
  fetchEpisodes: jest.fn(),
  fetchEpisode: jest.fn(),
  fetchLocations: jest.fn(),
  fetchLocation: jest.fn(),
};

// Helper to reset all mocks
export const resetMocks = () => {
  Object.values(mockApi).forEach(mock => mock.mockReset());
}; 