import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { CharacterCard } from '../CharacterCard';

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockCharacter = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive" as const,
  species: "Human",
  type: "",
  gender: "Male" as const,
  origin: {
    name: "Earth (C-137)",
    url: "https://rickandmortyapi.com/api/location/1"
  },
  location: {
    name: "Citadel of Ricks",
    url: "https://rickandmortyapi.com/api/location/3"
  },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ],
  url: "https://rickandmortyapi.com/api/character/1",
  created: "2017-11-04T18:48:46.250Z"
};

describe('CharacterCard', () => {
  const defaultProps = {
    character: mockCharacter,
    isFavorite: false,
    onFavoriteToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders character information correctly', () => {
    render(<CharacterCard {...defaultProps} />);
    
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.species)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.status)).toBeInTheDocument();
  });

  it('renders character image with correct alt text', () => {
    render(<CharacterCard {...defaultProps} />);
    
    // Get all images since there are two due to flip card design
    const images = screen.getAllByRole('img', { name: mockCharacter.name });
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('alt', mockCharacter.name);
  });

  it('renders link to character detail page', () => {
    render(<CharacterCard {...defaultProps} />);
    
    // Get all links since there are two due to flip card design
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', `/characters/${mockCharacter.id}`);
  });

  it('calls onFavoriteToggle when favorite button is clicked', async () => {
    const user = userEvent.setup();
    render(<CharacterCard {...defaultProps} />);
    
    // Get all favorite buttons (there are two due to flip card design)
    const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButtons[0]);
    
    expect(defaultProps.onFavoriteToggle).toHaveBeenCalledWith(mockCharacter.id);
  });

  it('shows correct favorite state when isFavorite is true', () => {
    render(<CharacterCard {...defaultProps} isFavorite={true} />);
    
    // Check that at least one favorite button exists in remove state
    const favoriteButtons = screen.getAllByRole('button', { name: /remove from favorites/i });
    expect(favoriteButtons.length).toBeGreaterThan(0);
    expect(favoriteButtons[0]).toHaveTextContent('❤️');
  });

  it('shows correct favorite state when isFavorite is false', () => {
    render(<CharacterCard {...defaultProps} isFavorite={false} />);
    
    // Check that at least one favorite button exists in add state
    const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i });
    expect(favoriteButtons.length).toBeGreaterThan(0);
    expect(favoriteButtons[0]).toHaveTextContent('🤍');
  });

  it('prevents event propagation when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const mockClickHandler = jest.fn();
    
    render(
      <div onClick={mockClickHandler}>
        <CharacterCard {...defaultProps} />
      </div>
    );
    
    const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButtons[0]);
    
    expect(defaultProps.onFavoriteToggle).toHaveBeenCalledWith(mockCharacter.id);
    expect(mockClickHandler).not.toHaveBeenCalled();
  });

  describe('Desktop (non-touch) functionality', () => {
    beforeEach(() => {
      // Mock non-touch device
      delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 0,
      });
    });

    it('uses hover CSS classes for non-touch devices', () => {
      render(<CharacterCard {...defaultProps} />);
      
      const cardContainer = screen.getByText(mockCharacter.name).closest('.perspective-1000');
      expect(cardContainer).toBeInTheDocument();
      
      if (cardContainer) {
        // Should not have touch-device class
        expect(cardContainer).not.toHaveClass('touch-device');
        
        // Should have hover class for desktop
        const flipContainer = cardContainer.querySelector('.preserve-3d');
        expect(flipContainer).toHaveClass('group-hover:rotate-y-180');
        expect(flipContainer).not.toHaveClass('rotate-y-180');
      }
    });

    it('shows desktop text in back side', () => {
      render(<CharacterCard {...defaultProps} />);
      
      expect(screen.getByText('Click to view more details')).toBeInTheDocument();
    });

    it('does not respond to touch events on non-touch devices', () => {
      render(<CharacterCard {...defaultProps} />);
      
      const cardContainer = screen.getByText(mockCharacter.name).closest('.perspective-1000');
      
      if (cardContainer) {
        const flipContainer = cardContainer.querySelector('.preserve-3d');
        
        // Touch events should not affect the flip state on non-touch devices
        act(() => {
          fireEvent.touchStart(cardContainer);
        });
        
        // Should still only have hover class, not manual flip
        expect(flipContainer).toHaveClass('group-hover:rotate-y-180');
        expect(flipContainer).not.toHaveClass('rotate-y-180');
      }
    });
  });

  describe('Touch device functionality', () => {
    beforeEach(() => {
      // Mock touch device detection
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        value: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 5,
      });
    });

    afterEach(() => {
      // Clean up mocks
      delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 0,
      });
    });

    it('detects touch device and applies touch-device class', () => {
      render(<CharacterCard {...defaultProps} />);
      
      // Check that the card container has the touch-device class
      const cardContainer = screen.getByText(mockCharacter.name).closest('.touch-device');
      expect(cardContainer).toBeInTheDocument();
    });

    it('handles touch start to show flip and touch end to hide flip (hover-like behavior)', async () => {
      jest.useFakeTimers();
      
      render(<CharacterCard {...defaultProps} />);
      
      const cardContainer = screen.getByText(mockCharacter.name).closest('.perspective-1000');
      expect(cardContainer).toBeInTheDocument();
      
      if (cardContainer) {
        // Initial state should not have flip class
        const flipContainer = cardContainer.querySelector('.preserve-3d');
        expect(flipContainer).not.toHaveClass('rotate-y-180');
        
        // Touch start should show flip (like hover start)
        act(() => {
          fireEvent.touchStart(cardContainer);
        });
        expect(flipContainer).toHaveClass('rotate-y-180');
        
        // Touch end should hide flip after delay (like hover end)
        act(() => {
          fireEvent.touchEnd(cardContainer);
        });
        
        // The flip should still be visible before the timeout
        expect(flipContainer).toHaveClass('rotate-y-180');
        
        // Fast-forward the timeout
        act(() => {
          jest.advanceTimersByTime(150);
        });
        
        expect(flipContainer).not.toHaveClass('rotate-y-180');
      }
      
      jest.useRealTimers();
    });

    it('handles touch cancel to hide flip immediately', () => {
      render(<CharacterCard {...defaultProps} />);
      
      const cardContainer = screen.getByText(mockCharacter.name).closest('.perspective-1000');
      
      if (cardContainer) {
        const flipContainer = cardContainer.querySelector('.preserve-3d');
        
        // Touch start should show flip
        act(() => {
          fireEvent.touchStart(cardContainer);
        });
        expect(flipContainer).toHaveClass('rotate-y-180');
        
        // Touch cancel should hide flip immediately
        act(() => {
          fireEvent.touchCancel(cardContainer);
        });
        expect(flipContainer).not.toHaveClass('rotate-y-180');
      }
    });

    it('shows correct text for touch devices in back side', () => {
      render(<CharacterCard {...defaultProps} />);
      
      expect(screen.getByText('Tap to view details')).toBeInTheDocument();
    });

    it('allows normal navigation on tap without preventing default', () => {
      render(<CharacterCard {...defaultProps} />);
      
      const cardContainer = screen.getByText(mockCharacter.name).closest('.perspective-1000');
      const link = screen.getAllByRole('link')[0];
      
      // Links should work normally - no preventDefault behavior
      expect(cardContainer).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/characters/${mockCharacter.id}`);
    });

    it('handles favorite button touch events correctly', () => {
      render(<CharacterCard {...defaultProps} />);
      
      const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i });
      
      // Simulate touch end event  
      fireEvent.touchEnd(favoriteButtons[0]);
      
      expect(defaultProps.onFavoriteToggle).toHaveBeenCalledWith(mockCharacter.id);
    });
  });
}); 