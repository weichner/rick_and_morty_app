# Testing Documentation

## Test Suite Overview

This Rick and Morty Explorer application includes a comprehensive test suite using Jest and React Testing Library, following React testing best practices.

## Tests Included

### 🧩 Atom Components
- **FavoriteButton**: Tests for functionality, states, accessibility, and rendering

### 🔗 Molecule Components
- **CharacterCard**: Tests for rendering, interactivity, navigation, and event handling

### 🎯 Custom Hooks
- **useIntersectionObserver**: Tests for functionality, options, and lifecycle

### 🌐 Context Providers
- **FavoritesContext**: Tests for global state, localStorage, and error handling

### 🛠️ Utilities
- **Utils Functions**: Tests for utility functions for formatting and validation

## Available Testing Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run automatically on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   ├── atoms/
│   │   └── __tests__/
│   │       └── FavoriteButton.test.tsx
│   └── molecules/
│       └── __tests__/
│           └── CharacterCard.test.tsx
├── tests/
│   ├── contexts/
│   │   └── FavoritesContext.test.tsx
│   ├── hooks/
│   │   └── useIntersectionObserver.test.ts
│   ├── utils/
│   │   └── test-utils.tsx
│   └── setup.ts
└── lib/
    └── __tests__/
        └── utils.test.ts
```

## Testing Features

### ✅ Complete Configuration
- Jest configured for Next.js
- React Testing Library
- TypeScript support
- Mocks for localStorage, IntersectionObserver, Next.js router

### ✅ Testing Coverage
- Unit tests for components
- Integration tests for Context providers
- Custom hooks testing
- Utility functions testing

### ✅ Best Practices
- User behavior-focused tests
- Semantic queries usage (getByRole, getByText)
- Proper mocking of external dependencies
- Accessibility testing
- Asynchronous state handling

### ✅ Covered Use Cases
- Component rendering
- User interactions (clicks, inputs)
- Loading and error states
- Favorites management
- Page navigation
- Data persistence (localStorage)

## Test Examples

### Component Test
```typescript
it('calls onFavoriteToggle when favorite button is clicked', async () => {
  const user = userEvent.setup();
  render(<CharacterCard {...defaultProps} />);
  
  const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i });
  await user.click(favoriteButtons[0]);
  
  expect(defaultProps.onFavoriteToggle).toHaveBeenCalledWith(mockCharacter.id);
});
```

### Context Test
```typescript
it('can add favorites', async () => {
  const user = userEvent.setup();
  render(
    <FavoritesProvider>
      <TestComponent />
    </FavoritesProvider>
  );

  await user.click(screen.getByText('Add 1'));
  
  expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
});
```

### Hook Test
```typescript
it('should create IntersectionObserver with default options', () => {
  renderHook(() => useIntersectionObserver(mockCallback));

  expect(mockIntersectionObserver).toHaveBeenCalledWith(
    expect.any(Function),
    {
      threshold: 0.1,
      rootMargin: '0px 0px 100px 0px',
    }
  );
});
```

## Useful Commands for Interview

```bash
# View all tests running
npm test

# View detailed coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="FavoriteButton"

# Run tests from specific file
npm test -- CharacterCard.test.tsx

# Run tests in verbose mode for more details
npm test -- --verbose
```

## Benefits of This Implementation

1. **Code Confidence**: Tests ensure components work as expected
2. **Safe Refactoring**: Allows making changes without fear of breaking existing functionality
3. **Living Documentation**: Tests serve as documentation on how to use components
4. **TDD Development**: Facilitates test-driven development
5. **CI/CD Ready**: Tests can be easily integrated into CI/CD pipelines

## Coverage Metrics

The tests cover:
- ✅ Component rendering
- ✅ User interactions
- ✅ Error and loading states
- ✅ Business logic (favorites)
- ✅ Custom hooks
- ✅ Context providers
- ✅ Utility functions

This implementation demonstrates solid knowledge of React testing and preparation for professional development environments. 