"use client";

import { cn } from "@/lib/utils";

export function StartStopButton({
  isRunning,
  elapsedLabel,
  disabled,
  onClick,
}: {
  isRunning: boolean;
  elapsedLabel: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        isRunning
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-success text-success-foreground hover:bg-success/90",
      )}
    >
      <span>{isRunning ? "Stop" : "Start"}</span>
      {isRunning && (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          <span>{elapsedLabel}</span>
        </>
      )}
    </button>
  );
}
