import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CharacterCard } from '../CharacterCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
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
}); 