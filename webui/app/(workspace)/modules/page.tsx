"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Cpu, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { getModules, getRuns, getRunResults } from "@/lib/api";
import { modulesForOfflineDisplay, writeCachedModules } from "@/lib/modules/catalog";
import { PLATFORM_SLUG } from "@/lib/platform";

interface ModuleSummary {
    lastRun: string; // ISO timestamp of the most recent test result
    anyFailed: boolean;
}

function formatRunTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const MODULE_ENABLED_PREFIX = `${PLATFORM_SLUG}.module-enabled.`;

function loadAllModuleEnabled(moduleIds: string[]): Record<string, boolean> {
    return Object.fromEntries(
        moduleIds.map((id) => {
            const raw = typeof window !== "undefined"
                ? window.localStorage.getItem(MODULE_ENABLED_PREFIX + id)
                : null;
            return [id, raw === null ? true : raw === "true"];
        }),
    );
}

function ModulesContent() {
    const { data: liveModules, isLoading, isError, refetch } = useQuery({
        queryKey: ["modules"],
        queryFn: getModules,
    });

    useEffect(() => {
        if (liveModules && liveModules.length > 0) writeCachedModules(liveModules);
    }, [liveModules]);

    const modules = useMemo(() => modulesForOfflineDisplay(liveModules), [liveModules]);

    // Fetch recent runs to find the latest completed one
    const { data: runsData } = useQuery({
        queryKey: ["runs", "modules-index"],
        queryFn: () => getRuns({ limit: 20 }),
        refetchInterval: 30_000,
    });

    const latestRun = useMemo(() => {
        return runsData?.runs?.find((r) => {
            const s = r.status?.toLowerCase() ?? "";
            return s.includes("complete") || s.includes("pass") || s.includes("fail") || s.includes("error");
        }) ?? runsData?.runs?.[0] ?? null;
    }, [runsData]);

    // Fetch all results for that run (no module filter) to build per-module summaries
    const { data: latestResultsData } = useQuery({
        queryKey: ["run-results-all", latestRun?.id],
        queryFn: () => getRunResults(latestRun!.id, { limit: 2000 }),
        enabled: Boolean(latestRun?.id),
    });

    const moduleSummary = useMemo((): Record<string, ModuleSummary> => {
        if (!latestResultsData?.results) return {};
        const map: Record<string, ModuleSummary> = {};
        for (const result of latestResultsData.results) {
            const mid = result.module_id;
            if (!mid) continue;
            const failed = result.status?.toLowerCase().includes("fail") || result.status?.toLowerCase().includes("error");
            if (!map[mid]) {
                map[mid] = { lastRun: result.timestamp, anyFailed: failed };
            } else {
                if (failed) map[mid].anyFailed = true;
                if (result.timestamp > map[mid].lastRun) map[mid].lastRun = result.timestamp;
            }
        }
        return map;
    }, [latestResultsData]);

    const [search, setSearch] = useState("");
    const [moduleEnabledOverrides, setModuleEnabledOverrides] = useState<Record<string, boolean>>({});

    const searchParams = useSearchParams();
    const urlFilter = searchParams.get("filter") ?? ""; // "disabled" | "failed" | ""

    const storedModuleEnabled = useMemo(() => loadAllModuleEnabled(modules.map((m) => m.id)), [modules]);
    const moduleEnabled = useMemo(
        () => ({ ...storedModuleEnabled, ...moduleEnabledOverrides }),
        [moduleEnabledOverrides, storedModuleEnabled],
    );

    const toggleEnabled = (id: string) => {
        const nextValue = !(moduleEnabled[id] ?? true);
        setModuleEnabledOverrides((prev) => {
            const next = { ...prev, [id]: nextValue };
            if (typeof window !== "undefined") {
                window.localStorage.setItem(MODULE_ENABLED_PREFIX + id, String(nextValue));
            }
            return next;
        });
    };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let base = modules;
        if (urlFilter === "disabled") base = base.filter((m) => moduleEnabled[m.id] === false);
        else if (urlFilter === "failed") base = base.filter((m) => moduleSummary[m.id]?.anyFailed);
        if (!q) return base;
        return base.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.id.toLowerCase().includes(q) ||
                (m.category ?? "").toLowerCase().includes(q) ||
                (m.description ?? "").toLowerCase().includes(q),
        );
    }, [modules, search, urlFilter, moduleEnabled, moduleSummary]);

    const grouped = useMemo(() => {
        const map = new Map<string, typeof filtered>();
        for (const m of filtered) {
            const cat = m.category || "other";
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(m);
        }
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }, [filtered]);

    const enabledCount = useMemo(
        () => modules.filter((m) => moduleEnabled[m.id] !== false).length,
        [modules, moduleEnabled],
    );

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Cpu size={20} className="text-muted-foreground" />
                            <Badge variant={isError ? "warning" : "success"}>{isError ? "Offline inventory" : "Server inventory"}</Badge>
                            <Badge variant="secondary">{enabledCount} / {modules.length} enabled</Badge>
                        </div>
                        <CardTitle className="text-2xl">Modules</CardTitle>
                        <CardDescription>
                            {isError
                                ? "Server modules are unavailable, so cached or baseline module information is shown."
                                : "Server-discovered modules with categories, schema type URLs, versions, and descriptions."}
                        </CardDescription>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {urlFilter && (
                            <Link href="/modules" className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-accent">
                                <X size={12} /> Clear filter: {urlFilter}
                            </Link>
                        )}
                        <div className="relative w-56">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search modules…"
                                className="pl-8"
                            />
                        </div>
                        <Button type="button" variant="outline" onClick={() => void refetch()}>Refresh</Button>
                    </div>
                </CardHeader>
            </Card >

            {search && (
                <p className="text-sm text-muted-foreground">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
                </p>
            )
            }

            {
                isLoading && !modules.length && (
                    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-xl bg-muted" />)}
                    </section>
                )
            }

            {
                !isLoading && filtered.length === 0 && modules.length > 0 && (
                    <div className="py-10 text-center text-muted-foreground">No modules match &ldquo;{search}&rdquo;</div>
                )
            }

            <div className="space-y-8">
                {grouped.map(([category, mods]) => (
                    <section key={category}>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{category.replace(/_/g, " ")}</span>
                            <Badge variant="secondary" className="rounded-full px-2 text-xs tabular-nums">{mods.length}</Badge>
                            <span className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {mods.map((module) => {
                                const enabled = moduleEnabled[module.id] !== false;
                                const summary = moduleSummary[module.id] ?? null;
                                return (
                                    <Card key={module.id} className={cn("h-full transition-colors", !enabled && "opacity-60")}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {!enabled && <Badge variant="destructive">Disabled</Badge>}
                                                    {summary && (
                                                        <Badge variant={summary.anyFailed ? "destructive" : "success"}>
                                                            {summary.anyFailed ? "Test failed" : "Test passed"}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Switch
                                                        checked={enabled}
                                                        onClick={(e) => { e.preventDefault(); toggleEnabled(module.id); }}
                                                        aria-label={enabled ? "Disable module" : "Enable module"}
                                                    />
                                                    <Link href={`/modules/${module.id}`} onClick={(e) => e.stopPropagation()}>
                                                        <ArrowRight size={16} className="text-muted-foreground hover:text-foreground" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <CardTitle>{module.name || module.id}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {module.description || "No module description supplied by the server."}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-xs text-muted-foreground">
                                            <div className="flex justify-between gap-3"><span>Version</span><span>{module.version || "n/a"}</span></div>
                                            <div className="flex justify-between gap-3">
                                                <span>Last test run</span>
                                                <span>{summary ? formatRunTime(summary.lastRun) : "No runs yet"}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div >
    );
}

export default function ModulesIndexPage() {
    return (
        <Suspense>
            <ModulesContent />
        </Suspense>
    );
}