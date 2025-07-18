import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="https://rickandmortyapi.com/api/character/avatar/19.jpeg"
        alt="Rick and Morty"
        fill
        className="object-cover rounded-full border-2 border-green-400"
        priority
      />
    </div>
  );
}; 