import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "Enter text",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "px-4 py-3 w-full rounded-[10px] border-2 border-black bg-[color:var(--color-card)] text-[color:var(--color-dark)] shadow-[3px_3px_0_0_#000] transition-all focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0_0_#000] placeholder:text-[color:var(--color-muted)] placeholder:opacity-60",
        props["aria-invalid"]
          ? "border-destructive text-destructive shadow-destructive focus:shadow-destructive"
          : "",
        className
      )}
      {...props}
    />
  );
};
