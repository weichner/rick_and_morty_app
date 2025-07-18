# Rick and Morty Explorer

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Testing-Jest-C21325?style=for-the-badge&logo=jest" alt="Jest" />
</div>

<br />

<div align="center">
  <h3>🚀 A modern, responsive web application for exploring the Rick and Morty universe</h3>
  <p>Built as part of the CEiiA Front-End Challenge with Next.js 15, React 19, and modern best practices</p>
</div>

## ✨ Features

### 🎭 **Character Explorer**
- Browse 800+ characters with advanced filtering
- Search by name, status (Alive/Dead/Unknown), and species
- Infinite scroll with automatic loading
- Detailed character pages with episode appearances
- Responsive grid layout (1-5 columns based on screen size)

### 📺 **Episode Guide**
- Complete episode database from all seasons
- Search by episode name or code (e.g., S01E01)
- Episode cards with air dates and character information
- Season-based organization

### 🌍 **Location Database**
- Explore dimensions and alien worlds
- Filter by location type and dimension
- Resident character avatars
- Interactive location cards

### ⭐ **Favorites System**
- Persistent favorites using localStorage
- Add/remove characters with instant feedback
- Dedicated favorites page with sorting options
- Real-time counter in navigation

### 🔍 **Advanced Search & Filtering**
- Debounced search for optimal performance
- Multiple filter combinations
- Clear filters functionality
- Real-time results

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interactions
- Optimized for all screen sizes
- Progressive web app features

## 🛠️ Technology Stack

### **Core Framework**
- **Next.js 15** - App Router with Server/Client Components
- **React 19** - Latest features and performance improvements
- **TypeScript 5** - Strict type checking and IntelliSense

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom Design System** - Rick & Morty themed colors
- **Responsive Grid System** - Mobile-first responsive design
- **CSS Animations** - Smooth transitions and hover effects

### **State Management**
- **React Context API** - Global state management
- **Custom Hooks** - Reusable business logic
- **Local Storage** - Persistent user preferences

### **Data Fetching**
- **Rick and Morty API** - Official REST API
- **Infinite Scroll** - Performance-optimized loading
- **Error Handling** - Comprehensive error boundaries

### **Testing**
- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing
- **User Event** - User interaction simulation

### **Code Quality**
- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Type safety

## 📁 Project Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── characters/         # Character pages
│   │   ├── [id]/          # Dynamic character detail
│   │   └── page.tsx       # Characters listing
│   ├── episodes/          # Episodes explorer
│   ├── locations/         # Locations database
│   ├── favorites/         # User favorites
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Atomic Design Structure
│   ├── atoms/             # Basic UI elements
│   │   ├── FavoriteButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatusBadge.tsx
│   │   └── __tests__/     # Component tests
│   ├── molecules/         # Component combinations
│   │   ├── CharacterCard.tsx
│   │   ├── EpisodeCard.tsx
│   │   ├── LocationCard.tsx
│   │   └── __tests__/     # Component tests
│   └── organisms/         # Complex UI sections
│       ├── CharacterHeader.tsx
│       ├── EpisodeGrid.tsx
│       ├── LocationGrid.tsx
│       └── MobileNavigation.tsx
├── hooks/                 # Custom React hooks
│   ├── useCharacterDetails.ts
│   ├── useFavoriteCharacters.ts
│   ├── useInfiniteCharacters.ts
│   ├── useInfiniteEpisodes.ts
│   ├── useInfiniteLocations.ts
│   └── useIntersectionObserver.ts
├── contexts/              # React Context providers
│   ├── FavoritesContext.tsx
│   └── FilterContext.tsx
├── lib/                   # Utilities and configurations
│   ├── api.ts             # API client
│   └── config.ts          # App configuration
├── types/                 # TypeScript definitions
│   ├── api.ts             # API response types
│   ├── ui.ts              # UI component types
│   └── index.ts           # Type exports
└── tests/                 # Test utilities
    ├── contexts/          # Context tests
    ├── hooks/             # Hook tests
    ├── utils/             # Testing utilities
    │   ├── mocks.ts       # Mock data
    │   └── test-utils.tsx # Custom render
    └── setup.ts           # Jest configuration
```

## 🎨 Design System

### **Color Palette**
```css
/* Rick and Morty Theme */
--rick-blue: #00b8d4      /* Primary brand color */
--morty-yellow: #f9c23c   /* Secondary accent */
--portal-green: #97ce4c   /* Success states */
--space-purple: #6366f1   /* Interactive elements */
--danger-red: #ef4444     /* Error states */
```

### **Typography**
- **Primary**: Inter - Clean, modern sans-serif
- **Display**: Dokdo - Rick and Morty themed font
- **Hierarchy**: Consistent font weights and sizes

### **Component Architecture**
Following **Atomic Design** methodology:
- **Atoms**: Button, Badge, Spinner, Image
- **Molecules**: CharacterCard, EpisodeCard, SearchBar
- **Organisms**: CharacterGrid, Navigation, Header
- **Templates**: PageLayout, DetailLayout
- **Pages**: Complete user interfaces

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18.17 or later
- npm 9.0 or later

### **Installation**

1. **Clone the repository**
   ```bash
   git clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   ```
   http://localhost:3000
   ```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🏗️ Key Implementation Details

### **Performance Optimizations**
- **Infinite Scroll**: Automatic loading with intersection observer
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Dynamic imports for heavy components
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Search**: Reduced API calls with 300ms debounce

### **State Management Pattern**
- **Global State**: React Context for favorites and filters
- **Local State**: useState for component-specific state
- **Server State**: Custom hooks with proper caching
- **Persistent State**: localStorage for user preferences

### **API Integration**
- **RESTful Client**: Fetch-based API client with error handling
- **Type Safety**: Full TypeScript coverage for API responses
- **Error Boundaries**: Graceful error handling and recovery
- **Loading States**: Skeleton screens and loading indicators

### **Accessibility Features**
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling

## 🧪 Testing Strategy

### **Test Coverage**
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Hook Tests**: Custom hook functionality
- **Context Tests**: Global state management

### **Testing Philosophy**
- Test user behavior, not implementation details
- Use React Testing Library for component testing
- Mock external dependencies appropriately
- Maintain high test coverage (>80%)

### **Test Structure**
```
src/
├── components/
│   └── __tests__/         # Component tests
├── tests/
│   ├── contexts/          # Context provider tests
│   ├── hooks/             # Custom hook tests
│   └── utils/             # Testing utilities
```

For detailed testing information, see [TESTING.md](./TESTING.md).

## 📚 API Reference

### **Rick and Morty API**
This application uses the official [Rick and Morty API](https://rickandmortyapi.com/):

- **Base URL**: `https://rickandmortyapi.com/api`
- **Endpoints**:
  - `/character` - Character data
  - `/episode` - Episode information
  - `/location` - Location details
- **Features**: Pagination, filtering, search
- **Rate Limiting**: None (free public API)

### **Custom API Client**
Located in `src/lib/api.ts`:
- Type-safe request/response handling
- Error handling and retries
- Request caching and deduplication
- Comprehensive TypeScript types

## 🚀 Deployment

### **Build Process**
```bash
npm run build
npm run start
```

### **Production Considerations**
- Static asset optimization
- Image optimization with Next.js
- SEO-friendly URLs and metadata
- Performance monitoring ready

## 🤝 Contributing

### **Development Workflow**
1. Follow atomic design principles
2. Maintain TypeScript strict compliance
3. Write comprehensive tests
4. Use consistent naming conventions
5. Follow SOLID principles

### **Code Standards**
- **Components**: PascalCase naming
- **Functions**: camelCase naming
- **Types**: Descriptive interface names
- **Files**: Consistent export patterns

### **Pull Request Process**
1. Ensure all tests pass
2. Maintain test coverage
3. Update documentation
4. Follow commit message conventions

## 🙏 Acknowledgments

- **[Rick and Morty API](https://rickandmortyapi.com/)** - Comprehensive, free API
- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Team](https://reactjs.org/)** - Powerful UI library
- **CEiiA** - For the challenging and engaging front-end assessment

---

<div align="center">
  <p><strong>Built with ❤️ for the CEiiA Front-End Challenge</strong></p>
  <p><em>Exploring the infinite multiverse, one component at a time</em></p>
</div>
