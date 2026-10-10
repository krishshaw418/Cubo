"use client";

import { cn } from "@/lib/utils";

interface MenuToggleProps {
  open: boolean;
  onClick: () => void;
}

export function MenuToggle({ open, onClick }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      onClick={onClick}
      className="group relative flex size-11 shrink-0 items-center justify-center
                 rounded-lg border border-emerald-400/30 bg-black
                 transition-colors hover:border-cyan-400
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-cyan-400"
    >
      <span className="relative flex h-5 w-6 flex-col items-center justify-center">
        <span
          className={cn(
            "absolute h-0.5 w-6 rounded-full bg-emerald-300",
            "transition-transform duration-300 ease-in-out",
            open ? "translate-y-0 rotate-45" : "-translate-y-2",
          )}
        />
        <span
          className={cn(
            "absolute h-0.5 w-6 rounded-full bg-cyan-300",
            "transition-all duration-200 ease-in-out",
            open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
          )}
        />
        <span
          className={cn(
            "absolute h-0.5 w-6 rounded-full bg-emerald-300",
            "transition-transform duration-300 ease-in-out",
            open ? "translate-y-0 -rotate-45" : "translate-y-2",
          )}
        />
      </span>
    </button>
  );
}
