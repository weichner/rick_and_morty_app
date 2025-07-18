import '@testing-library/jest-dom';

// Simple utility functions for testing
export const formatCharacterName = (name: string): string => {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'text-green-600 bg-green-100';
    case 'dead':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

describe('Utility Functions', () => {
  describe('formatCharacterName', () => {
    it('should format name correctly', () => {
      expect(formatCharacterName('Rick Sanchez')).toBe('rick-sanchez');
      expect(formatCharacterName('  Morty  Smith  ')).toBe('morty-smith');
      expect(formatCharacterName('Summer')).toBe('summer');
    });

    it('should handle empty strings', () => {
      expect(formatCharacterName('')).toBe('');
      expect(formatCharacterName('   ')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('rick@rick-and-morty.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('getStatusColor', () => {
    it('should return correct colors for status', () => {
      expect(getStatusColor('Alive')).toBe('text-green-600 bg-green-100');
      expect(getStatusColor('alive')).toBe('text-green-600 bg-green-100');
      expect(getStatusColor('Dead')).toBe('text-red-600 bg-red-100');
      expect(getStatusColor('dead')).toBe('text-red-600 bg-red-100');
      expect(getStatusColor('unknown')).toBe('text-gray-600 bg-gray-100');
      expect(getStatusColor('anything')).toBe('text-gray-600 bg-gray-100');
    });
  });
}); 