import { CharacterImage, FavoriteButton } from "@/components/atoms";
import { CharacterInfo } from "@/components/molecules";
import { Character } from "@/types";

interface CharacterHeaderProps {
  character: Character;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  character,
  isFavorite,
  onFavoriteToggle,
}) => {
  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border border-border">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Character Image */}
        <div className="md:w-1/3 flex justify-center md:justify-start">
          <CharacterImage 
            src={character.image} 
            alt={character.name}
            size="lg"
            className="w-64 h-64"
          />
        </div>

        {/* Character Information */}
        <div className="md:w-2/3 space-y-6">
          <CharacterInfo character={character} />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <FavoriteButton
              isFavorite={isFavorite}
              onClick={onFavoriteToggle}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 