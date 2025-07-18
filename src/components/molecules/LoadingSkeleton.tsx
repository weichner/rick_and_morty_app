interface LoadingSkeletonProps {
  variant?: "character" | "episode" | "text" | "image";
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = "text", 
  count = 1,
  className = ""
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case "character":
        return (
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      
      case "episode":
        return (
          <div className="p-4 border border-gray-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        );
      
      case "image":
        return (
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        );
      
      case "text":
      default:
        return (
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        );
    }
  };

  if (count === 1) {
    return <div className={className}>{getSkeletonContent()}</div>;
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{getSkeletonContent()}</div>
      ))}
    </div>
  );
}; 