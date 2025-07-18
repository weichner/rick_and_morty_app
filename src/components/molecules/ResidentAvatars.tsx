"use client";

import React, { useState, useEffect } from "react";

import { CharacterImage } from "@/components/atoms";
import { fetchCharactersByUrls } from "@/lib/api";
import { Character } from "@/types";

interface ResidentAvatarsProps {
  residentUrls: string[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

export const ResidentAvatars: React.FC<ResidentAvatarsProps> = React.memo(
  ({ residentUrls, maxVisible = 5, size = "sm" }) => {
    const [residents, setResidents] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalResidents = residentUrls.length;
    const visibleResidents = residents.slice(0, maxVisible);
    const remainingCount = totalResidents - maxVisible;

    // Size configurations
    const sizeConfig = {
      sm: {
        avatar: "w-8 h-8",
        container: "-space-x-2",
        text: "text-xs",
        counter: "w-8 h-8 text-xs",
      },
      md: {
        avatar: "w-10 h-10",
        container: "-space-x-3",
        text: "text-sm",
        counter: "w-10 h-10 text-sm",
      },
      lg: {
        avatar: "w-12 h-12",
        container: "-space-x-4",
        text: "text-base",
        counter: "w-12 h-12 text-sm",
      },
    };

    useEffect(() => {
      const loadResidents = async () => {
        if (residentUrls.length === 0) {
          setResidents([]);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // Only fetch what we need to display (maxVisible)
          const urlsToFetch = residentUrls.slice(0, maxVisible);
          const residentsData = await fetchCharactersByUrls(urlsToFetch);
          setResidents(residentsData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load residents");
          setResidents([]);
        } finally {
          setLoading(false);
        }
      };

      loadResidents();
    }, [residentUrls, maxVisible]);

    if (totalResidents === 0) {
      return (
        <div className="flex items-center gap-2">
          <span className={`text-muted-foreground ${sizeConfig[size].text}`}>
            No residents
          </span>
        </div>
      );
    }

    if (loading) {
      return (
        <div className={`flex items-center ${sizeConfig[size].container}`}>
          {Array.from({ length: Math.min(maxVisible, totalResidents) }).map((_, index) => (
            <div
              key={index}
              className={`${sizeConfig[size].avatar} rounded-full bg-muted animate-pulse`}
            />
          ))}
          {totalResidents > maxVisible && (
            <div
              className={`${sizeConfig[size].counter} rounded-full bg-muted animate-pulse`}
            />
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2">
          <span className={`text-muted-foreground ${sizeConfig[size].text}`}>
            {totalResidents} residents
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center ${sizeConfig[size].container}`}>
          {visibleResidents.map((resident, index) => (
            <div
              key={resident.id}
              className={`${sizeConfig[size].avatar} rounded-full overflow-hidden ring-2 ring-background shadow-sm hover:scale-110 hover:z-10 transition-all duration-200 relative`}
              style={{ zIndex: maxVisible - index }}
              title={resident.name}
            >
              <CharacterImage
                src={resident.image}
                alt={resident.name}
                size="full"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {remainingCount > 0 && (
            <div
              className={`${sizeConfig[size].counter} rounded-full bg-muted/90 ring-2 ring-background flex items-center justify-center font-semibold text-muted-foreground hover:bg-muted transition-colors duration-200 relative`}
              title={`+${remainingCount} more residents`}
              style={{ zIndex: 0 }}
            >
              +{remainingCount}
            </div>
          )}
        </div>
        
        <span className={`text-muted-foreground ${sizeConfig[size].text} font-medium`}>
          {totalResidents} {totalResidents === 1 ? 'resident' : 'residents'}
        </span>
      </div>
    );
  }
);

ResidentAvatars.displayName = "ResidentAvatars"; 