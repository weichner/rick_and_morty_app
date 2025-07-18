import Image from "next/image";

interface CharacterImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export const CharacterImage: React.FC<CharacterImageProps> = ({
  src,
  alt,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-64 h-64",
    full: "w-full aspect-square", // For responsive character cards
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${sizeClasses[size]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          size === "full"
            ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            : size === "lg" 
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            : size === "md"
            ? "(max-width: 768px) 50vw, 25vw"
            : "10vw"
        }
      />
    </div>
  );
}; 