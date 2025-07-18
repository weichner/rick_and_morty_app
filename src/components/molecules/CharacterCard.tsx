import Link from "next/link";
import { Character } from "@/types";
import { CharacterImage, StatusBadge } from "@/components/atoms";

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
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(character.id);
  };

  return (
    <div className="group perspective-1000 aspect-square w-full cursor-pointer">
      <div className="relative preserve-3d w-full h-full duration-700 group-hover:rotate-y-180">
        {/* Front side - Only image */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg">
          <Link href={`/characters/${character.id}`} className="block w-full h-full">
            <CharacterImage
              src={character.image}
              alt={character.name}
              size="full"
              className="w-full h-full"
            />
          </Link>
          
          {/* Favorite button positioned over the image */}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleFavoriteClick}
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
          <Link href={`/characters/${character.id}`} className="block w-full h-full relative">
            {/* Darkened background image */}
            <div className="absolute inset-0">
              <CharacterImage
                src={character.image}
                alt={character.name}
                size="full"
                className="w-full h-full"
              />
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
                Click to view more details
              </div>
            </div>
          </Link>
          
          {/* Favorite button on back side */}
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleFavoriteClick}
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