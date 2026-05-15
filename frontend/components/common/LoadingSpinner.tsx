import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClass = sizeMap[size];
  
  return (
    <div 
      className={cn("flex items-center justify-center", sizeClass, className)} 
      aria-label="로딩 중"
    >
      <div className="relative h-full w-full">
        {/* Track */}
        <div
          className="rounded-full border-2 border-primary-100 dark:border-primary-900/40 h-full w-full"
        />
        {/* Spinner */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin h-full w-full"
        />
      </div>
    </div>
  );
}