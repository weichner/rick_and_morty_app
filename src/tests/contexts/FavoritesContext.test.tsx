import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';

import { FavoritesProvider, useFavorites } from '../../contexts/FavoritesContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the context
const TestComponent = () => {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount,
  } = useFavorites();

  return (
    <div>
      <span data-testid="favorites-count">{favoritesCount}</span>
      <span data-testid="favorites-list">{favorites.join(',')}</span>
      <button onClick={() => addFavorite(1)}>Add 1</button>
      <button onClick={() => addFavorite(2)}>Add 2</button>
      <button onClick={() => removeFavorite(1)}>Remove 1</button>
      <button onClick={clearFavorites}>Clear All</button>
      <span data-testid="is-favorite-1">{isFavorite(1).toString()}</span>
      <span data-testid="is-favorite-2">{isFavorite(2).toString()}</span>
    </div>
  );
};

const TestComponentWithoutProvider = () => {
  const favorites = useFavorites();
  return <div>{favorites.favoritesCount}</div>;
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('provides initial empty favorites', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
  });

  it('can add favorites', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    await user.click(screen.getByText('Add 1'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('1');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
  });

  it('can remove favorites', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    await user.click(screen.getByText('Add 1'));
    await user.click(screen.getByText('Add 2'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    
    await user.click(screen.getByText('Remove 1'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('2');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true');
  });

  it('can clear all favorites', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    await user.click(screen.getByText('Add 1'));
    await user.click(screen.getByText('Add 2'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    
    await user.click(screen.getByText('Clear All'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('');
  });

  it('does not add duplicate favorites', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    await user.click(screen.getByText('Add 1'));
    await user.click(screen.getByText('Add 1'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('1');
  });

  it('loads favorites from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([1, 2, 3]));
    
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('rick-morty-favorites');
  });

  it('saves favorites to localStorage when favorites change', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    await user.click(screen.getByText('Add 1'));

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'rick-morty-favorites',
      JSON.stringify([1])
    );
  });

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading favorites from localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('throws error when useFavorites is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useFavorites must be used within a FavoritesProvider');

    consoleSpy.mockRestore();
  });

  it('accepts initial favorites', () => {
    render(
      <FavoritesProvider initialFavorites={[1, 2]}>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('1,2');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true');
  });
}); 