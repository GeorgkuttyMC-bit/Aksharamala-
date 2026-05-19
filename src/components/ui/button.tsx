import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 active:shadow-none",
          {
            "bg-blue-500 text-white shadow-[0_4px_0_0_#2563eb] hover:bg-blue-400":
              variant === "default",
            "bg-green-500 text-white shadow-[0_4px_0_0_#16a34a] hover:bg-green-400":
              variant === "primary",
            "bg-purple-500 text-white shadow-[0_4px_0_0_#9333ea] hover:bg-purple-400":
              variant === "secondary",
            "bg-red-500 text-white shadow-[0_4px_0_0_#dc2626] hover:bg-red-400":
              variant === "danger",
            "hover:bg-accent hover:text-accent-foreground text-slate-700":
              variant === "ghost",
            "h-12 px-6 py-2 text-lg": size === "default",
            "h-9 rounded-xl px-4 text-sm": size === "sm",
            "h-16 rounded-3xl px-8 text-xl": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
