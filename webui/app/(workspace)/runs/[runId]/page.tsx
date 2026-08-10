"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Boxes, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRun, getRunResults } from "@/lib/api";
import type { TestResult } from "@/lib/types/api";
import { formatClock, formatDuration, formatRunDuration, resultVariant, safeDecodeSegment, statusVariant } from "@/lib/utils";
import { useAppShell } from "@/state/app-shell-context";

function resultValue(result: TestResult): string {
    const fields = [result.metrics, result.monitoring, result.event];
    for (const field of fields) {
        const entry = Object.entries(field ?? {})[0];
        if (entry) return `${entry[0]}: ${String(entry[1])}`;
    }
    return result.error_message || "-";
}

export default function RunDetailPage() {
    const params = useParams<{ runId: string }>();
    const runId = safeDecodeSegment(params.runId);
    const { setReviewingRunId, serverOnline } = useAppShell();

    const run = useQuery({
        queryKey: ["run", runId],
        queryFn: () => getRun(runId),
        enabled: serverOnline !== false,
        retry: 0,
    });

    const results = useQuery({
        queryKey: ["run-results", runId, "detail"],
        queryFn: () => getRunResults(runId, { limit: 1000 }),
        enabled: serverOnline !== false,
        retry: 0,
    });

    const grouped = (results.data?.results ?? []).reduce<Record<string, TestResult[]>>((map, result) => {
        const moduleId = result.module_id || "unknown";
        map[moduleId] = [...(map[moduleId] ?? []), result];
        return map;
    }, {});

    const passCount = (results.data?.results ?? []).filter((result) => result.status?.toLowerCase().includes("pass")).length;
    const failCount = (results.data?.results ?? []).filter((result) => {
        const status = result.status?.toLowerCase() ?? "";
        return status.includes("fail") || status.includes("error");
    }).length;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Link href="/runs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                                <ArrowLeft size={14} /> Run history
                            </Link>
                            <Badge variant={statusVariant(run.data?.status)}>{run.data?.status ?? "Loading"}</Badge>
                            {run.data?.baseline_flag && <Badge variant="secondary">baseline</Badge>}
                        </div>
                        <CardTitle className="text-2xl">{run.data?.name || `Run ${runId.slice(0, 8)}`}</CardTitle>
                        <CardDescription className="mt-2 font-mono text-xs">{runId}</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => setReviewingRunId(runId)}>
                            <Boxes size={14} /> Review in modules
                        </Button>
                        <Link href="/modules">
                            <Button type="button" variant="secondary">Open modules</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm md:grid-cols-4">
                    <div><span className="text-muted-foreground">Mode</span><div className="font-medium">{run.data?.mode ?? "-"}</div></div>
                    <div><span className="text-muted-foreground">Created</span><div className="font-medium">{run.data?.created_at ? formatClock(run.data.created_at) : "-"}</div></div>
                    <div><span className="text-muted-foreground">Duration</span><div className="font-medium">{formatRunDuration(run.data?.started_at, run.data?.ended_at)}</div></div>
                    <div><span className="text-muted-foreground">Results</span><div className="font-medium">{results.data?.total ?? 0}</div></div>
                    {run.data?.error_message && <div className="md:col-span-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">{run.data.error_message}</div>}
                </CardContent>
            </Card>

            <section className="grid gap-3 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardDescription>Passed</CardDescription><CardTitle className="flex items-center gap-2 text-3xl text-success"><CheckCircle2 size={24} />{passCount}</CardTitle></CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardDescription>Failed</CardDescription><CardTitle className="flex items-center gap-2 text-3xl text-destructive"><XCircle size={24} />{failCount}</CardTitle></CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardDescription>Modules With Evidence</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><Boxes size={24} />{Object.keys(grouped).length}</CardTitle></CardHeader>
                </Card>
            </section>

            {Object.entries(grouped).map(([moduleId, rows]) => (
                <Card key={moduleId}>
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-lg">{moduleId}</CardTitle>
                            <CardDescription>{rows.length} result{rows.length === 1 ? "" : "s"}</CardDescription>
                        </div>
                        <Link href={`/modules/${moduleId}`} onClick={() => setReviewingRunId(runId)}>
                            <Button type="button" variant="outline" size="sm">Review module</Button>
                        </Link>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Value / Error</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.slice(0, 50).map((result) => (
                                    <TableRow key={`${result.id}-${result.sequence}`}>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap"><Clock size={12} className="mr-1 inline" />{formatClock(result.timestamp)}</TableCell>
                                        <TableCell><div className="font-medium">{result.name || result.test_id}</div><div className="text-xs text-muted-foreground">{result.test_id}</div></TableCell>
                                        <TableCell><Badge variant={resultVariant(result.status)}>{result.status}</Badge></TableCell>
                                        <TableCell className="text-xs">{formatDuration(result.duration_ns)}</TableCell>
                                        <TableCell className="max-w-[340px] truncate text-xs">{resultValue(result)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {rows.length > 50 && <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Showing first 50 results for this module.</div>}
                    </CardContent>
                </Card>
            ))}

            {!results.isLoading && Object.keys(grouped).length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">No results were recorded for this run.</CardContent>
                </Card>
            )}
        </div>
    );
}