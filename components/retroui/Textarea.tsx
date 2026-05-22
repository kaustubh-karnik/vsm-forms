import { cn } from "@/lib/utils";

export function Textarea({
  type = "text",
  placeholder = "Enter text...",
  className = "",
  ...props
}) {
  return (
    <textarea
      placeholder={placeholder}
      rows={4}
      className={cn(
        "px-4 py-3 w-full rounded-[10px] border-2 border-black bg-[color:var(--color-card)] text-[color:var(--color-dark)] shadow-[3px_3px_0_0_#000] transition-all focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0_0_#000] placeholder:text-[color:var(--color-muted)] placeholder:opacity-60",
        className
      )}
      {...props}
    />
  );
}
