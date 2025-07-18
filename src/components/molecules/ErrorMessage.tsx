interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: "error" | "warning" | "info";
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  variant = "error"
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "❌";
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getVariantStyles()}`}>
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{getIcon()}</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {variant === "error" ? "Something went wrong" : "Notice"}
          </h3>
          <p className="text-sm opacity-90">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-white border border-current rounded-lg 
                       hover:bg-opacity-10 transition-colors duration-200
                       text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 