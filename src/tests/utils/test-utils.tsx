// Testing utilities for component testing
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Simple custom render for testing without complex providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any future provider props here
  initialProps?: Record<string, unknown>;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, options);
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

// Mock data for testing
export const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: {
    id: 1,
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: [],
    url: 'https://rickandmortyapi.com/api/location/1',
    created: '2017-11-10T12:42:04.162Z',
  },
  location: {
    id: 3,
    name: 'Citadel of Ricks',
    type: 'Space station',
    dimension: 'unknown',
    residents: [],
    url: 'https://rickandmortyapi.com/api/location/3',
    created: '2017-11-10T13:08:13.191Z',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

export const mockEpisode = {
  id: 1,
  name: 'Pilot',
  air_date: 'December 2, 2013',
  episode: 'S01E01',
  characters: [
    'https://rickandmortyapi.com/api/character/1',
    'https://rickandmortyapi.com/api/character/2',
  ],
  url: 'https://rickandmortyapi.com/api/episode/1',
  created: '2017-11-10T12:56:33.798Z',
};

export const mockLocation = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: [
    'https://rickandmortyapi.com/api/character/38',
    'https://rickandmortyapi.com/api/character/45',
  ],
  url: 'https://rickandmortyapi.com/api/location/1',
  created: '2017-11-10T12:42:04.162Z',
};

export const mockApiResponse = {
  info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null,
  },
  results: [mockCharacter],
};

// Helper functions for testing
export const createMockFetch = (data: unknown) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
};

export const createMockFetchError = (errorMessage: string) => {
  return jest.fn().mockRejectedValue(new Error(errorMessage));
}; 