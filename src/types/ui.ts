// UI Component Type Definitions

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

export interface InputProps {
  type?: "text" | "email" | "password" | "search";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface CardProps {
  children: any;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface BadgeProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  children: any;
  className?: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Theme types
export type ThemeMode = "light" | "dark";

// Status types for characters
export type CharacterStatus = "Alive" | "Dead" | "unknown";

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
