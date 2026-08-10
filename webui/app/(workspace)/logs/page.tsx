"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGlobalLogs } from "@/lib/api";
import { parseSsePayload, openSse } from "@/lib/sse";
import type { LogEntry } from "@/lib/types/api";
import { useAppShell } from "@/state/app-shell-context";
import { PLATFORM_SLUG } from "@/lib/platform";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const levels = ["", "debug", "info", "warn", "error", "fatal"];
const AUTO_SCROLL_KEY = `${PLATFORM_SLUG}.prefs.autoScroll`;

function tone(level: string) {
    const normalized = level.toLowerCase();
    if (normalized.includes("fatal") || normalized.includes("error")) return "text-destructive";
    if (normalized.includes("warn")) return "text-warning";
    return "text-muted-foreground";
}

export default function LogsPage() {
    const { activeRunId } = useAppShell();
    const [source, setSource] = useState("");
    const [level, setLevel] = useState("");
    const [query, setQuery] = useState("");
    const [autoScroll, setAutoScrollState] = useState(() => {
        if (typeof window === "undefined") return true;
        try {
            const stored = window.localStorage.getItem(AUTO_SCROLL_KEY);
            return stored === null ? true : Boolean(JSON.parse(stored));
        } catch {
            return true;
        }
    });
    const [liveLogs, setLiveLogs] = useState<LogEntry[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const setAutoScroll = (value: boolean) => {
        setAutoScrollState(value);
        try { window.localStorage.setItem(AUTO_SCROLL_KEY, JSON.stringify(value)); } catch { /* ignore */ }
    };

    const { data } = useQuery({
        queryKey: ["logs", source, level, query],
        queryFn: () => getGlobalLogs({ source, level, query, limit: 300 }),
        refetchInterval: 15_000,
    });

    useEffect(() => {
        if (!activeRunId) return;
        const sourceStream = openSse(`/api/v1/runs/${activeRunId}/logs/tail`);
        sourceStream.addEventListener("log", (event) => {
            const payload = parseSsePayload<LogEntry>((event as MessageEvent).data);
            if (payload) setLiveLogs((prev) => [...prev, payload].slice(-500));
        });
        // Don't close on error: EventSource auto-reconnects. Effect cleanup is
        // the single place that closes the source.
        return () => sourceStream.close();
    }, [activeRunId]);

    const logs = useMemo(() => {
        const combined = [...(data?.logs ?? []), ...liveLogs];
        const seen = new Set<string>();
        return combined
            .map((entry, index) => ({ entry, index }))
            .filter(({ entry, index }) => {
                // Include source, level, and a position counter so two events
                // sharing the same second-resolution timestamp and identical
                // message don't collide. Without this, warn/error pairs on
                // the same condition deduped to one entry and one was
                // silently dropped.
                const id =
                    entry.id ||
                    `${entry.source ?? ""}|${entry.level ?? entry.severity ?? ""}|${entry.timestamp ?? ""}|${index}|${entry.message ?? ""}`;
                if (seen.has(id)) return false;
                seen.add(id);
                if (source && entry.source !== source) return false;
                if (level && entry.level !== level && entry.severity !== level) return false;
                if (query && !entry.message.toLowerCase().includes(query.toLowerCase())) return false;
                return true;
            })
            .map(({ entry }) => entry)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [data?.logs, level, liveLogs, query, source]);

    const sources = useMemo(() => Array.from(new Set(logs.map((entry) => entry.source).filter(Boolean))).sort(), [logs]);

    useEffect(() => {
        if (autoScroll) bottomRef.current?.scrollIntoView({ block: "end" });
    }, [autoScroll, logs.length]);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <CardTitle>Logs</CardTitle>
                            <CardDescription className="mt-1">Live tail plus server-side log history. <span className="font-medium text-foreground">{logs.length}</span> {logs.length === 1 ? "entry" : "entries"} shown.</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {liveLogs.length > 0 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => setLiveLogs([])}>
                                    Clear live ({liveLogs.length})
                                </Button>
                            )}
                            <Button type="button" variant="outline" size="sm" onClick={() => setAutoScroll(!autoScroll)}>
                                {autoScroll ? <Pause size={14} /> : <Play size={14} />}
                                {autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-[180px_180px_1fr]">
                        <select value={source} onChange={(event) => setSource(event.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <option value="">All sources</option>
                            {sources.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <select value={level} onChange={(event) => setLevel(event.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            {levels.map((item) => <option key={item || "all"} value={item}>{item || "All severities"}</option>)}
                        </select>
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search log text" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                </CardContent>
            </Card>

            <div className="h-[calc(100vh-18rem)] overflow-auto rounded-xl border border-border bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
                {logs.map((entry) => (
                    <div key={entry.id || `${entry.timestamp}-${entry.message}`} className="grid grid-cols-[9rem_7rem_6rem_1fr] gap-3 border-b border-white/5 py-1">
                        <span className="text-zinc-500">{entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : "--:--:--"}</span>
                        <span className="text-sky-400">{entry.source || "system"}</span>
                        <span className={cn("font-semibold", tone(entry.level || entry.severity))}>{entry.level || entry.severity || "info"}</span>
                        <span>{entry.message}</span>
                    </div>
                ))}
                {logs.length === 0 && <div className="grid h-full place-items-center text-zinc-500">No log entries match the current filters.</div>}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}