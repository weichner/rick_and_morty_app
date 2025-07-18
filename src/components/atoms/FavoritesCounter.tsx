"use client";

import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoritesCounterProps {
  className?: string;
  isActive?: boolean;
}

export const FavoritesCounter: React.FC<FavoritesCounterProps> = ({
  className,
  isActive = false,
}) => {
  const { favoritesCount } = useFavorites();

  // Default classes based on active state
  const defaultClasses = isActive 
    ? "font-dokdo font-bold text-[#97CE4C] transition-colors flex items-center gap-2 text-[25px]"
    : "font-dokdo text-foreground hover:text-[#97CE4C] transition-colors flex items-center gap-2 text-[25px]";

  return (
    <Link 
      href="/favorites" 
      className={className || defaultClasses}
    >
      Favorites
      {favoritesCount > 0 && (
        <span className="bg-[#97CE4C] text-black text-sm font-bold px-3 py-1.5 rounded-full min-w-[24px] text-center">
          {favoritesCount}
        </span>
      )}
    </Link>
  );
}; 