"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import { fetchMultipleCharacters } from "@/lib/api";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // Fetch 4 iconic characters for the cards
  // Rick (1), Morty (2), Summer (3), Beth (4)
  const characterIds = useMemo(() => [1, 2, 3, 4], []);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        await fetchMultipleCharacters(characterIds);
      } catch (error) {
        console.error("Failed to load characters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [characterIds]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rick-blue via-space-purple to-portal-green text-white py-12 md:py-16 overflow-hidden h-[400px] md:h-[500px]">
        {/* Background Image */}
        <div 
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-700"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/ef/5c/8c/ef5c8cebfd8dec27e15b030d68539bfd.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/35"></div>
        
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-float-slow absolute top-10 left-10 w-1.5 h-1.5 bg-portal-green rounded-full opacity-60"></div>
          <div className="animate-float-medium absolute top-20 right-20 w-1 h-1 bg-morty-yellow rounded-full opacity-80"></div>
          <div className="animate-float-fast absolute bottom-20 left-1/4 w-2 h-2 bg-rick-blue rounded-full opacity-40"></div>
          <div className="animate-float-slow absolute top-32 right-1/3 w-1 h-1 bg-portal-green rounded-full opacity-70"></div>
          <div className="animate-float-medium absolute bottom-32 right-10 w-1.5 h-1.5 bg-morty-yellow rounded-full opacity-50"></div>
        </div>

        <div className="container mx-auto text-center px-4 relative z-10 flex flex-col justify-center h-full">
          <h1 
            className="font-dokdo text-[#97CE4C] mb-4 drop-shadow-2xl"
            style={{
              fontSize: 'clamp(3rem, 12vw, 7.5rem)', // Responsive: 48px a 120px
              lineHeight: '1'
            }}
          >
            Rick&Morty
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 text-white/95 max-w-2xl mx-auto drop-shadow-lg">
            Dive into the infinite multiverse! Explore characters, episodes, and locations 
            from the hit animated series Rick and Morty.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/characters"
              className="px-5 py-2.5 md:px-6 md:py-3 bg-[#f0e14a] text-black font-semibold rounded-lg hover:bg-[#f0e14a]/90 transition-colors shadow-lg"
            >
              Explore Characters
            </Link>
            <Link 
              href="/episodes"
              className="px-5 py-2.5 md:px-6 md:py-3 border-2 border-[#97CE4C] text-[#97CE4C] font-semibold rounded-lg hover:bg-[#97CE4C] hover:text-black transition-colors backdrop-blur-sm"
            >
              Browse Episodes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Characters Card */}
            <div className="bg-card rounded-lg overflow-hidden text-center hover:shadow-lg transition-shadow">
              {/* Character Image */}
              <div 
                className="relative h-48 bg-gradient-to-br from-rick-blue to-portal-green"
                style={{
                  backgroundImage: loading 
                    ? 'none' 
                    : `url(https://nypost.com/wp-content/uploads/sites/2/2020/05/rick-morty-41.jpeg?quality=75&strip=all&w=1024)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {loading && (
                  <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-dokdo text-[36px] font-semibold mb-4 text-[#97CE4C]">Characters</h3>
                <p className="text-muted-foreground mb-4">
                  Meet all 800+ characters from across dimensions
                </p>
                <Link 
                  href="/characters"
                  className="inline-block px-4 py-2 bg-[#f0e14a] text-gray-900 font-bold rounded-lg hover:bg-[#f0e14a]/90 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Episodes Card */}
            <div className="bg-card rounded-lg overflow-hidden text-center hover:shadow-lg transition-shadow">
              {/* Character Image */}
              <div 
                className="relative h-48 bg-gradient-to-br from-space-purple to-morty-yellow"
                style={{
                  backgroundImage: loading 
                    ? 'none' 
                    : `url(https://wallpaperswide.com/download/rick_and_morty_logo-wallpaper-1024x576.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {loading && (
                  <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-dokdo text-[36px] font-semibold mb-4 text-[#97CE4C]">Episodes</h3>
                <p className="text-muted-foreground mb-4">
                  Discover episodes from all seasons of the show
                </p>
                <Link 
                  href="/episodes"
                  className="inline-block px-4 py-2 bg-[#f0e14a] text-gray-900 font-bold rounded-lg hover:bg-[#f0e14a]/90 transition-colors"
                >
                  Watch Guide
                </Link>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-card rounded-lg overflow-hidden text-center hover:shadow-lg transition-shadow">
              {/* Character Image */}
              <div 
                className="relative h-48 bg-gradient-to-br from-portal-green to-rick-blue"
                style={{
                  backgroundImage: loading 
                    ? 'none' 
                    : `url(https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/pjimage-45.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {loading && (
                  <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-dokdo text-[36px] font-semibold mb-4 text-[#97CE4C]">Locations</h3>
                <p className="text-muted-foreground mb-4">
                  Travel through dimensions and alien worlds
                </p>
                <Link 
                  href="/locations"
                  className="inline-block px-4 py-2 bg-[#f0e14a] text-gray-900 font-bold rounded-lg hover:bg-[#f0e14a]/90 transition-colors"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Favorites Card */}
            <div className="bg-card rounded-lg overflow-hidden text-center hover:shadow-lg transition-shadow">
              {/* Character Image */}
              <div 
                className="relative h-48 bg-gradient-to-br from-morty-yellow to-danger-red"
                style={{
                  backgroundImage: loading 
                    ? 'none' 
                    : `url(https://images.steamusercontent.com/ugc/872994794851686089/2267245F40A4290BA76E564CFAD555D774664EF4/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {loading && (
                  <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-dokdo text-[36px] font-semibold mb-4 text-[#97CE4C]">Favorites</h3>
                <p className="text-muted-foreground mb-4">
                  Save your favorite characters and episodes from across the multiverse
                </p>
                <Link 
                  href="/favorites"
                  className="inline-block px-4 py-2 bg-[#f0e14a] text-gray-900 font-bold rounded-lg hover:bg-[#f0e14a]/90 transition-colors"
                >
                  My List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Explore<span className="text-[#97CE4C]">?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Jump into the chaotic world of Rick and Morty. Browse characters, 
            discover episodes, and save your favorites!
          </p>
          <Link 
            href="/characters"
            className="inline-block px-8 py-4 bg-[#97CE4C] text-black font-semibold rounded-lg hover:bg-[#97CE4C]/90 transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
}
