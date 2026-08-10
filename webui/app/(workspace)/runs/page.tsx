"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, History, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; import { getRuns } from "@/lib/api";
import { cn, formatRunDuration, statusVariant } from "@/lib/utils";
import { useAppShell } from "@/state/app-shell-context";
import type { Run } from "@/lib/types/api";

const MODES = ["single_shot", "monitoring", "event", "long_run"] as const;
const PAGE_SIZE = 20;

function modeLabel(mode: string): string {
    if (mode === "single_shot") return "One-shot";
    if (mode === "monitoring") return "Monitoring";
    if (mode === "event") return "Event";
    if (mode === "long_run") return "Long-run";
    return mode;
}

export default function RunsPage() {
    const { serverOnline, reviewingRunId, setReviewingRunId } = useAppShell();
    const [modeFilter, setModeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["runs", "history", modeFilter, statusFilter, page],
        queryFn: () =>
            getRuns({
                mode: modeFilter || undefined,
                status: statusFilter || undefined,
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            }),
        refetchInterval: 15_000,
        enabled: serverOnline !== false,
        retry: 0,
    });

    const runs: Run[] = data?.runs ?? [];
    const total = data?.total ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const handleFilterChange = () => {
        setPage(0);
    };

    return (
        <div className="space-y-4">
            {/* ── Header ── */}
            <Card>
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <History size={20} className="text-muted-foreground" />
                            <Badge variant="secondary">{total} total</Badge>
                            {reviewingRunId && (
                                <Badge variant="warning">
                                    Reviewing {reviewingRunId.slice(0, 8)}…
                                    <button
                                        type="button"
                                        onClick={() => setReviewingRunId(null)}
                                        className="ml-2 underline underline-offset-2 hover:no-underline"
                                    >
                                        clear
                                    </button>
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-2xl">Run History</CardTitle>
                        <CardDescription>
                            All test execution runs with status, mode, timing, and notes. Click a row to set it as the active review run.
                        </CardDescription>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <select
                            value={modeFilter}
                            onChange={(e) => { setModeFilter(e.target.value); handleFilterChange(); }}
                            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All modes</option>
                            {MODES.map((m) => <option key={m} value={m}>{modeLabel(m)}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
                            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All statuses</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                            <RefreshCw size={14} /> Refresh
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* ── Table ── */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Run ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Notes / Error</TableHead>
                                <TableHead className="w-20 text-right">Review</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && runs.length === 0 &&
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={8}>
                                            <div className="h-8 animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                            {runs.map((run) => (
                                <TableRow
                                    key={run.id}
                                    className={cn(
                                        "cursor-pointer transition-colors hover:bg-muted/50",
                                        reviewingRunId === run.id && "bg-warning/10",
                                    )}
                                    onClick={() => setReviewingRunId(reviewingRunId === run.id ? null : run.id)}
                                >
                                    <TableCell className="font-mono text-xs">
                                        <span title={run.id}>{run.id.slice(0, 8)}…</span>
                                        {run.baseline_flag && (
                                            <Badge variant="secondary" className="ml-1 text-[10px]">baseline</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[140px] truncate text-sm">
                                        {run.name || <span className="text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{modeLabel(run.mode) || "—"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(run.status)}>{run.status || "—"}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        {run.created_at ? new Date(run.created_at).toLocaleString() : "—"}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {formatRunDuration(run.started_at, run.ended_at)}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-xs">
                                        {run.error_message ? (
                                            <span className="text-destructive">{run.error_message}</span>
                                        ) : run.notes ? (
                                            <span className="text-muted-foreground">{run.notes}</span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={`/runs/${run.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex h-8 items-center rounded-md px-3 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!isLoading && runs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                                        No runs found
                                        {(modeFilter || statusFilter) && (
                                            <span> with the current filters — <button type="button" className="underline" onClick={() => { setModeFilter(""); setStatusFilter(""); setPage(0); }}>clear filters</button></span>
                                        )}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {pageCount > 1 && (
                        <>
                            <Separator />
                            <div className="flex items-center justify-between p-3 text-sm text-muted-foreground">
                                <span>
                                    {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={page === 0}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="px-2">{page + 1} / {pageCount}</span>
                                    <button
                                        type="button"
                                        disabled={page >= pageCount - 1}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
