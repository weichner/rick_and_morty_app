import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { FavoriteButton } from '../FavoriteButton';

describe('FavoriteButton', () => {
  const defaultProps = {
    isFavorite: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when not favorite', () => {
    render(<FavoriteButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add to Favorites');
    expect(button).toHaveTextContent('🤍');
  });

  it('renders correctly when favorite', () => {
    render(<FavoriteButton {...defaultProps} isFavorite={true} />);
    
    const button = screen.getByRole('button', { name: /remove from favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Remove from Favorites');
    expect(button).toHaveTextContent('❤️');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<FavoriteButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(button);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<FavoriteButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled and clicked', async () => {
    const user = userEvent.setup();
    render(<FavoriteButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(button);
    
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<FavoriteButton {...defaultProps} size="sm" />);
    let button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toHaveClass('px-2', 'py-1', 'text-sm');

    rerender(<FavoriteButton {...defaultProps} size="lg" />);
    button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('has proper accessibility attributes', () => {
    render(<FavoriteButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toHaveAttribute('aria-label', 'Add to favorites');

    // Test when favorite
    render(<FavoriteButton {...defaultProps} isFavorite={true} />);
    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });
}); 