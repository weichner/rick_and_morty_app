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
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIEBwAAAAAAAAAAAAABAgADBAUREiEiMUFRgf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjA4YTWuUOjNk4kMnCHfLx2pBybnqRr6fAB8BSgUgX5/LhRrPqz61l1cTZMGiE3LXMXH5LrLz9gfWj6tNqG4oSFdKYo1GKKbg9nR4bgdL2/sVlO9jHGdDXPNqyPUQ3M8ZIHgXsOqHgH0eHr3M/bnyLhc3PQH9nR4//Z"
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