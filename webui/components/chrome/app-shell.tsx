"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createConfig, createRun, cancelRun } from "@/lib/api";
import type { ExecutionMode } from "@/lib/types/api";
import { HelpShortcutsDialog } from "@/components/chrome/help-shortcuts-dialog";
import { Sidebar } from "@/components/chrome/sidebar";
import { TopBar } from "@/components/chrome/top-bar";
import { useAppShell } from "@/state/app-shell-context";

function modeFromHotkey(key: string): ExecutionMode | null {
  if (key === "1") return "single_shot";
  if (key === "2") return "monitoring";
  if (key === "3") return "event";
  if (key === "4") return "long_run";
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    mode,
    setMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    activeRunId,
    setActiveRunId,
    isRunning,
    setIsRunning,
    activeModuleSelection,
    registerModuleSearchFocus,
    focusModuleSearch,
  } = useAppShell();
  const [search, setSearch] = useState("");
  const [runningSince, setRunningSince] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const runMutation = useMutation({
    mutationFn: async () => {
      if (!activeRunId) {
        if (!activeModuleSelection || activeModuleSelection.enabledTestNames.length === 0) {
          throw new Error("Select a module and enable at least one HAL test before starting a run.");
        }

        let config;
        try {
          config = await createConfig({
            name: `${activeModuleSelection.moduleName} ${mode}`,
            description: JSON.stringify(
              {
                module_id: activeModuleSelection.moduleId,
                enabled_test_names: activeModuleSelection.enabledTestNames,
              },
              null,
              2,
            ),
            mode,
            common_config: {
              source: "webui",
              execution_mode: mode,
            },
            modules: [
              {
                module_id: activeModuleSelection.moduleId,
                config_type_url: activeModuleSelection.configTypeUrl,
                config: activeModuleSelection.moduleConfig,
              },
            ],
          });
        } catch (err) {
          throw new Error(`Failed to create config: ${err instanceof Error ? err.message : String(err)}`);
        }

        // createConfig succeeded but createRun failed — leave a clear
        // breadcrumb so the operator knows the server holds an orphan
        // config. There's no deleteConfig API; the operator must clean
        // it up from the server side. Invalidate configs so the list
        // view (when present) reflects the new orphan.
        try {
          const run = await createRun(mode, config.id);
          return { type: "start" as const, runId: run.id };
        } catch (err) {
          void queryClient.invalidateQueries({ queryKey: ["configs"] });
          const reason = err instanceof Error ? err.message : String(err);
          throw new Error(`Config ${config.id} was created on the server but the run could not be started (${reason}). The config is now an orphan — clean it up from the server.`);
        }
      }
      await cancelRun(activeRunId);
      return { type: "stop" as const, runId: activeRunId };
    },
    onSuccess: (result) => {
      setRunError(null);
      if (result.type === "start") {
        setActiveRunId(result.runId);
        setIsRunning(true);
        setRunningSince(Date.now());
      } else {
        setIsRunning(false);
        setActiveRunId(null);
        setRunningSince(null);
      }
      void queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
    onError: (error) => {
      setRunError(error instanceof Error ? error.message : "Unable to start run.");
    },
  });

  const lockNavigation = useMemo(() => isRunning, [isRunning]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Skip all app hotkeys when the user is typing in an editable element.
      // Without this, Space toggles runs while a <select> is open, and "1"/
      // "2"/"3"/"4" silently flips the global mode while typing in any
      // input. The set of editable tags matches the WHATWG editable-element
      // definition: form fields, <select>, contenteditable, ARIA textboxes.
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        target?.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.getAttribute("role") === "textbox" ||
        target?.getAttribute("role") === "combobox";

      if (isEditable) return;

      if (event.key === "?" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setShowHelp(true);
        return;
      }

      if (event.key === "[" || event.key === "]") {
        event.preventDefault();
        setSidebarCollapsed(event.key === "[");
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusModuleSearch();
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        runMutation.mutate();
        return;
      }

      if (isRunning) return;
      const nextMode = modeFromHotkey(event.key);
      if (nextMode) {
        event.preventDefault();
        setMode(nextMode);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusModuleSearch, isRunning, runMutation, setMode, setSidebarCollapsed]);

  // Track the last non-/settings path so lockNavigation can bounce the
  // user back instead of leaving them stranded on the settings page when
  // they hit Start. The ref is updated on every render, but we only
  // redirect when the user lands on a /settings route while locked.
  const lastSafePathRef = useRef<string>(pathname);

  useEffect(() => {
    if (pathname.startsWith("/settings")) return;
    lastSafePathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (lockNavigation && pathname.startsWith("/settings")) {
      // router.replace(pathname) was a no-op. Redirect to the last safe
      // (non-settings) path the user was on. If we don't have one, send
      // them to the dashboard, which is always present.
      const target = lastSafePathRef.current?.startsWith("/settings")
        ? "/dashboard"
        : lastSafePathRef.current || "/dashboard";
      router.replace(target);
    }
  }, [lockNavigation, pathname, router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        mode={mode}
        setMode={(nextMode) => {
          if (!isRunning) setMode(nextMode);
        }}
        isRunning={isRunning}
        runningSince={runningSince}
        onStartStop={() => runMutation.mutate()}
      />

      {runError && (
        <div className="sticky top-[var(--shell-header-height)] z-20 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {runError}
        </div>
      )}

      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          locked={lockNavigation}
          search={search}
          setSearch={setSearch}
          onRegisterSearchFocus={registerModuleSearchFocus}
        />

        <main className="min-h-[calc(100vh-var(--shell-header-height))] flex-1 overflow-auto p-5">{children}</main>
      </div>

      <HelpShortcutsDialog open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
