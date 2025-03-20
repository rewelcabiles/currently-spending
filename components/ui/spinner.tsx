"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "accent" | "white"
  className?: string
}

export default function LoadingSpinner({ size = "md", color = "primary", className }: LoadingSpinnerProps) {
  // Map size to actual pixel values
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  // Map color to Tailwind classes
  const colorMap = {
    primary: "border-primary border-t-primary-foreground",
    secondary: "border-secondary border-t-secondary-foreground",
    accent: "border-blue-600 border-t-blue-300",
    white: "border-white border-t-white/30",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn("animate-spin rounded-full border-2 border-t-2", sizeMap[size], colorMap[color], className)}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

