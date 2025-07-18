import { Episode } from "@/types";

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onClick }) => {
  const formatEpisodeCode = (episode: string) => {
    // Format S01E01 -> Season 1, Episode 1
    const match = episode.match(/S(\d+)E(\d+)/);
    if (match) {
      const season = parseInt(match[1], 10);
      const episodeNum = parseInt(match[2], 10);
      return `Season ${season}, Episode ${episodeNum}`;
    }
    return episode;
  };

  return (
    <div 
      className={`
        p-6 border border-border rounded-lg bg-card shadow-lg 
        transition-all duration-300 hover:shadow-xl hover:border-rick-blue hover:scale-105
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black bg-[#97CE4C] px-3 py-1.5 rounded-full shadow-sm">
            {episode.episode}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(episode.air_date).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="font-semibold text-foreground line-clamp-2 text-lg">
          {episode.name}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          {formatEpisodeCode(episode.episode)}
        </p>
      </div>
    </div>
  );
}; 