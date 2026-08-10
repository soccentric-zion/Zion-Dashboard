"use client";

import { cn } from "@/lib/utils";
import type { ExecutionMode } from "@/lib/types/api";

const MODES: Array<{ key: ExecutionMode; label: string }> = [
  { key: "single_shot", label: "One-shot" },
  { key: "monitoring", label: "Monitoring" },
  { key: "event", label: "Event" },
  { key: "long_run", label: "Long-run" },
];

export function ModeSwitcher({
  mode,
  disabled,
  onChange,
}: {
  mode: ExecutionMode;
  disabled: boolean;
  onChange: (mode: ExecutionMode) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted p-0.5">
      {MODES.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.key)}
          className={cn(
            "rounded-sm px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            item.key === mode
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
