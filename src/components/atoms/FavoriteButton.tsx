interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
  size = "md",
  disabled = false,
}) => {
  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-sm";
      case "md":
        return "px-4 py-2 text-base";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  const baseClasses = `
    font-medium rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getSizeClasses(size)}
  `;

  const favoriteClasses = isFavorite
    ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${favoriteClasses}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <span className="flex items-center gap-2">
        <span className="text-lg">
          {isFavorite ? "❤️" : "🤍"}
        </span>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </span>
    </button>
  );
}; 