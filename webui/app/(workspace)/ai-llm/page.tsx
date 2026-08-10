"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle, Bot, CheckCircle2, ChevronDown, Clock,
    Database, Loader2, RotateCcw, Send, Sparkles, User, XCircle, Zap,
} from "lucide-react";
import { getRuns, getRun, getRunResults, getGlobalLogs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, statusVariant } from "@/lib/utils";
import type { Run, TestResult, LogEntry } from "@/lib/types/api";
import { useAppShell } from "@/state/app-shell-context";

// ─── Config ──────────────────────────────────────────────────────────────────────────────
const OLLAMA_BASE = "http://localhost:11434";
const CHAT_MODEL   = "nemotron3:33b";
const EMBED_MODEL  = "nomic-embed-text";
const RAG_TOP_K    = 10;
const EMBED_BATCH  = 3;

// ─── Types ───────────────────────────────────────────────────────────────────────────────
interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface RagChunk {
    id: string;
    text: string;
    embedding: number[];
    type: "run_meta" | "test_result" | "log_group";
}

type RagStatus = "idle" | "building" | "ready" | "error";

// ─── RAG helpers ──────────────────────────────────────────────────────────────────────
function cosineSim(a: number[], b: number[]): number {
    let dot = 0, ma = 0, mb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        ma  += a[i] * a[i];
        mb  += b[i] * b[i];
    }
    return dot / (Math.sqrt(ma) * Math.sqrt(mb) + 1e-10);
}

async function embedText(text: string, signal?: AbortSignal): Promise<number[]> {
    const res = await fetch(`${OLLAMA_BASE}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
    });
    if (!res.ok) throw new Error(`Embed API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!Array.isArray(data.embedding)) throw new Error("Invalid embedding response");
    return data.embedding as number[];
}

function buildChunks(
    run: Run,
    results: TestResult[],
    logs: LogEntry[],
): { id: string; text: string; type: RagChunk["type"] }[] {
    const out: { id: string; text: string; type: RagChunk["type"] }[] = [];

    out.push({
        id: "run_meta",
        type: "run_meta",
        text: [
            `Run ID: ${run.id}`,
            `Name: ${run.name || "(unnamed)"}`,
            `Status: ${run.status}`,
            `Mode: ${run.mode}`,
            `Started: ${run.started_at || "N/A"}`,
            `Ended: ${run.ended_at || "N/A"}`,
            `Notes: ${run.notes || "none"}`,
            `Error: ${run.error_message || "none"}`,
            `Total: ${results.length}  Pass: ${results.filter((r) => r.status === "pass").length}  Fail: ${results.filter((r) => r.status === "fail").length}`,
        ].join("\n"),
    });

    for (const r of results) {
        const lines = [
            `Test: ${r.name}`,
            `Module: ${r.module_id} v${r.module_version}`,
            `Status: ${r.status}`,
            `Severity: ${r.severity || "N/A"}`,
        ];
        if (r.error_message) lines.push(`Error: ${r.error_message}`);
        if (r.reason && Object.keys(r.reason).length > 0)
            lines.push(`Reason: ${JSON.stringify(r.reason)}`);
        if (r.metrics && Object.keys(r.metrics).length > 0)
            lines.push(`Metrics: ${JSON.stringify(r.metrics)}`);
        lines.push(`Duration: ${(r.duration_ns / 1e6).toFixed(2)}ms  @${r.timestamp}`);
        out.push({ id: `res_${r.id}`, type: "test_result", text: lines.join("\n") });
    }

    for (let i = 0; i < logs.length; i += 8) {
        const group = logs.slice(i, i + 8);
        out.push({
            id: `log_${i}`,
            type: "log_group",
            text: group
                .map((l) => `[${l.level.toUpperCase()}] ${l.source}: ${l.message}  (${l.timestamp})`)
                .join("\n"),
        });
    }

    return out;
}

function retrieveTopK(qEmbed: number[], chunks: RagChunk[], k: number): RagChunk[] {
    return chunks
        .map((c) => ({ c, score: cosineSim(qEmbed, c.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((x) => x.c);
}

function buildSystemPrompt(run: Run, topChunks: RagChunk[]): string {
    const ctx = topChunks
        .map((c, i) => `[${i + 1}] (${c.type})\n${c.text}`)
        .join("\n\n---\n\n");
    return `You are an expert test-and-verification engineer analyzing an Zion IV&V test run.

Run: ${run.name || run.id}  |  Status: ${run.status}  |  Mode: ${run.mode}

The following context was retrieved from a semantic knowledge base built from this run's data:

${ctx}

Answer the user's question based on this context. Be concise and actionable. If the answer is not clear from the context, say so.`;
}

// ─── Utilities ───────────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
    "Summarize this test run",
    "Which tests failed and why?",
    "What are the most critical issues?",
    "Are there patterns in the failures?",
];

function formatDuration(start: string, end: string): string {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ─── Left panel ──────────────────────────────────────────────────────────────────────────
interface PanelProps {
    runs: Run[];
    selectedId: string;
    onSelect: (id: string) => void;
    run: Run | undefined;
    pass: number;
    fail: number;
    total: number;
    loading: boolean;
    ragStatus: RagStatus;
    ragProgress: { done: number; total: number };
    onBuild: () => void;
    onRebuild: () => void;
}

function RunContextPanel({
    runs, selectedId, onSelect, run, pass, fail, total, loading,
    ragStatus, ragProgress, onBuild, onRebuild,
}: PanelProps) {
    return (
        <div className="flex w-72 shrink-0 flex-col gap-4 border-r border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Bot size={16} className="text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold">AI / LLM</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{CHAT_MODEL}</p>
                </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Test Run
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <ChevronDown size={13} className="text-muted-foreground" />
                    </div>
                    <select
                        value={selectedId}
                        onChange={(e) => onSelect(e.target.value)}
                        className="h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-8 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="">Select a run…</option>
                        {runs.map((r) => (
                            <option key={r.id} value={r.id}>{r.name || r.id}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedId && (
                <Card className="border-border/60 bg-background shadow-none">
                    <CardHeader className="px-3 py-2.5">
                        <CardTitle className="flex items-center justify-between text-xs font-medium">
                            <span className="truncate text-foreground">{run?.name || run?.id || "…"}</span>
                            {run && (
                                <Badge variant={statusVariant(run.status)} className="ml-2 shrink-0 text-[10px]">
                                    {run.status}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-3 space-y-3">
                        {loading ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 size={12} className="animate-spin" /> Loading…
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-1.5 text-center">
                                    <div className="rounded-md bg-green-500/10 px-1 py-1.5">
                                        <p className="text-[18px] font-bold leading-none text-green-600">{pass}</p>
                                        <p className="mt-0.5 text-[10px] text-green-600/80">pass</p>
                                    </div>
                                    <div className="rounded-md bg-red-500/10 px-1 py-1.5">
                                        <p className="text-[18px] font-bold leading-none text-red-600">{fail}</p>
                                        <p className="mt-0.5 text-[10px] text-red-600/80">fail</p>
                                    </div>
                                    <div className="rounded-md bg-muted px-1 py-1.5">
                                        <p className="text-[18px] font-bold leading-none text-muted-foreground">{total}</p>
                                        <p className="mt-0.5 text-[10px] text-muted-foreground/80">total</p>
                                    </div>
                                </div>
                                {run && (
                                    <div className="space-y-1 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={10} className="shrink-0" />
                                            {run.started_at
                                                ? new Date(run.started_at).toLocaleString()
                                                : "Not started"}
                                        </div>
                                        {run.started_at && run.ended_at && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 size={10} className="shrink-0" />
                                                Duration: {formatDuration(run.started_at, run.ended_at)}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={10} className="shrink-0" />
                                            Mode: {run.mode}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {selectedId && !loading && (
                <div className="space-y-2">
                    <Separator />
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Knowledge Base
                    </label>

                    {ragStatus === "idle" && (
                        <Button size="sm" className="w-full gap-2" onClick={onBuild}>
                            <Database size={13} />
                            Build KB
                        </Button>
                    )}

                    {ragStatus === "building" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 size={12} className="animate-spin text-primary" />
                                <span>Embedding chunks…</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: ragProgress.total > 0
                                            ? `${(ragProgress.done / ragProgress.total) * 100}%`
                                            : "0%",
                                    }}
                                />
                            </div>
                            <p className="text-right text-[11px] text-muted-foreground">
                                {ragProgress.done} / {ragProgress.total}
                            </p>
                        </div>
                    )}

                    {ragStatus === "ready" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-green-600">
                                <CheckCircle2 size={12} />
                                <span className="font-medium">KB Ready</span>
                                <span className="ml-auto text-muted-foreground">{ragProgress.total} chunks</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full gap-2 text-xs" onClick={onRebuild}>
                                <RotateCcw size={12} />
                                Rebuild
                            </Button>
                        </div>
                    )}

                    {ragStatus === "error" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircle size={12} />
                                <span>Build failed</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full gap-2 text-xs" onClick={onBuild}>
                                <RotateCcw size={12} />
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-auto space-y-0.5 text-[10px] text-muted-foreground/60">
                <p>Chat: <span className="font-mono">{CHAT_MODEL}</span></p>
                <p>Embed: <span className="font-mono">{EMBED_MODEL}</span></p>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────────────────
export default function AiLlmPage() {
    const [selectedRunId, setSelectedRunId]   = useState("");
    const { serverOnline } = useAppShell();
    const [ragChunks, setRagChunks]           = useState<RagChunk[]>([]);
    const [ragStatus, setRagStatus]           = useState<RagStatus>("idle");
    const [ragProgress, setRagProgress]       = useState({ done: 0, total: 0 });
    const [ragError, setRagError]             = useState<string | null>(null);
    const [messages, setMessages]             = useState<ChatMessage[]>([]);
    const [input, setInput]                   = useState("");
    const [streaming, setStreaming]           = useState(false);
    const [ollamaError, setOllamaError]       = useState<string | null>(null);

    const bottomRef    = useRef<HTMLDivElement>(null);
    const textareaRef  = useRef<HTMLTextAreaElement>(null);
    const abortRef     = useRef<AbortController | null>(null);
    const buildAbort   = useRef<AbortController | null>(null);

    const { data: runsData } = useQuery({
        queryKey: ["runs", "ai-llm"],
        queryFn: () => getRuns({ limit: 100 }),
        enabled: serverOnline !== false,
    });
    const runs = runsData?.runs ?? [];

    const { data: runDetail, isFetching: runFetching } = useQuery({
        queryKey: ["run", selectedRunId],
        queryFn: () => getRun(selectedRunId),
        enabled: !!selectedRunId && serverOnline !== false,
    });

    const { data: resultsData, isFetching: resultsFetching } = useQuery({
        queryKey: ["run-results", selectedRunId],
        queryFn: () => getRunResults(selectedRunId, { limit: 500 }),
        enabled: !!selectedRunId && serverOnline !== false,
    });

    const { data: logsData } = useQuery({
        queryKey: ["run-logs", selectedRunId],
        queryFn: () => getGlobalLogs({ runId: selectedRunId, limit: 200 }),
        enabled: !!selectedRunId && serverOnline !== false,
    });

    const results        = resultsData?.results ?? [];
    const pass           = results.filter((r) => r.status === "pass").length;
    const fail           = results.filter((r) => r.status === "fail").length;
    const contextLoading = runFetching || resultsFetching;

    // Reset run-scoped state whenever the user switches run. useEffect is the
    // correct primitive for "external change → reset internal state"; the
    // set-state-in-effect rule is intended for deriving state, not for clearing
    // it. All setters are exhaustive — they reset every piece of run-bound UI.
    useEffect(() => {
        // Abort any in-flight chat stream and RAG build for the previous run.
        // Without this, the Ollama response continues to write tokens into the
        // new run's `messages` array, mixing contexts.
        abortRef.current?.abort();
        buildAbort.current?.abort();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRagChunks([]);
        setRagStatus("idle");
        setRagProgress({ done: 0, total: 0 });
        setRagError(null);
        setMessages([]);
        setOllamaError(null);
    }, [selectedRunId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streaming]);

    const buildRagDb = useCallback(async () => {
        if (!runDetail) return;

        buildAbort.current?.abort();
        const abort = new AbortController();
        buildAbort.current = abort;

        setRagStatus("building");
        setRagError(null);
        setRagChunks([]);
        setMessages([]);
        setOllamaError(null);

        const rawChunks = buildChunks(
            runDetail,
            resultsData?.results ?? [],
            logsData?.logs ?? [],
        );
        setRagProgress({ done: 0, total: rawChunks.length });

        const embedded: RagChunk[] = [];
        try {
            for (let i = 0; i < rawChunks.length; i += EMBED_BATCH) {
                if (abort.signal.aborted) {
                    setRagStatus("idle");
                    setRagProgress({ done: 0, total: 0 });
                    return;
                }
                const batch = rawChunks.slice(i, i + EMBED_BATCH);
                const embeddings = await Promise.all(
                    batch.map((c) => embedText(c.text, abort.signal)),
                );
                for (let j = 0; j < batch.length; j++) {
                    embedded.push({ ...batch[j], embedding: embeddings[j] });
                }
                setRagProgress({ done: embedded.length, total: rawChunks.length });
            }
        } catch (err) {
            if (abort.signal.aborted) {
                setRagStatus("idle");
                setRagProgress({ done: 0, total: 0 });
                return;
            }
            const msg = err instanceof Error ? err.message : String(err);
            setRagError(msg);
            setRagStatus("error");
            return;
        }

        setRagChunks(embedded);
        setRagProgress({ done: embedded.length, total: rawChunks.length });
        setRagStatus("ready");
    }, [runDetail, resultsData, logsData]);

    const sendMessage = async (text?: string) => {
        const userText = (text ?? input).trim();
        if (!userText || streaming || ragStatus !== "ready" || !runDetail) return;

        setInput("");
        setOllamaError(null);

        let qEmbed: number[];
        try {
            qEmbed = await embedText(userText);
        } catch (err) {
            setOllamaError(`Query embedding failed: ${err instanceof Error ? err.message : String(err)}`);
            return;
        }

        const topChunks = retrieveTopK(qEmbed, ragChunks, RAG_TOP_K);
        const systemPrompt = buildSystemPrompt(runDetail, topChunks);

        // Build history from current `messages`. As long as sendMessage is gated
        // on `streaming`, messages can't shift between this read and the
        // placeholder commit. The functional-updater pattern below also
        // computes the placeholder index from the latest committed state, so
        // even if a future change loosens the streaming gate, indices stay
        // correct.
        const history: ChatMessage[] = [
            { role: "system", content: systemPrompt },
            ...messages,
            { role: "user", content: userText },
        ];

        setStreaming(true);

        // Commit user + placeholder in a single functional update so the
        // placeholder index is computed against the post-user-commit state.
        let placeholderIdx = -1;
        setMessages((prev) => {
            const userMsg: ChatMessage = { role: "user", content: userText };
            const assistantMsg: ChatMessage = { role: "assistant", content: "" };
            placeholderIdx = prev.length + 1;
            return [...prev, userMsg, assistantMsg];
        });

        const abort = new AbortController();
        abortRef.current = abort;

        try {
            const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: abort.signal,
                body: JSON.stringify({
                    model: CHAT_MODEL,
                    messages: history.map((m) => ({ role: m.role, content: m.content })),
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            // Mutable container for the running assistant text. Using a ref
            // (not `let`) sidesteps the immutability rule for in-loop
            // accumulation and keeps the value out of the render closure.
            const accumulatedRef = { current: "" };

            let streamDone = false;
            while (!streamDone) {
                const { done, value } = await reader.read();
                if (done) break;
                const lines = decoder.decode(value, { stream: true }).split("\n").filter(Boolean);
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        accumulatedRef.current += parsed?.message?.content ?? "";
                        const snapshot = accumulatedRef.current;
                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[placeholderIdx] = { role: "assistant", content: snapshot };
                            return updated;
                        });
                        // Ollama's terminal chunk sets done: true. Stop
                        // the outer read loop too — otherwise we burn one
                        // extra reader.read() round-trip per reply.
                        if (parsed?.done) {
                            streamDone = true;
                            break;
                        }
                    } catch { /* partial JSON */ }
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            setOllamaError(err instanceof Error ? err.message : String(err));
            // Roll back only the assistant placeholder; leave the user
            // question in history so the operator can see what was asked.
            setMessages((prev) =>
                placeholderIdx >= 0 && placeholderIdx < prev.length
                    ? prev.filter((_, i) => i !== placeholderIdx)
                    : prev,
            );
        } finally {
            setStreaming(false);
            abortRef.current = null;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="-m-5 flex h-[calc(100vh-var(--shell-header-height))] overflow-hidden">
            <RunContextPanel
                runs={runs}
                selectedId={selectedRunId}
                onSelect={setSelectedRunId}
                run={runDetail}
                pass={pass}
                fail={fail}
                total={results.length}
                loading={contextLoading}
                ragStatus={ragStatus}
                ragProgress={ragProgress}
                onBuild={buildRagDb}
                onRebuild={() => {
                    setRagStatus("idle");
                    setRagChunks([]);
                    setMessages([]);
                    setOllamaError(null);
                }}
            />

            <div className="flex flex-1 flex-col overflow-hidden">

                {!selectedRunId ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Bot size={32} className="text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Select a test run to begin</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Choose a run from the panel on the left, then build a knowledge base to enable AI analysis.
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground/60 mt-2">
                            <span className="flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">1</span>
                                Select run
                            </span>
                            <span className="text-border">→</span>
                            <span className="flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">2</span>
                                Build KB
                            </span>
                            <span className="text-border">→</span>
                            <span className="flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">3</span>
                                Ask questions
                            </span>
                        </div>
                    </div>

                ) : contextLoading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                        <Loader2 size={32} className="animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading run data…</p>
                    </div>

                ) : ragStatus === "idle" ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Database size={28} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Build Knowledge Base</p>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Generate a semantic index from this run&apos;s{" "}
                                <span className="font-medium text-foreground">{results.length} test results</span>{" "}
                                and logs. Questions will use vector similarity to find the most relevant context.
                            </p>
                        </div>
                        <Button size="lg" className="gap-2 px-8" onClick={buildRagDb}>
                            <Database size={16} />
                            Build Knowledge Base
                        </Button>
                        <p className="text-xs text-muted-foreground/60">
                            Uses <span className="font-mono">{EMBED_MODEL}</span> embeddings via Ollama
                        </p>
                    </div>

                ) : ragStatus === "building" ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Loader2 size={28} className="animate-spin text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Building Knowledge Base</p>
                            <p className="text-sm text-muted-foreground">
                                Embedding {ragProgress.total} chunks via{" "}
                                <span className="font-mono">{EMBED_MODEL}</span>…
                            </p>
                        </div>
                        <div className="w-full max-w-xs space-y-2">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: ragProgress.total > 0
                                            ? `${(ragProgress.done / ragProgress.total) * 100}%`
                                            : "0%",
                                    }}
                                />
                            </div>
                            <p className="tabular-nums text-sm text-muted-foreground">
                                {ragProgress.done} / {ragProgress.total} chunks
                            </p>
                        </div>
                    </div>

                ) : ragStatus === "error" ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                            <AlertCircle size={28} className="text-destructive" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">Knowledge Base Build Failed</p>
                            <p className="text-sm text-muted-foreground max-w-sm">{ragError}</p>
                        </div>
                        <Button variant="outline" className="gap-2" onClick={buildRagDb}>
                            <RotateCcw size={14} />
                            Try Again
                        </Button>
                    </div>

                ) : (
                    <>
                        <div className="relative flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-3xl space-y-6 px-6 py-6 pb-4">
                                {messages.length === 0 ? (
                                    <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                            <Sparkles size={28} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Knowledge base ready</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {ragProgress.total} chunks indexed · top-{RAG_TOP_K} retrieval per question
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {SUGGESTIONS.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => sendMessage(s)}
                                                    className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex gap-3",
                                                msg.role === "user" ? "justify-end" : "justify-start",
                                            )}
                                        >
                                            {msg.role === "assistant" && (
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                                    <Bot size={15} className="text-primary" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    "max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                                                    msg.role === "user"
                                                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                                                        : "rounded-tl-sm border border-border/60 bg-card text-foreground",
                                                )}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                {msg.role === "assistant" && streaming && i === messages.length - 1 && (
                                                    <span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse rounded-full bg-primary align-middle" />
                                                )}
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                                                    <User size={14} className="text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}

                                {ollamaError && (
                                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Error</p>
                                            <p className="mt-0.5 text-xs opacity-80">{ollamaError}</p>
                                        </div>
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>
                            <div className="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
                        </div>

                        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-sm">
                            <div className="mx-auto max-w-3xl">
                                <div className="flex items-end gap-3 rounded-2xl border border-input bg-background px-4 py-3 shadow-sm focus-within:ring-1 focus-within:ring-ring">
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            e.target.style.height = "auto";
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask anything about this run…"
                                        disabled={streaming}
                                        rows={1}
                                        className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50"
                                        style={{ maxHeight: "120px" }}
                                    />
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        {messages.length > 0 && (
                                            <button
                                                onClick={() => { setMessages([]); setOllamaError(null); }}
                                                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                title="Clear chat"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        )}
                                        <Button
                                            size="icon"
                                            onClick={streaming ? () => abortRef.current?.abort() : () => sendMessage()}
                                            disabled={!input.trim() && !streaming}
                                            variant={streaming ? "destructive" : "default"}
                                            className="h-8 w-8 rounded-xl"
                                        >
                                            {streaming ? <XCircle size={15} /> : <Send size={15} />}
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
                                    RAG · {ragProgress.total} chunks · top-{RAG_TOP_K} retrieval · Enter to send
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
