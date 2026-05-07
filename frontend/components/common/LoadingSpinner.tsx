import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

const trackSizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Track */}
        <div
          className={cn(
            "rounded-full border-2 border-primary-100 dark:border-primary-900/40",
            trackSizeMap[size]
          )}
        />
        {/* Spinner */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin",
            sizeMap[size]
          )}
        />
      </div>
    </div>
  );
}