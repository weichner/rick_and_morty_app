"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { CharacterImage, StatusBadge } from "@/components/atoms";
import { Character } from "@/types";

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onFavoriteToggle,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function to check if device supports touch
  const checkTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Update touch device detection
  const updateTouchDevice = useCallback(() => {
    const newIsTouchDevice = checkTouchDevice();
    setIsTouchDevice(newIsTouchDevice);
    
    // Reset flip state when switching modes to avoid stuck states
    if (newIsTouchDevice !== isTouchDevice) {
      setIsFlipped(false);
    }
  }, [checkTouchDevice, isTouchDevice]);

  // Preload image when component mounts to avoid flash on first flip
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = character.image;
  }, [character.image]);

  // Initial detection and setup listeners for mode changes
  useEffect(() => {
    // Initial detection
    updateTouchDevice();

    // Listen for orientation changes (mobile rotation)
    const handleOrientationChange = () => {
      setTimeout(updateTouchDevice, 100); // Small delay to let orientation settle
    };

    // Listen for resize events (responsive mode switching in DevTools)
    const handleResize = () => {
      updateTouchDevice();
    };

    // Listen for visibility change (when DevTools opens/closes or tab switches)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTouchDevice();
      }
    };

    // Add event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also check periodically in case DevTools mode changes aren't caught
    const intervalId = setInterval(updateTouchDevice, 1000);

    return () => {
      // Cleanup
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [updateTouchDevice]);

  const handleFavoriteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(character.id);
  };

  // Touch start - show flip (like hover start) - ONLY for touch devices
  const handleTouchStart = (_e: React.TouchEvent) => {
    if (!isTouchDevice) return;
    setIsFlipped(true);
  };

  // Touch end - hide flip (like hover end) - ONLY for touch devices
  const handleTouchEnd = (_e: React.TouchEvent) => {
    if (!isTouchDevice) return;
    // Small delay to allow for tap to register before hiding flip
    setTimeout(() => {
      setIsFlipped(false);
    }, 150);
  };

  // Touch cancel - hide flip (if touch is interrupted) - ONLY for touch devices
  const handleTouchCancel = () => {
    if (!isTouchDevice) return;
    setIsFlipped(false);
  };

  return (
    <div 
      className={`group perspective-1000 aspect-square w-full cursor-pointer ${
        isTouchDevice ? 'touch-device' : ''
      }`}
      onTouchStart={isTouchDevice ? handleTouchStart : undefined}
      onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
      onTouchCancel={isTouchDevice ? handleTouchCancel : undefined}
    >
      <div 
        className={`relative preserve-3d w-full h-full duration-700 ${
          !isTouchDevice 
            ? 'group-hover:rotate-y-180' 
            : (isFlipped ? 'rotate-y-180' : '')
        }`}
      >
        {/* Front side - Only image */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg">
          <Link 
            href={`/characters/${character.id}`} 
            className="block w-full h-full"
          >
            <CharacterImage
              src={character.image}
              alt={character.name}
              size="full"
              className="w-full h-full"
            />
          </Link>
          
          {/* Favorite button positioned over the image */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleFavoriteClick}
              onTouchEnd={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <span className="text-lg">
                {isFavorite ? "❤️" : "🤍"}
              </span>
            </button>
          </div>
        </div>

        {/* Back side - Image with information overlay */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-lg">
          <Link 
            href={`/characters/${character.id}`} 
            className="block w-full h-full relative"
          >
            {/* Background with character image and overlay */}
            <div 
              className="absolute inset-0 transition-opacity duration-300"
              style={{ 
                backgroundColor: imageLoaded ? 'rgb(75, 85, 99)' : 'rgb(55, 65, 81)',
                backgroundImage: imageLoaded ? `url(${character.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Character background image with better loading */}
              <div className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <CharacterImage
                  src={character.image}
                  alt={character.name}
                  size="full"
                  className="w-full h-full"
                />
              </div>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            
            {/* Character information overlay */}
            <div className="relative z-10 p-3 h-full flex flex-col justify-between text-white">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white drop-shadow-lg leading-tight">
                  {character.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={character.status} />
                  <span className="text-xs font-medium text-white/90">
                    {character.species}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <p className="text-gray-300 truncate">
                    <span className="font-semibold text-rick-blue">Gender:</span> {character.gender}
                  </p>
                  <p className="text-gray-300 truncate">
                    <span className="font-semibold text-rick-blue">Origin:</span> {character.origin.name}
                  </p>
                  <p className="text-gray-300 truncate">
                    <span className="font-semibold text-rick-blue">Location:</span> {character.location.name}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-white/80 bg-black/30 rounded px-2 py-1 text-center mt-2">
                {isTouchDevice ? "Tap to view details" : "Click to view more details"}
              </div>
            </div>
          </Link>
          
          {/* Favorite button on back side */}
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleFavoriteClick}
              onTouchEnd={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <span className="text-lg">
                {isFavorite ? "❤️" : "🤍"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 