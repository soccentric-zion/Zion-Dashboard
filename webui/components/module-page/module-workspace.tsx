"use client";

import { useQuery } from "@tanstack/react-query";
import { cn, formatClock, formatDuration, formatRunDuration, resultVariant, statusVariant } from "@/lib/utils";
import { Activity, ChevronDown, Settings2 } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getRunResults, getRuns } from "@/lib/api";
import { testsForModule, type ModuleTestDefinition, type ModuleTestField } from "@/lib/modules/catalog";
import { parseSsePayload, openSse } from "@/lib/sse";
import type { ExecutionMode, ModuleInfo, Run, RunEventState, TestResult } from "@/lib/types/api";
import { useAppShell } from "@/state/app-shell-context";
import { PLATFORM_SLUG } from "@/lib/platform";



function numericMetricFromResult(result: TestResult): number | null {
  const candidates = [result.monitoring, result.metrics, result.event];
  for (const map of candidates) {
    for (const value of Object.values(map ?? {})) {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
  }
  return null;
}

function toChartRows(results: TestResult[]) {
  return results
    .map((result) => {
      return {
        t: formatClock(result.timestamp),
        ts: new Date(result.timestamp).getTime(),
        value: numericMetricFromResult(result),
      };
    })
    .filter((row): row is { t: string; ts: number; value: number } => row.value !== null)
    .sort((a, b) => a.ts - b.ts);
}

type TestValue = boolean | number | string;
type TestPlanState = Record<string, { enabled: boolean; fields: Record<string, TestValue> }>;

function testPlanStorageKey(moduleId: string): string {
  return `${PLATFORM_SLUG}.module-tests.${moduleId}`;
}

function moduleEnabledStorageKey(moduleId: string): string {
  return `${PLATFORM_SLUG}.module-enabled.${moduleId}`;
}

function loadModuleEnabled(moduleId: string): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(moduleEnabledStorageKey(moduleId));
  return raw === null ? true : raw === "true";
}

function initialTestPlan(moduleId: string, tests: ModuleTestDefinition[]): TestPlanState {
  const defaults = Object.fromEntries(
    tests.map((test) => [
      test.id,
      {
        enabled: true,
        fields: Object.fromEntries(test.fields.map((field) => [field.key, field.defaultValue])),
      },
    ]),
  ) as TestPlanState;

  if (typeof window === "undefined") return defaults;

  try {
    const raw = window.localStorage.getItem(testPlanStorageKey(moduleId));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as TestPlanState;
    return {
      ...defaults,
      ...Object.fromEntries(
        tests.map((test) => [
          test.id,
          {
            enabled: parsed[test.id]?.enabled ?? defaults[test.id].enabled,
            fields: { ...defaults[test.id].fields, ...(parsed[test.id]?.fields ?? {}) },
          },
        ]),
      ),
    };
  } catch {
    return defaults;
  }
}

function modeLabel(mode: ExecutionMode): string {
  if (mode === "single_shot") return "One-shot";
  if (mode === "monitoring") return "Monitoring";
  if (mode === "event") return "Event";
  return "Long-run";
}



export function ModuleWorkspace({ module }: { module: ModuleInfo }) {
  const {
    mode,
    isRunning,
    activeRunId,
    reviewingRunId,
    setReviewingRunId,
    setIsRunning,
    setActiveRunId,
    setActiveModuleSelection,
    serverOnline,
  } = useAppShell();

  const [liveResults, setLiveResults] = useState<TestResult[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const moduleTests = useMemo(() => testsForModule(module), [module]);
  const [testPlan, setTestPlan] = useState<TestPlanState>(() => initialTestPlan(module.id, moduleTests));
  const [moduleEnabled, setModuleEnabled] = useState<boolean>(() => loadModuleEnabled(module.id));
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const selectTest = (id: string) => setSelectedTestId((prev) => (prev === id ? null : id));

  const toggleExpand = (testId: string) => {
    setExpandedTests((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) next.delete(testId);
      else next.add(testId);
      return next;
    });
  };

  const { data: runsData } = useQuery({
    queryKey: ["runs", module.id],
    queryFn: () => getRuns({ limit: 40 }),
    refetchInterval: 15_000,
    enabled: serverOnline !== false,
    retry: 0,
  });

  const moduleRuns = useMemo(() => {
    // Include legacy/older runs whose `mode` is null or empty under any
    // selected mode, otherwise they silently disappear from the module's
    // "Previous Runs" table even though they remain visible on the
    // dashboard.
    return (runsData?.runs ?? []).filter((run) => {
      return !run.mode || !mode || run.mode === mode;
    });
  }, [mode, runsData?.runs]);

  const selectedRunId = reviewingRunId ?? activeRunId ?? moduleRuns[0]?.id ?? null;

  const { data: selectedResultsData, refetch: refetchResults } = useQuery({
    queryKey: ["run-results", selectedRunId, module.id],
    queryFn: () => getRunResults(selectedRunId as string, { moduleId: module.id, limit: 500 }),
    enabled: Boolean(selectedRunId) && serverOnline !== false,
    refetchInterval: isRunning ? 5000 : false,
    retry: 0,
  });

  // SSE source lifecycle is bound to activeRunId only — NOT to isRunning.
  // The previous design listed isRunning as a dep, so when the 'state'
  // event handler called setIsRunning(running) the effect re-ran, its
  // cleanup closed the source, and late 'result' events for the same
  // run were lost. Closing is now keyed solely on activeRunId becoming
  // null (real run end or navigation) or component unmount.
  const sourceRef = useRef<EventSource | null>(null);
  useEffect(() => {
    if (!activeRunId) {
      sourceRef.current?.close();
      sourceRef.current = null;
      return;
    }

    const source = openSse(`/api/v1/runs/${activeRunId}/events`);
    sourceRef.current = source;

    source.addEventListener("state", (event) => {
      const payload = parseSsePayload<RunEventState>((event as MessageEvent).data);
      if (!payload) return;
      const running = payload.status.toLowerCase().includes("running");
      setIsRunning(running);
      if (!running) {
        // Don't close the source here — let the activeRunId effect's
        // cleanup handle that when activeRunId is cleared below. In
        // between, late 'result' events for this run still flow into
        // setLiveResults and are then captured by refetchResults().
        setActiveRunId(null);
        void refetchResults();
      }
    });

    source.addEventListener("result", (event) => {
      const payload = parseSsePayload<TestResult>((event as MessageEvent).data);
      if (!payload) return;
      if (payload.module_id !== module.id) return;
      setLiveResults((prev) => [payload, ...prev].slice(0, 1000));
    });

    // Do NOT close the source on error. EventSource auto-reconnects on
    // transient network blips; closing here would drop the next batch of
    // 'result' events. We still listen for errors so a future UI status
    // (e.g. "reconnecting…") can be wired up.

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, [activeRunId, module.id, refetchResults, setActiveRunId, setIsRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    window.localStorage.setItem(testPlanStorageKey(module.id), JSON.stringify(testPlan));
  }, [module.id, testPlan]);

  useEffect(() => {
    window.localStorage.setItem(moduleEnabledStorageKey(module.id), String(moduleEnabled));
  }, [module.id, moduleEnabled]);

  const toggleModuleEnabled = () => {
    if (isRunning) return;
    setModuleEnabled((prev) => !prev);
  };

  const setTestEnabled = (testId: string, enabled: boolean) => {
    setTestPlan((previous) => ({
      ...previous,
      [testId]: { ...previous[testId], enabled },
    }));
  };

  const setFieldValue = (testId: string, field: ModuleTestField, value: TestValue) => {
    setTestPlan((previous) => ({
      ...previous,
      [testId]: {
        ...previous[testId],
        fields: {
          ...previous[testId].fields,
          [field.key]: value,
        },
      },
    }));
  };

  const activeEnabledTests = useMemo(() => {
    return moduleTests.filter((test) => test.modes.includes(mode) && (testPlan[test.id]?.enabled ?? true));
  }, [mode, moduleTests, testPlan]);

  const activeModuleConfig = useMemo(() => {
    return {
      test_names: activeEnabledTests.map((test) => String(testPlan[test.id]?.fields.test_names ?? test.id)),
      tests: Object.fromEntries(
        activeEnabledTests.map((test) => [
          test.id,
          {
            enabled: true,
            ...testPlan[test.id]?.fields,
          },
        ]),
      ),
    };
  }, [activeEnabledTests, testPlan]);

  useEffect(() => {
    if (!moduleEnabled) {
      setActiveModuleSelection(null);
      return;
    }
    setActiveModuleSelection({
      moduleId: module.id,
      moduleName: module.name || module.id,
      configTypeUrl: module.config_type_url,
      enabledTestNames: activeModuleConfig.test_names,
      moduleConfig: activeModuleConfig,
    });
    // No cleanup here. The previous effect ran a cleanup that called
    // setActiveModuleSelection(null), but because activeModuleConfig is
    // recomputed on every testPlan change, the cleanup fired on every
    // field toggle, briefly nulling the selection and tripping the
    // run-start precondition. Unmount-only cleanup is in the effect
    // below.
  }, [activeModuleConfig, module.config_type_url, module.id, module.name, moduleEnabled, setActiveModuleSelection]);

  // Unmount-only cleanup: clear the global selection when this workspace
  // is removed from the tree (e.g. navigating to a different module or
  // route). This is the single place that nulls the selection.
  useEffect(() => {
    return () => setActiveModuleSelection(null);
  }, [setActiveModuleSelection]);

  const mergedResults = useMemo(() => {
    const base = selectedResultsData?.results ?? [];
    if (!isRunning) return base;
    return [...liveResults, ...base];
  }, [isRunning, liveResults, selectedResultsData?.results]);

  // Latest result per test_id for inline status
  const testLatestResult = useMemo(() => {
    const map: Record<string, TestResult> = {};
    for (const r of mergedResults) {
      if (!r.test_id) continue;
      if (!map[r.test_id] || r.timestamp > map[r.test_id].timestamp) {
        map[r.test_id] = r;
      }
    }
    return map;
  }, [mergedResults]);

  const viewResults = useMemo(() => {
    if (!selectedTestId) return mergedResults;
    return mergedResults.filter((r) => r.test_id === selectedTestId);
  }, [mergedResults, selectedTestId]);

  const viewChartData = useMemo(() => {
    const all = toChartRows(viewResults);
    if (mode !== "monitoring" && mode !== "long_run") return all;
    return all.filter((row) => now - row.ts <= 60_000);
  }, [viewResults, mode, now]);

  const viewLatest = viewResults[0] ?? null;

  const runningStatus = isRunning
    ? `Running in ${mode} · ${mergedResults.length} samples`
    : `Idle · Last run ${moduleRuns[0] ? formatClock(moduleRuns[0].created_at) : "never"}`;

  return (
    <div className="space-y-5">
      {/* ── Module header ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-start gap-6">
            {/* Left: identity */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{module.category || "Module"}</Badge>
                <Badge variant={isRunning ? "warning" : "secondary"}>
                  {isRunning ? "Running" : "Idle"}
                </Badge>
                <Badge variant={!moduleEnabled ? "destructive" : activeEnabledTests.length > 0 ? "success" : "destructive"}>
                  {!moduleEnabled ? "Module disabled" : `${activeEnabledTests.length}/${moduleTests.length} tests enabled`}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {module.name || module.id}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {module.description || "No description was reported for this module."}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span><span className="font-medium text-foreground">ID</span> <span className="font-mono">{module.id}</span></span>
                <span><span className="font-medium text-foreground">Version</span> {module.version || "n/a"}</span>
                <span>{runningStatus}</span>
              </div>
            </div>

            {/* Module enable/disable */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-6 py-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Module</span>
              <Switch
                checked={moduleEnabled}
                disabled={isRunning}
                onClick={toggleModuleEnabled}
                aria-label={moduleEnabled ? "Disable module" : "Enable module"}
              />
              <span className={cn("text-xs font-semibold", moduleEnabled ? "text-success" : "text-destructive")}>
                {moduleEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Reviewing run banner ─────────────────────────────────────── */}
      {reviewingRunId && (
        <div className="flex items-center justify-between rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm">
          <span className="text-warning">
            Reviewing run {reviewingRunId.slice(0, 8)}…
          </span>
          <button
            type="button"
            onClick={() => setReviewingRunId(null)}
            className="rounded-md bg-warning px-3 py-1 text-xs font-semibold text-warning-foreground hover:bg-warning/90"
          >
            Return to live
          </button>
        </div>
      )}

      {/* ── HAL Tests table ─────────────────────────────────────────── */}
      <Card className={cn(!moduleEnabled && "opacity-60 pointer-events-none")}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>HAL Test Suite</CardTitle>
            {!moduleEnabled ? (
              <Badge variant="destructive">Module disabled — excluded from runs</Badge>
            ) : (
              <Badge variant={activeEnabledTests.length > 0 ? "success" : "destructive"}>
                {activeEnabledTests.length} enabled for {modeLabel(mode)}
              </Badge>
            )}
          </div>
          <CardDescription>
            Toggle tests on/off and configure parameters with ⚙. Click any row to expand its results inline. Greyed rows are not in the current global mode.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-[35%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Test
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Mode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Last run
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Result
                  </th>
                  <th className="w-10 px-2 py-3" />
                  <th className="w-24 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Enabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {moduleTests.map((test) => {
                  const plan = testPlan[test.id];
                  const enabled = plan?.enabled ?? true;
                  const modeCompatible = test.modes.includes(mode);
                  const isExpanded = expandedTests.has(test.id);
                  const hasFields = test.fields.length > 0;
                  const locked = isRunning || !modeCompatible || !enabled;
                  const latestResult = testLatestResult[test.id] ?? null;

                  return (
                    <Fragment key={test.id}>
                      {/* ── Test row ── */}
                      <tr
                        className={cn(
                          "border-b border-border transition-colors cursor-pointer select-none",
                          selectedTestId === test.id
                            ? "bg-accent"
                            : modeCompatible
                              ? "hover:bg-muted/50"
                              : "opacity-50",
                        )}
                        onClick={() => selectTest(test.id)}
                      >
                        {/* Name + description */}
                        <td className="px-4 py-3">
                          <div className="font-semibold">{test.name}</div>
                          <div className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {test.description}
                          </div>
                        </td>

                        {/* Global mode compatibility */}
                        <td className="px-4 py-3">
                          <Badge variant={modeCompatible ? "success" : "secondary"}>
                            {modeLabel(mode)}
                          </Badge>
                        </td>

                        {/* Last run timestamp */}
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {latestResult ? formatClock(latestResult.timestamp) : "—"}
                        </td>

                        {/* Latest result badge */}
                        <td className="px-4 py-3">
                          {latestResult ? (
                            <Badge variant={resultVariant(latestResult.status)}>
                              {latestResult.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Config expand */}
                        <td className="px-2 py-3">
                          {hasFields && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleExpand(test.id); }}
                              title="Configure test parameters"
                              className={cn(
                                "rounded-md p-1.5 transition-colors",
                                isExpanded
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              <Settings2 size={15} />
                            </button>
                          )}
                        </td>

                        {/* Enable/disable switch */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-muted-foreground">
                              {enabled ? "On" : "Off"}
                            </span>
                            <Switch
                              checked={enabled}
                              disabled={isRunning}
                              onClick={(e) => { e.stopPropagation(); setTestEnabled(test.id, !enabled); }}
                              aria-label={`${enabled ? "Disable" : "Enable"} ${test.name}`}
                            />
                          </div>
                        </td>
                      </tr>

                      {/* ── Expanded config row ── */}
                      {isExpanded && hasFields && (
                        <tr
                          key={`${test.id}-config`}
                          className="border-b border-border bg-muted/30"
                        >
                          <td colSpan={6} className="px-6 pb-4 pt-3 animate-expand-down">
                            <div className="flex items-center gap-2 mb-3">
                              <Settings2 size={13} className="text-muted-foreground" />
                              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Configuration — {test.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleExpand(test.id)}
                                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                              >
                                <ChevronDown size={14} className="rotate-180 transition-transform duration-200" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {test.fields.map((field) => {
                                const value = plan?.fields[field.key] ?? field.defaultValue;
                                return (
                                  <label
                                    key={field.key}
                                    className="block text-xs font-medium text-foreground"
                                  >
                                    <span className="mb-1 flex items-center justify-between gap-2">
                                      <span>{field.label}</span>
                                      {field.unit && (
                                        <span className="text-muted-foreground">{field.unit}</span>
                                      )}
                                    </span>
                                    {field.type === "select" ? (
                                      <select
                                        disabled={locked}
                                        value={String(value)}
                                        onChange={(e) =>
                                          setFieldValue(test.id, field, e.target.value)
                                        }
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                                      >
                                        {(field.options ?? []).map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    ) : field.type === "boolean" ? (
                                      <div className="flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3">
                                        <span>{value ? "Enabled" : "Disabled"}</span>
                                        <Switch
                                          checked={Boolean(value)}
                                          disabled={locked}
                                          onClick={() =>
                                            setFieldValue(test.id, field, !value)
                                          }
                                          aria-label={field.label}
                                        />
                                      </div>
                                    ) : (
                                      <Input
                                        disabled={locked}
                                        type={field.type === "number" ? "number" : "text"}
                                        value={String(value)}
                                        onChange={(e) =>
                                          setFieldValue(
                                            test.id,
                                            field,
                                            field.type === "number"
                                              ? Number(e.target.value)
                                              : e.target.value,
                                          )
                                        }
                                      />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Expanded results row ── */}
                      {selectedTestId === test.id && (
                        <tr
                          key={`${test.id}-results`}
                          className="border-b border-border bg-muted/10"
                        >
                          <td colSpan={6} className="px-6 pb-6 pt-4 animate-expand-down">
                            <div className="flex items-center gap-2 mb-4">
                              <Activity size={13} className="text-muted-foreground" />
                              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Results — {test.name}
                              </span>
                              <Badge variant={isRunning ? "warning" : "secondary"} className="text-xs">
                                {viewResults.length} {viewResults.length !== 1 ? "samples" : "sample"}
                              </Badge>
                              <button
                                type="button"
                                onClick={() => selectTest(test.id)}
                                className="ml-auto text-muted-foreground hover:text-foreground"
                              >
                                <ChevronDown size={14} className="rotate-180 transition-transform duration-200" />
                              </button>
                            </div>

                            {/* Latest result detail */}
                            {viewLatest && (
                              <div className={cn(
                                "mb-4 rounded-lg border p-3 text-xs",
                                resultVariant(viewLatest.status) === "success"
                                  ? "border-success/40 bg-success/10"
                                  : resultVariant(viewLatest.status) === "destructive"
                                    ? "border-destructive/40 bg-destructive/10"
                                    : "border-border bg-muted/30",
                              )}>
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <Badge variant={resultVariant(viewLatest.status)}>{viewLatest.status}</Badge>
                                  <span className="text-muted-foreground">{formatClock(viewLatest.timestamp)}</span>
                                  <span className="text-muted-foreground">{formatDuration(viewLatest.duration_ns)}</span>
                                  {viewLatest.severity && <span className="text-muted-foreground">sev: {viewLatest.severity}</span>}
                                </div>
                                {viewLatest.error_message && (
                                  <div className="mb-2 font-mono text-destructive break-all">{viewLatest.error_message}</div>
                                )}
                                {Object.keys(viewLatest.metrics ?? {}).length > 0 && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {Object.entries(viewLatest.metrics).map(([k, v]) => (
                                      <span key={k}><span className="text-muted-foreground">{k}:</span> <span className="font-mono font-medium">{String(v)}</span></span>
                                    ))}
                                  </div>
                                )}
                                {Object.keys(viewLatest.monitoring ?? {}).length > 0 && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    {Object.entries(viewLatest.monitoring).map(([k, v]) => (
                                      <span key={k}><span className="text-muted-foreground">{k}:</span> <span className="font-mono font-medium">{String(v)}</span></span>
                                    ))}
                                  </div>
                                )}
                                {Object.keys(viewLatest.event ?? {}).length > 0 && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    {Object.entries(viewLatest.event).map(([k, v]) => (
                                      <span key={k}><span className="text-muted-foreground">{k}:</span> <span className="font-mono font-medium">{String(v)}</span></span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Chart (monitoring / long_run) */}
                            {(mode === "monitoring" || mode === "long_run") && (
                              <div className="mb-4 h-48 w-full rounded-lg border border-border bg-background p-2">
                                {viewChartData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={viewChartData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#64748b33" />
                                      <XAxis dataKey="t" minTickGap={24} tick={{ fontSize: 10 }} />
                                      <YAxis tick={{ fontSize: 10 }} />
                                      <Tooltip />
                                      <Legend />
                                      <Line type="monotone" dataKey="value" stroke="#0ea5e9" dot={false} isAnimationActive={false} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                ) : (
                                  <div className="grid h-full place-items-center text-sm text-muted-foreground">No numeric samples yet.</div>
                                )}
                              </div>
                            )}

                            {/* Single-shot result */}
                            {mode === "single_shot" && viewLatest && (
                              <div className={cn(
                                "mb-4 rounded-lg border p-3 text-center",
                                viewLatest.status?.toLowerCase() === "pass"
                                  ? "border-success/50 bg-success/10"
                                  : "border-destructive/50 bg-destructive/10",
                              )}>
                                <div className="text-xs text-muted-foreground">Most recent one-shot</div>
                                <div className="mt-1 text-3xl font-bold">
                                  {viewLatest.status.charAt(0).toUpperCase() + viewLatest.status.slice(1).toLowerCase()}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {formatClock(viewLatest.timestamp)} · {formatDuration(viewLatest.duration_ns)}
                                </div>
                              </div>
                            )}

                            {/* Results mini-table */}
                            <div className="mb-4 overflow-auto rounded-lg border border-border">
                              <table className="min-w-full text-xs">
                                <thead className="sticky top-0 bg-muted">
                                  <tr>
                                    <th className="px-2 py-2 text-left">Time</th>
                                    <th className="px-2 py-2 text-left">Status</th>
                                    <th className="px-2 py-2 text-left">Test</th>
                                    <th className="px-2 py-2 text-left">Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {viewResults.slice(0, 200).map((row) => (
                                    <tr key={row.id + String(row.sequence)} className="border-t border-border">
                                      <td className="px-2 py-1.5">{formatClock(row.timestamp)}</td>
                                      <td className="px-2 py-1.5">
                                        <Badge variant={resultVariant(row.status)}>{row.status}</Badge>
                                      </td>
                                      <td className="px-2 py-1.5">{row.name || row.test_id}</td>
                                      <td className="px-2 py-1.5">{String(numericMetricFromResult(row) ?? "—")}</td>
                                    </tr>
                                  ))}
                                  {viewResults.length === 0 && (
                                    <tr>
                                      <td colSpan={4} className="px-2 py-6 text-center text-muted-foreground">No results yet.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Previous Runs */}
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Previous Runs
                              </div>
                              <div className="overflow-auto rounded-lg border border-border">
                                <table className="min-w-full text-xs">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Run ID</th>
                                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Mode</th>
                                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Created</th>
                                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Duration</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {moduleRuns.map((run: Run) => (
                                      <tr
                                        key={run.id}
                                        className={cn(
                                          "cursor-pointer border-t border-border transition-colors hover:bg-muted/50",
                                          reviewingRunId === run.id && "bg-warning/10",
                                        )}
                                        onClick={() => setReviewingRunId(run.id)}
                                      >
                                        <td className="px-3 py-2 font-mono">{run.id.slice(0, 8)}…</td>
                                        <td className="px-3 py-2">{run.mode}</td>
                                        <td className="px-3 py-2">
                                          <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
                                        </td>
                                        <td className="px-3 py-2">{formatClock(run.created_at)}</td>
                                        <td className="px-3 py-2">{formatRunDuration(run.started_at, run.ended_at)}</td>
                                      </tr>
                                    ))}
                                    {moduleRuns.length === 0 && (
                                      <tr>
                                        <td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">No runs yet.</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}

                {moduleTests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No tests available for this module.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

