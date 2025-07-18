import { Character } from "@/types";
import { StatusBadge } from "@/components/atoms";

interface CharacterInfoProps {
  character: Character;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({ character }) => {
  const infoItems = [
    { label: "Species", value: character.species },
    { label: "Type", value: character.type || "N/A" },
    { label: "Gender", value: character.gender },
    { label: "Origin", value: character.origin.name },
    { label: "Location", value: character.location.name },
    { label: "Created", value: new Date(character.created).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-foreground">{character.name}</h1>
        <StatusBadge status={character.status} size="lg" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-sm font-semibold text-rick-blue uppercase tracking-wide">
              {item.label}
            </span>
            <span className="text-lg text-gray-300 mt-1">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 