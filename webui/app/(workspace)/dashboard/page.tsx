"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Cpu, FileText, FlaskConical, RadioTower, Server, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getGlobalLogs, getModules, getRuns, getRunResults, getTarget } from "@/lib/api";
import { modulesForOfflineDisplay, testsForModule, writeCachedModules } from "@/lib/modules/catalog";
import { statusVariant } from "@/lib/utils";
import { useAppShell } from "@/state/app-shell-context";
import { PLATFORM_SLUG } from "@/lib/platform";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const CHART_COLOR_PREFS = {
    default: {
        pass: "#16a34a",
        fail: "#dc2626",
        running: "#d97706",
        default: "#94a3b8",
        category: "#6366f1",
    },
    pastel: {
        pass: "#4ade80",
        fail: "#fb7185",
        running: "#fbbf24",
        default: "#cbd5e1",
        category: "#38bdf8",
    },
    "high-contrast": {
        pass: "#15803d",
        fail: "#b91c1c",
        running: "#a16207",
        default: "#475569",
        category: "#1d4ed8",
    },
} as const;

// ROLLING_WINDOWS and CHART_COLOR_KEYS stay in lockstep with the prefs
// stored by usePref in app/(workspace)/settings/page.tsx. Anything not in
// these unions falls back to the default — the read path is the only
// place that needs to defend against stale or hand-edited storage.
type RollingWindowKey = "1h" | "6h" | "24h";
type ChartColorKey = keyof typeof CHART_COLOR_PREFS;
const ROLLING_WINDOWS: Record<RollingWindowKey, number> = { "1h": 1, "6h": 6, "24h": 24 };
const ROLLING_WINDOW_KEYS = Object.keys(ROLLING_WINDOWS) as RollingWindowKey[];

function isRollingWindowKey(v: unknown): v is RollingWindowKey {
    return typeof v === "string" && (ROLLING_WINDOW_KEYS as string[]).includes(v);
}
function isChartColorKey(v: unknown): v is ChartColorKey {
    return typeof v === "string" && v in CHART_COLOR_PREFS;
}

function readStoredPref<T>(key: string, guard: (v: unknown) => v is T, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return fallback;
        const parsed: unknown = JSON.parse(raw);
        return guard(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function readChartPrefs() {
    const chartColors = readStoredPref<ChartColorKey>(
        `${PLATFORM_SLUG}.prefs.chartColors`,
        isChartColorKey,
        "default",
    );
    const rollingWindow = readStoredPref<RollingWindowKey>(
        `${PLATFORM_SLUG}.prefs.rollingWindow`,
        isRollingWindowKey,
        "6h",
    );
    return {
        colors: CHART_COLOR_PREFS[chartColors],
        rollingWindowHours: ROLLING_WINDOWS[rollingWindow],
    };
}

export default function DashboardPage() {
    const { serverOnline } = useAppShell();
    const router = useRouter();
    const [chartPrefs] = useState(() => readChartPrefs());
    const runHistoryLimit = chartPrefs.rollingWindowHours === 1 ? 5 : chartPrefs.rollingWindowHours === 24 ? 20 : 15;
    const target = useQuery({ queryKey: ["target"], queryFn: getTarget, retry: 1, refetchInterval: 15_000 });
    const liveModules = useQuery({ queryKey: ["modules"], queryFn: getModules });
    const runs = useQuery({ queryKey: ["runs", "dashboard"], queryFn: () => getRuns({ limit: 20 }), refetchInterval: 15_000, enabled: serverOnline !== false });
    const logs = useQuery({ queryKey: ["logs", "dashboard"], queryFn: () => getGlobalLogs({ limit: 8 }), refetchInterval: 15_000, enabled: serverOnline !== false });

    useEffect(() => {
        if (liveModules.data && liveModules.data.length > 0) writeCachedModules(liveModules.data);
    }, [liveModules.data]);

    const modules = useMemo(() => modulesForOfflineDisplay(liveModules.data), [liveModules.data]);
    const latestRun = runs.data?.runs?.[0] ?? null;

    // Per-module test counts from local HAL catalog
    const moduleTestCounts = useMemo(
        () => Object.fromEntries(modules.map((m) => [m.id, testsForModule(m).length])),
        [modules],
    );
    const totalTests = useMemo(() => modules.reduce((s, m) => s + (moduleTestCounts[m.id] ?? 0), 0), [modules, moduleTestCounts]);

    // Subscribe to localStorage 'storage' events so the map updates when
    // the user toggles a module on the modules index page in another tab
    // or in the same tab. The storage event fires for *other* documents
    // only; for same-tab updates we also re-read on visibility change.
    const [storageTick, setStorageTick] = useState(0);
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key.startsWith(`${PLATFORM_SLUG}.module-enabled.`)) {
                setStorageTick((t) => t + 1);
            }
        };
        const onVisible = () => {
            if (document.visibilityState === "visible") setStorageTick((t) => t + 1);
        };
        window.addEventListener("storage", onStorage);
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            window.removeEventListener("storage", onStorage);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    const moduleEnabledMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        for (const m of modules) {
            const raw = typeof window === "undefined" ? null : window.localStorage.getItem(`${PLATFORM_SLUG}.module-enabled.${m.id}`);
            map[m.id] = raw === null ? true : raw === "true";
        }
        return map;
        // storageTick re-triggers the read whenever a 'storage' event fires
        // or the tab regains focus.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules, storageTick]);
    const enabledModuleCount = modules.filter((m) => moduleEnabledMap[m.id] !== false).length;

    // Latest run results for pass/fail stats
    const { data: latestResultsData } = useQuery({
        queryKey: ["run-results-all-dashboard", latestRun?.id],
        queryFn: () => getRunResults(latestRun!.id, { limit: 2000 }),
        enabled: Boolean(latestRun?.id) && serverOnline !== false,
    });

    const runResultStats = useMemo(() => {
        const results = latestResultsData?.results;
        if (!results?.length) return null;
        const pass = results.filter((r) => r.status?.toLowerCase().includes("pass")).length;
        const fail = results.filter((r) => r.status?.toLowerCase().includes("fail") || r.status?.toLowerCase().includes("error")).length;
        return { pass, fail, total: results.length };
    }, [latestResultsData]);

    // Per-module result status from latest run
    const moduleResultStatus = useMemo(() => {
        const map: Record<string, { anyFailed: boolean }> = {};
        for (const r of latestResultsData?.results ?? []) {
            if (!r.module_id) continue;
            if (!map[r.module_id]) map[r.module_id] = { anyFailed: false };
            if (r.status?.toLowerCase().includes("fail") || r.status?.toLowerCase().includes("error")) {
                map[r.module_id].anyFailed = true;
            }
        }
        return map;
    }, [latestResultsData]);

    const resultBreakdown = useMemo(() => {
        if (!runResultStats) return null;
        const other = runResultStats.total - runResultStats.pass - runResultStats.fail;
        return [
            { name: "Pass", value: runResultStats.pass },
            { name: "Fail", value: runResultStats.fail },
            ...(other > 0 ? [{ name: "Other", value: other }] : []),
        ].filter((d) => d.value > 0);
    }, [runResultStats]);

    const runHistoryBars = useMemo(
        () =>
            (runs.data?.runs ?? [])
                .slice(0, runHistoryLimit)
                .reverse()
                .map((run, i) => ({
                    i: i + 1,
                    value: 1,
                    status: run.status?.toLowerCase() ?? "unknown",
                    label: new Date(run.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                })),
        [runHistoryLimit, runs.data],
    );

    const moduleCategoryDist = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const m of modules) {
            const cat = m.category || "other";
            counts[cat] = (counts[cat] ?? 0) + 1;
        }
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [modules]);

    const PAGE_SIZE = 10;
    const [inventoryPage, setInventoryPage] = useState(0);
    const pageCount = Math.ceil(modules.length / PAGE_SIZE);
    const pagedModules = modules.slice(inventoryPage * PAGE_SIZE, (inventoryPage + 1) * PAGE_SIZE);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant={serverOnline ? "success" : "destructive"}>{serverOnline ? "Server online" : "Server offline"}</Badge>
                            <Badge variant={statusVariant(target.data?.status)}>{target.data?.status ?? "Target unknown"}</Badge>
                        </div>
                        <CardTitle className="text-3xl">Zion IV&V Dashboard</CardTitle>
                        <CardDescription className="mt-2 max-w-3xl">
                            Single-target operator view for module inventory, run state, recent evidence, logs, and system identity.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/modules"><Button type="button" variant="outline">All modules <ArrowRight size={16} /></Button></Link>
                        <Link href="/runs"><Button type="button" variant="outline">Run history <Activity size={16} /></Button></Link>
                        <Link href="/logs"><Button type="button" variant="secondary">Logs <FileText size={16} /></Button></Link>
                    </div>
                </CardHeader>
            </Card>

            {/* ── Stats row ── */}
            {liveModules.isLoading && !modules.length ? (
                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}
                </section>
            ) : (
                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push("/modules")}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") router.push("/modules"); }}
                        className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <CardHeader className="pb-2">
                            <CardDescription>Modules</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl"><Cpu size={24} />{modules.length}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-xs text-muted-foreground">
                            <span className="text-success font-medium">{enabledModuleCount} enabled</span>
                            {" · "}
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push("/modules?filter=disabled"); }}
                                className={modules.length - enabledModuleCount > 0 ? "text-destructive font-medium hover:underline" : ""}
                            >
                                {modules.length - enabledModuleCount} disabled
                            </button>
                        </CardContent>
                    </Card>

                    <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push("/modules")}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") router.push("/modules"); }}
                        className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <CardHeader className="pb-2">
                            <CardDescription>Tests</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl"><FlaskConical size={24} />{totalTests}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-xs text-muted-foreground">
                            across {modules.length} modules
                        </CardContent>
                    </Card>

                    <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push("/runs")}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") router.push("/runs"); }}
                        className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <CardHeader className="pb-2">
                            <CardDescription>Last Run</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Activity size={22} />
                                {latestRun
                                    ? <Badge variant={statusVariant(latestRun.status)}>{latestRun.status}</Badge>
                                    : <span className="text-muted-foreground text-base">No runs</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-xs">
                            {runResultStats ? (
                                <span>
                                    <span className="text-success font-medium">{runResultStats.pass} passed</span>
                                    {" · "}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push("/modules?filter=failed"); }}
                                        className={runResultStats.fail > 0 ? "text-destructive font-medium hover:underline" : "text-muted-foreground"}
                                    >
                                        {runResultStats.fail} failed
                                    </button>
                                    <span className="text-muted-foreground"> of {runResultStats.total}</span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">No result data</span>
                            )}
                        </CardContent>
                    </Card>

                    <Card
                        role="link"
                        tabIndex={0}
                        onClick={() => router.push("/settings")}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") router.push("/settings"); }}
                        className="cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <CardHeader className="pb-2">
                            <CardDescription>Server version</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-xl"><Server size={22} />{serverOnline ? (liveModules.data ? "Online" : "—") : "Offline"}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-xs text-muted-foreground font-mono">
                            {target.data?.hal_version ? `HAL ${target.data.hal_version}` : target.data?.client_version ? `Client ${target.data.client_version}` : "No version info"}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ── Charts row ── */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* Latest Run Results — Donut */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Latest Run Results</CardTitle>
                        <CardDescription className="text-xs">Pass / fail breakdown from the most recent run</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {resultBreakdown ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={resultBreakdown}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={46}
                                        outerRadius={72}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {resultBreakdown.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={entry.name === "Pass" ? chartPrefs.colors.pass : entry.name === "Fail" ? chartPrefs.colors.fail : chartPrefs.colors.default}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="grid h-44 place-items-center text-sm text-muted-foreground">No result data yet.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Runs Timeline */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Recent Runs</CardTitle>
                        <CardDescription className="text-xs">Status of last {runHistoryBars.length} runs (newest right)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {runHistoryBars.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={runHistoryBars} barSize={14} barGap={3}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#64748b22" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                                    <YAxis hide domain={[0, 1.2]} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (!active || !payload?.length) return null;
                                            const d = payload[0].payload as { label: string; status: string };
                                            return (
                                                <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-lg">
                                                    <div className="font-medium">{d.label}</div>
                                                    <div className="capitalize text-muted-foreground">{d.status}</div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                                        {runHistoryBars.map((entry) => (
                                            <Cell key={entry.i} fill={chartPrefs.colors[entry.status as keyof typeof chartPrefs.colors] ?? chartPrefs.colors.default} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="grid h-44 place-items-center text-sm text-muted-foreground">No run history yet.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Module Category Breakdown */}
                <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Module Categories</CardTitle>
                        <CardDescription className="text-xs">Modules per category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {moduleCategoryDist.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart
                                    data={moduleCategoryDist}
                                    layout="vertical"
                                    barSize={12}
                                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#64748b22" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={76} />
                                    <Tooltip formatter={(v) => [v, "modules"]} />
                                    <Bar dataKey="count" fill={chartPrefs.colors.category} radius={[0, 3, 3, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="grid h-44 place-items-center text-sm text-muted-foreground">No module data yet.</div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* ── Main layout ── */}
            <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Module Inventory</CardTitle>
                        <CardDescription>{liveModules.isError ? "Showing cached or baseline modules while the server is unreachable." : "Server-discovered modules — test counts from local HAL catalog, results from latest run."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Module</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Tests</TableHead>
                                    <TableHead>Last result</TableHead>
                                    <TableHead>Enabled</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagedModules.map((module) => {
                                    const testCount = moduleTestCounts[module.id] ?? 0;
                                    const enabled = moduleEnabledMap[module.id] !== false;
                                    const result = moduleResultStatus[module.id] ?? null;
                                    return (
                                        <TableRow key={module.id}>
                                            <TableCell>
                                                <Link href={`/modules/${module.id}`} className="font-semibold text-primary hover:underline">{module.name || module.id}</Link>
                                                <div className="text-xs text-muted-foreground">{module.id}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{module.category || "Module"}</Badge></TableCell>
                                            <TableCell className="text-sm">{testCount}</TableCell>
                                            <TableCell>
                                                {result ? (
                                                    result.anyFailed
                                                        ? <span className="flex items-center gap-1 text-xs text-destructive"><XCircle size={13} />Failed</span>
                                                        : <span className="flex items-center gap-1 text-xs text-success"><CheckCircle2 size={13} />Passed</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={enabled ? "success" : "destructive"}>{enabled ? "On" : "Off"}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {pageCount > 1 && (
                            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                                <span>{inventoryPage * PAGE_SIZE + 1}–{Math.min((inventoryPage + 1) * PAGE_SIZE, modules.length)} of {modules.length}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={inventoryPage === 0}
                                        onClick={() => setInventoryPage((p) => p - 1)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="px-2">{inventoryPage + 1} / {pageCount}</span>
                                    <button
                                        type="button"
                                        disabled={inventoryPage >= pageCount - 1}
                                        onClick={() => setInventoryPage((p) => p + 1)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Target</CardTitle>
                            <CardDescription>{target.data?.hostname ?? "No connected target identity reported."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">Model</span><span className="font-medium">{target.data?.model ?? "Unknown"}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">OS</span><span className="font-medium">{target.data?.os_version ?? "Unknown"}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">HAL</span><span className="font-medium">{target.data?.hal_version ?? "Unknown"}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">Client</span><span className="font-medium">{target.data?.client_version ?? "Unknown"}</span></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Run</CardTitle>
                            <CardDescription>{latestRun?.id ?? "No run history loaded."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Status</span><Badge variant={statusVariant(latestRun?.status)}>{latestRun?.status ?? "None"}</Badge></div>
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">Mode</span><span className="font-medium">{latestRun?.mode ?? "n/a"}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-muted-foreground">Created</span><span className="font-medium">{latestRun?.created_at ? new Date(latestRun.created_at).toLocaleString() : "n/a"}</span></div>
                            {runResultStats && (
                                <>
                                    <Separator />
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Passed</span>
                                        <span className="flex items-center gap-1 font-medium text-success"><CheckCircle2 size={13} />{runResultStats.pass}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Failed</span>
                                        <span className={`flex items-center gap-1 font-medium ${runResultStats.fail > 0 ? "text-destructive" : "text-muted-foreground"}`}><XCircle size={13} />{runResultStats.fail}</span>
                                    </div>
                                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">Total results</span><span className="font-medium">{runResultStats.total}</span></div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><RadioTower size={18} /> Recent Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {(logs.data?.logs ?? []).slice(0, 5).map((entry, index) => (
                                <div key={entry.id || `${entry.source ?? ""}-${entry.level ?? entry.severity ?? ""}-${index}-${entry.timestamp}-${entry.message}`} className="text-sm">
                                    <div className="flex items-center gap-2"><Badge variant={statusVariant(entry.level || entry.severity)}>{entry.level || entry.severity || "info"}</Badge><span className="text-xs text-muted-foreground">{entry.source || "system"}</span></div>
                                    <p className="mt-1 line-clamp-2 text-foreground">{entry.message}</p>
                                    <Separator className="mt-2" />
                                </div>
                            ))}
                            {(logs.data?.logs ?? []).length === 0 && <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground"><AlertTriangle size={16} /> No logs available.</div>}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

