"use client";

import { cn } from "@/lib/utils";

export function ConnectionIndicator({ online }: { online: boolean }) {
  return (
    <div
      // The wrapper is a status region. role="status" gives screen
      // readers a polite live announcement when the text changes, and
      // aria-label provides an accessible name for the indicator as a
      // whole (the visible label is just "Online"/"Offline", which
      // reads awkwardly out of context).
      role="status"
      aria-live="polite"
      aria-label={online ? "Server connection: online" : "Server connection: offline"}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full",
          online ? "bg-success" : "bg-muted-foreground/50",
        )}
      />
      <span className={online ? "text-success" : ""}>{online ? "Online" : "Offline"}</span>
    </div>
  );
}