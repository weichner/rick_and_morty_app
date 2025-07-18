import { Character } from "@/types";

interface StatusBadgeProps {
  status: Character["status"];
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = "md" 
}) => {
  const getStatusStyles = (status: Character["status"]) => {
    switch (status) {
      case "Alive":
        return "bg-green-100 text-green-800 border-green-200";
      case "Dead":
        return "bg-red-100 text-red-800 border-red-200";
      case "unknown":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-3 py-1 text-sm";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1 text-sm";
    }
  };

  const getStatusIndicator = (status: Character["status"]) => {
    switch (status) {
      case "Alive":
        return "🟢";
      case "Dead":
        return "🔴";
      case "unknown":
        return "⚪";
      default:
        return "⚪";
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${getStatusStyles(status)}
        ${getSizeClasses(size)}
      `}
    >
      <span className="text-xs">{getStatusIndicator(status)}</span>
      {status}
    </span>
  );
}; 