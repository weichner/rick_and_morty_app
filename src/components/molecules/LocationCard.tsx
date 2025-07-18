import React from "react";
import { Location } from "@/types";
import { ResidentAvatars } from "./ResidentAvatars";

interface LocationCardProps {
  location: Location;
  onViewDetails?: (locationId: number) => void;
}

export const LocationCard: React.FC<LocationCardProps> = React.memo(
  ({ location }) => {
    const getTypeColor = (type: string) => {
      const typeMap: Record<string, string> = {
        Planet: "bg-rick-blue/20 text-rick-blue border-rick-blue/30",
        Cluster: "bg-space-purple/20 text-space-purple border-space-purple/30",
        "Space station": "bg-portal-green/20 text-portal-green border-portal-green/30",
        Microverse: "bg-pink-500/20 text-pink-400 border-pink-500/30",
        TV: "bg-morty-yellow/20 text-morty-yellow border-morty-yellow/30",
        Dream: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
        Resort: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        "Fantasy town": "bg-danger-red/20 text-danger-red border-danger-red/30",
        Dimension: "bg-space-purple/20 text-space-purple border-space-purple/30",
      };

      return typeMap[type] || "bg-muted/30 text-muted-foreground border-muted";
    };

    const getDimensionColor = (dimension: string) => {
      if (dimension.includes("C-137")) {
        return "bg-portal-green/20 text-portal-green border-portal-green/30";
      }
      if (dimension.includes("Replacement")) {
        return "bg-morty-yellow/20 text-morty-yellow border-morty-yellow/30";
      }
      if (dimension.includes("unknown")) {
        return "bg-muted/30 text-muted-foreground border-muted";
      }
      return "bg-rick-blue/20 text-rick-blue border-rick-blue/30";
    };

    return (
      <div className="bg-card rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-rick-blue/30 transition-all duration-300 border border-border">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
            {location.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(
                location.type
              )}`}
            >
              {location.type}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getDimensionColor(
                location.dimension
              )}`}
            >
              {location.dimension}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-muted-foreground font-medium text-sm block mb-2">
              Residents:
            </span>
            <ResidentAvatars 
              residentUrls={location.residents} 
              maxVisible={5}
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground font-medium">Created:</span>
            <span className="text-muted-foreground">
              {new Date(location.created).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

LocationCard.displayName = "LocationCard"; 