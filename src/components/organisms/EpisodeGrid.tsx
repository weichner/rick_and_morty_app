import { EpisodeCard } from "@/components/molecules";
import { Episode } from "@/types";

interface EpisodeGridProps {
  episodes: Episode[];
  loading?: boolean;
  onEpisodeClick?: (episode: Episode) => void;
}

export const EpisodeGrid: React.FC<EpisodeGridProps> = ({
  episodes,
  loading = false,
  onEpisodeClick,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-6 border border-border rounded-lg bg-card shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-6xl mb-4">📺</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Episodes Found
        </h3>
        <p className="text-muted-foreground">
          This character doesn&apos;t appear in any episodes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Episodes ({episodes.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            onClick={onEpisodeClick ? () => onEpisodeClick(episode) : undefined}
          />
        ))}
      </div>
    </div>
  );
}; 