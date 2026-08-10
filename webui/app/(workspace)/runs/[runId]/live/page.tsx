"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Activity, CheckCircle2, Clock, XCircle, Pause, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLiveRunStream } from "@/lib/live-run/useLiveRunStream";
import { tallyResults } from "@/lib/live-run/reducer";
import { isTerminalRunStatus, type ModuleState } from "@/lib/live-run/types";
import { formatClock, formatDuration, safeDecodeSegment } from "@/lib/utils";

function ConnectionPill({ status }: { status: "connecting" | "open" | "closed" }) {
  const map = {
    connecting: { label: "connecting", cls: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
    open: { label: "live", cls: "bg-green-500/15 text-green-700 dark:text-green-400" },
    closed: { label: "closed", cls: "bg-muted text-muted-foreground" },
  } as const;
  const m = map[status];
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={`stream ${m.label}`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${status === "open" ? "bg-green-500" : status === "connecting" ? "bg-yellow-500" : "bg-muted-foreground"}`} />
      {m.label}
    </span>
  );
}

function ModuleStateDot({ state }: { state: ModuleState }) {
  if (state === "done") return <CheckCircle2 size={14} className="text-green-600" aria-hidden="true" />;
  if (state === "running") return <Loader2 size={14} className="animate-spin text-yellow-600" aria-hidden="true" />;
  return <Clock size={14} className="text-muted-foreground" aria-hidden="true" />;
}

function terminalBanner(status: string | null | undefined) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "completed") return { text: "Run completed", cls: "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400" };
  if (s === "failed") return { text: "Run failed", cls: "border-destructive/40 bg-destructive/10 text-destructive" };
  if (s === "cancelled" || s === "aborted") return { text: "Run aborted", cls: "border-muted-foreground/40 bg-muted text-muted-foreground" };
  if (s === "rejected") return { text: "Run rejected", cls: "border-destructive/40 bg-destructive/10 text-destructive" };
  return null;
}

export default function LiveRunPage() {
  const params = useParams<{ runId: string }>();
  const runId = safeDecodeSegment(params.runId);
  const { state, connection } = useLiveRunStream(runId);

  // Ticking elapsed timer from run.start.started_at until terminal.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!state.run?.started_at || state.terminal) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.run?.started_at, state.terminal]);

  const tally = useMemo(() => tallyResults(state.results), [state.results]);
  const banner = state.terminal ? terminalBanner(state.terminalStatus ?? state.run?.status) : null;

  const elapsedMs = state.run?.started_at
    ? (state.terminal && state.run?.ended_at
        ? new Date(state.run.ended_at).getTime() - new Date(state.run.started_at).getTime()
        : now - new Date(state.run.started_at).getTime())
    : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Link href={`/runs/${encodeURIComponent(runId)}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} /> Run detail
              </Link>
              <Link href="/runs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} /> History
              </Link>
              <Badge variant={state.terminal ? "secondary" : "warning"}>
                {state.run?.status ?? "Connecting"}
              </Badge>
              <ConnectionPill status={connection} />
              {state.flowPaused && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400" role="status" aria-live="polite">
                  stream paused (backpressure)
                </span>
              )}
            </div>
            <CardTitle className="text-2xl">{state.run?.name || `Run ${runId.slice(0, 8)}`}</CardTitle>
            <CardDescription className="mt-2 font-mono text-xs">{runId}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/runs/${encodeURIComponent(runId)}`}>
              <Button type="button" variant="outline"><Activity size={14} /> Full detail</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-4">
          <div><span className="text-muted-foreground">Mode</span><div className="font-medium">{state.run?.mode ?? "-"}</div></div>
          <div><span className="text-muted-foreground">Started</span><div className="font-medium">{state.run?.started_at ? formatClock(state.run.started_at) : "-"}</div></div>
          <div><span className="text-muted-foreground">Elapsed</span><div className="font-medium">{elapsedMs != null && elapsedMs >= 0 ? `${(elapsedMs / 1000).toFixed(1)}s` : "—"}</div></div>
          <div><span className="text-muted-foreground">Results</span><div className="font-medium">{tally.total}</div></div>
        </CardContent>
      </Card>

      {banner && (
        <div role="status" aria-live="polite" className={`rounded-md border px-4 py-3 text-sm font-medium ${banner.cls}`}>
          {banner.text}
          {state.run?.ended_at && <span className="ml-2 font-normal text-xs">ended {formatClock(state.run.ended_at)}</span>}
        </div>
      )}

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Passed</CardDescription><CardTitle className="flex items-center gap-2 text-3xl text-success"><CheckCircle2 size={24} />{tally.passed}</CardTitle></CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Failed</CardDescription><CardTitle className="flex items-center gap-2 text-3xl text-destructive"><XCircle size={24} />{tally.failed}</CardTitle></CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Modules</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><Activity size={24} />{state.moduleOrder.length}</CardTitle></CardHeader>
        </Card>
      </section>

      {state.moduleOrder.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Module progress</CardTitle><CardDescription>{state.moduleOrder.length} module{state.moduleOrder.length === 1 ? "" : "s"}</CardDescription></CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {state.moduleOrder.map((m) => (
                <li key={m} className="flex items-center justify-between px-4 py-2 text-sm">
                  <Link href={`/modules/${encodeURIComponent(m)}`} className="font-medium hover:underline">{m}</Link>
                  <span className="inline-flex items-center gap-1 text-muted-foreground capitalize">
                    <ModuleStateDot state={state.modules[m]} /> {state.modules[m]}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
          <CardHeader><CardTitle className="text-lg">Streaming results</CardTitle><CardDescription>Newest first — appended as they land.</CardDescription></CardHeader>
          <Separator />
          <CardContent className="p-0">
            {state.results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">Waiting for the first result…</div>
            ) : (
              <ul className="divide-y divide-border">
                {state.results.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                    <Badge variant={r.status.toLowerCase().includes("pass") ? "success" : r.status.toLowerCase().includes("fail") || r.status.toLowerCase().includes("error") ? "destructive" : "secondary"}>{r.status}</Badge>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{r.name || r.test_id}</div>
                      <div className="text-xs text-muted-foreground">{r.module_id} · {r.test_id}</div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{r.timestamp ? formatClock(r.timestamp) : "—"}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDuration(r.duration_ns)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
      </Card>
    </div>
  );
}