"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Boxes, History, Settings, Zap, Bot, BarChart2 } from "lucide-react";
import type { ExecutionMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { ConnectionIndicator } from "@/components/chrome/connection-indicator";
import { ModeSwitcher } from "@/components/chrome/mode-switcher";
import { StartStopButton } from "@/components/chrome/start-stop-button";
import { Separator } from "@/components/ui/separator";
import { useAppShell } from "@/state/app-shell-context";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  matchPrefix?: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: Boxes },
  { href: "/runs", label: "Run History", icon: History },
  { href: "/ai-llm", label: "AI/LLM", icon: Bot },
  { href: "/reporting", label: "Reporting", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings, matchPrefix: "/settings" },
];

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

export function TopBar({
  mode,
  setMode,
  isRunning,
  runningSince,
  onStartStop,
}: {
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;
  isRunning: boolean;
  runningSince: number | null;
  onStartStop: () => void;
}) {
  const { serverOnline } = useAppShell();
  const [now, setNow] = useState(() => Date.now());
  const pathname = usePathname();

  useEffect(() => {
    if (!runningSince) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [runningSince]);

  const elapsedLabel = runningSince ? formatElapsed((now - runningSince) / 1000) : "00:00";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      {/* Primary bar */}
      <div className="flex h-14 items-center justify-between px-5">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">Zion&nbsp;IV&amp;V</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon, matchPrefix }) => {
            const active = matchPrefix ? pathname.startsWith(matchPrefix) : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon
                  className={cn("h-4 w-4 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")}
                  strokeWidth={active ? 2.5 : 2}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ModeSwitcher mode={mode} onChange={setMode} disabled={isRunning} />
          <Separator orientation="vertical" className="h-5" />
          <StartStopButton isRunning={isRunning} elapsedLabel={elapsedLabel} onClick={onStartStop} />
          <Separator orientation="vertical" className="h-5" />
          <ConnectionIndicator online={serverOnline === true} />
        </div>
      </div>

      {/* Mobile nav strip */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/50 px-3 pb-1.5 pt-1 md:hidden" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, matchPrefix }) => {
          const active = matchPrefix ? pathname.startsWith(matchPrefix) : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
