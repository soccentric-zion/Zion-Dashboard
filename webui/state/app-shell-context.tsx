"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api";
import { PLATFORM_SLUG } from "@/lib/platform";
import type { ExecutionMode, ModuleRunSelection } from "@/lib/types/api";

// ─── Actions (stable) ────────────────────────────────────────────────────────
// All consumers that only need to dispatch (call setters) or check
// `serverOnline` subscribe to this context. The setters are memoized with
// useCallback so their identity is stable across renders, meaning a
// consumer that only reads actions will not re-render when any other
// piece of state changes. `serverOnline` changes only when the network
// health flips, which is at most a few times per session.
//
// This used to be one big context whose `value` memo listed every state
// field as a dep, so any setMode / setIsRunning call from any consumer
// re-rendered every consumer — including heavy chart components. The
// split lets consumers opt into only the slices they read.

export interface AppShellActions {
  setMode: (mode: ExecutionMode) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveRunId: (runId: string | null) => void;
  setIsRunning: (running: boolean) => void;
  setReviewingRunId: (runId: string | null) => void;
  setThemeMode: (mode: "system" | "light" | "dark") => void;
  setActiveModuleSelection: (selection: ModuleRunSelection | null) => void;
  registerModuleSearchFocus: (focusFn: (() => void) | null) => void;
  focusModuleSearch: () => void;
  serverOnline: boolean | null;
}

const AppShellActionsContext = createContext<AppShellActions | null>(null);

// ─── State (changes often) ───────────────────────────────────────────────────
// Components that read current state (mode, theme, run ids) subscribe
// here. They re-render on any state change, which is what they asked
// for — but components that only need to *dispatch* don't subscribe to
// this and stay quiet.

export interface AppShellState {
  mode: ExecutionMode;
  sidebarCollapsed: boolean;
  activeRunId: string | null;
  isRunning: boolean;
  reviewingRunId: string | null;
  themeMode: "system" | "light" | "dark";
  activeModuleSelection: ModuleRunSelection | null;
}

const AppShellStateContext = createContext<AppShellState | null>(null);

const SIDEBAR_KEY = `${PLATFORM_SLUG}.sidebar.collapsed`;
const THEME_KEY = `${PLATFORM_SLUG}.theme.mode`;
const DEFAULT_MODE_KEY = `${PLATFORM_SLUG}.prefs.defaultMode`;

function readDefaultMode(): ExecutionMode {
  if (typeof window === "undefined") return "single_shot";
  try {
    const storedMode = JSON.parse(window.localStorage.getItem(DEFAULT_MODE_KEY) ?? "null") as unknown;
    if (storedMode === "single_shot" || storedMode === "monitoring" || storedMode === "event" || storedMode === "long_run") {
      return storedMode;
    }
  } catch {
    return "single_shot";
  }
  return "single_shot";
}

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ExecutionMode>(() => readDefaultMode());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_KEY) === "true";
  });
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [reviewingRunId, setReviewingRunId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">(() => {
    if (typeof window === "undefined") return "system";
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      return storedTheme;
    }
    return "system";
  });
  const [activeModuleSelection, setActiveModuleSelection] = useState<ModuleRunSelection | null>(null);
  const [moduleSearchFocusFn, setModuleSearchFocusFn] = useState<(() => void) | null>(null);

  const { data: healthData, isError: healthError, isPending: healthPending } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 10_000,
    retry: 0,
  });
  // Server status with three explicit states:
  //  - null:  never been queried, or query is still in flight with no cache
  //  - true:  last successful response said status === "ok"
  //  - false: the most recent response was an error
  // On a transient blip the previous cached healthData is still in memory
  // while the new fetch is erroring; we must NOT report `true` in that
  // window. isError from the latest run is the source of truth.
  const serverOnline: boolean | null = healthError
    ? false
    : healthPending && !healthData
      ? null
      : healthData
        ? healthData.status === "ok"
        : null;

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, themeMode);

    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      return;
    }

    if (themeMode === "light") {
      root.classList.remove("dark");
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      if (media.matches) root.classList.add("dark");
      else root.classList.remove("dark");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [themeMode]);

  // All setters are stable across renders. Identity never changes,
  // so a consumer of AppShellActionsContext that only calls setters
  // never re-renders.
  const registerModuleSearchFocus = useCallback((focusFn: (() => void) | null) => {
    // Direct value setter — wrap in an updater only when deriving from
    // previous state. Wrapping `() => focusFn` here is misleading
    // (reads like a state derivation) and would force a re-render on
    // every call even when focusFn is referentially equal.
    setModuleSearchFocusFn(focusFn);
  }, []);
  const focusModuleSearch = useCallback(() => {
    moduleSearchFocusFn?.();
  }, [moduleSearchFocusFn]);

  // Memoize the actions value. The setters are all stable, so this
  // object reference only changes when `serverOnline` flips — exactly
  // the consumers that care about online state.
  const actions = useMemo<AppShellActions>(
    () => ({
      setMode,
      setSidebarCollapsed,
      setActiveRunId,
      setIsRunning,
      setReviewingRunId,
      setThemeMode,
      setActiveModuleSelection,
      registerModuleSearchFocus,
      focusModuleSearch,
      serverOnline,
    }),
    [
      registerModuleSearchFocus,
      focusModuleSearch,
      serverOnline,
      // The setters come from useState and are stable by definition,
      // but lint/exhaustive-deps wants them listed. They never change
      // identity, so this is a no-op for memo invalidation.
      setMode,
      setSidebarCollapsed,
      setActiveRunId,
      setIsRunning,
      setReviewingRunId,
      setThemeMode,
      setActiveModuleSelection,
    ],
  );

  const state = useMemo<AppShellState>(
    () => ({
      mode,
      sidebarCollapsed,
      activeRunId,
      isRunning,
      reviewingRunId,
      themeMode,
      activeModuleSelection,
    }),
    [mode, sidebarCollapsed, activeRunId, isRunning, reviewingRunId, themeMode, activeModuleSelection],
  );

  return (
    <AppShellActionsContext.Provider value={actions}>
      <AppShellStateContext.Provider value={state}>{children}</AppShellStateContext.Provider>
    </AppShellActionsContext.Provider>
  );
}

export function useAppShellActions(): AppShellActions {
  const ctx = useContext(AppShellActionsContext);
  if (!ctx) {
    throw new Error("useAppShellActions must be used inside AppShellProvider");
  }
  return ctx;
}

export function useAppShellState(): AppShellState {
  const ctx = useContext(AppShellStateContext);
  if (!ctx) {
    throw new Error("useAppShellState must be used inside AppShellProvider");
  }
  return ctx;
}

// Backwards-compatible: useAppShell() returns the union of both. This is
// the existing public API; new callers should prefer the slice-specific
// hooks above for better render isolation. Existing call sites keep
// working without churn.
export function useAppShell(): AppShellState & AppShellActions {
  const actions = useAppShellActions();
  const state = useAppShellState();
  return { ...state, ...actions };
}
