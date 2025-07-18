'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FavoritesCounter, Logo } from '@/components/atoms';

export const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  // Helper function to determine if a path is active
  const isActivePath = (path: string): boolean => {
    if (path === '/favorites') {
      return pathname === '/favorites';
    }
    return pathname.startsWith(path);
  };

  // Helper function to get navigation link classes
  const getNavLinkClasses = (path: string): string => {
    const baseClasses = "font-dokdo transition-colors text-[25px]";
    const activeClasses = "font-bold text-[#97CE4C]";
    const inactiveClasses = "text-foreground hover:text-[#97CE4C]";
    
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  // Helper function to get mobile navigation link classes for overlay menu
  const getMobileNavLinkClasses = (path: string): string => {
    const baseClasses = "font-dokdo py-6 px-8 transition-all duration-200 text-[48px] block text-center hover:scale-105 transform";
    const activeClasses = "font-bold text-[#97CE4C]";
    const inactiveClasses = "text-white hover:text-[#97CE4C]";
    
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      <header className="bg-card border-b border-border relative z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center relative z-50" onClick={closeMenu}>
                <Logo size="md" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/characters" 
                className={getNavLinkClasses('/characters')}
              >
                Characters
              </Link>
              <Link 
                href="/episodes" 
                className={getNavLinkClasses('/episodes')}
              >
                Episodes
              </Link>
              <Link 
                href="/locations" 
                className={getNavLinkClasses('/locations')}
              >
                Locations
              </Link>
              <FavoritesCounter 
                isActive={isActivePath('/favorites')}
                className={getNavLinkClasses('/favorites')}
              />
            </div>

            {/* Mobile menu button */}
            <button 
              type="button"
              className="md:hidden p-1.5 rounded-md hover:bg-muted/50 transition-colors relative z-50 flex items-center justify-center"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                {/* Hamburger icon with animation */}
                <span 
                  className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                />
                <span 
                  className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          

          
          {/* Centered Menu Content */}
          <div className="fixed inset-0 z-40 flex items-center justify-center md:hidden">
            <div className="text-center space-y-4">
              {/* Navigation Links */}
              <Link 
                href="/characters" 
                className={getMobileNavLinkClasses('/characters')}
                onClick={closeMenu}
              >
                Characters
              </Link>
              
              <Link 
                href="/episodes" 
                className={getMobileNavLinkClasses('/episodes')}
                onClick={closeMenu}
              >
                Episodes
              </Link>
              
              <Link 
                href="/locations" 
                className={getMobileNavLinkClasses('/locations')}
                onClick={closeMenu}
              >
                Locations
              </Link>
              
              <div className={getMobileNavLinkClasses('/favorites')}>
                <FavoritesCounter 
                  isActive={isActivePath('/favorites')}
                  className="text-white hover:text-[#97CE4C] font-dokdo text-[48px] flex items-center justify-center gap-3"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}; 