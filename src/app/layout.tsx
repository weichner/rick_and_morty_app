import type { Metadata } from 'next';
import { Inter, Dokdo } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { MobileNavigation } from '@/components/organisms';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dokdo = Dokdo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dokdo',
});

export const metadata: Metadata = {
  title: 'Rick and Morty Explorer',
  description: 'Explore the Rick and Morty universe - characters, episodes, and locations',
  keywords: ['Rick and Morty', 'characters', 'episodes', 'locations', 'TV show'],
  authors: [{ name: 'CEiiA Front End Challenge' }],
  viewport: 'width=device-width, initial-scale=1',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
              <head>
        <link 
          href="https://fonts.cdnfonts.com/css/sansation" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} ${dokdo.variable} font-sans antialiased h-full bg-background text-foreground`}>
        <FavoritesProvider>
          <FilterProvider>
            <div className="min-h-full flex flex-col">
              {/* Navigation Header */}
              <MobileNavigation />

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer
              <footer className="bg-card border-t border-border">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                      <span className="text-foreground font-medium">Rick & Morty Explorer</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Built with Next.js • Data from Rick and Morty API</p>
                    </div>
                  </div>
                </div>
              </footer> */}
            </div>
          </FilterProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
