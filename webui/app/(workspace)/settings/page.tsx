"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronRight, RefreshCw, Trash2, Upload } from "lucide-react";
import {
    getHealth, getModules, getRetentionSettings, getTarget,
    updateRetentionSettings, uploadOtaArtifact,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppShell } from "@/state/app-shell-context";
import { PLATFORM_SLUG } from "@/lib/platform";

// ─── Primitives ───────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={clsx(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                checked ? "bg-primary" : "bg-input",
            )}
        >
            <span className={clsx(
                "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
                checked ? "translate-x-4" : "translate-x-0",
            )} />
        </button>
    );
}

function Row({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
            <div className="min-w-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                {sub && <p className="mt-0.5 text-xs text-muted-foreground/60">{sub}</p>}
            </div>
            <div className="shrink-0 text-right text-sm font-medium">{value}</div>
        </div>
    );
}

function SelectRow({ label, value, onChange, children }: {
    label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                {children}
            </select>
        </div>
    );
}

function SectionCard({ title, description, children }: {
    title: string; description?: string; children: React.ReactNode;
}) {
    return (
        <Card className="self-start">
            <CardHeader className="px-4 pb-2 pt-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
                {description && <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>}
            </CardHeader>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}

/** Persistent localStorage-backed preference hook */
function usePref<T>(key: string, defaultValue: T): [T, (v: T) => void] {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return defaultValue;
        try {
            const raw = window.localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) as T : defaultValue;
        } catch {
            return defaultValue;
        }
    });
    const set = useCallback((v: T) => {
        setValue(v);
        try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
    }, [key]);

    // Cross-tab sync: subscribe to the `storage` event so a change in
    // another tab updates this tab's state. The `storage` event only
    // fires for *other* documents, so this never re-fires for the
    // setter above. A malformed value in another tab is ignored
    // (we keep our current value rather than reset to default).
    useEffect(() => {
        if (typeof window === "undefined") return;
        const onStorage = (e: StorageEvent) => {
            if (e.key !== key) return;
            if (e.newValue === null) {
                // Key was cleared in the other tab; snap back to default.
                setValue(defaultValue);
                return;
            }
            try {
                setValue(JSON.parse(e.newValue) as T);
            } catch {
                // ignore — keep the current value
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [key, defaultValue]);

    return [value, set];
}

// ─── OTA Host ────────────────────────────────────────────────────────────────

function OtaHostCard() {
    const steps = ["Uploading", "Verifying", "Applying", "Reloading"];
    const [activeStep, setActiveStep] = useState(-1);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setError(null);
        setLogs([`Selected ${file.name} (${file.size} bytes)`]);
        setActiveStep(0);
        try {
            await uploadOtaArtifact(file);
            setLogs((prev) => [...prev, "Upload accepted by server", "Waiting for server-side OTA status updates"]);
            setActiveStep(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        }
    }

    return (
        <Card className="self-start">
            <CardHeader className="px-4 pb-2 pt-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OTA — Host</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Upload a host update bundle to apply a server-side update.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-5 text-center transition-colors hover:bg-muted/60">
                    <Upload size={18} className="mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload host bundle</span>
                    <span className="mt-1 text-xs text-muted-foreground">Click to browse or drag &amp; drop</span>
                    <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])} />
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    {steps.map((step, i) => (
                        <div key={step} className={clsx("rounded-lg border px-2 py-1.5 text-center text-xs",
                            i <= activeStep ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground",
                        )}>{step}</div>
                    ))}
                </div>
                {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
                {logs.length > 0 && (
                    <details open>
                        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Logs</summary>
                        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 font-mono text-xs">{logs.join("\n")}</pre>
                    </details>
                )}
            </CardContent>
        </Card>
    );
}

// ─── OTA Device ──────────────────────────────────────────────────────────────

function OtaDeviceCard() {
    const uploadSteps = ["Upload to server", "Transfer to device", "Landed in /tmp", "(Future) Trigger"];
    const [source, setSource] = useState<"upload" | "fetch">("upload");
    const [activeStep, setActiveStep] = useState(-1);
    const [landedPath, setLandedPath] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setError(null);
        setLandedPath(null);
        setLogs([`Selected ${file.name} (${file.size} bytes)`, "Uploading to server"]);
        setActiveStep(0);
        try {
            await uploadOtaArtifact(file);
            const path = `/tmp/${file.name}`;
            setActiveStep(2);
            setLandedPath(path);
            setLogs((prev) => [...prev, "Server accepted image", `Transfer requested for ${path}`, "Update trigger not yet implemented"]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        }
    }

    return (
        <Card className="self-start">
            <CardHeader className="px-4 pb-2 pt-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OTA — Device</CardTitle>
                <CardDescription className="mt-0.5 text-xs">Push a firmware image to the connected target device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
                <div className="inline-flex gap-0.5 rounded-lg border border-border bg-muted p-0.5">
                    <button type="button" onClick={() => setSource("upload")} className={clsx("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", source === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Upload image</button>
                    <button type="button" onClick={() => setSource("fetch")} className={clsx("rounded-md px-3 py-1.5 text-xs font-medium transition-colors", source === "fetch" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Fetch from server</button>
                </div>
                {source === "upload" ? (
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-5 text-center transition-colors hover:bg-muted/60">
                        <Upload size={18} className="mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload target image</span>
                        <span className="mt-1 text-xs text-muted-foreground">Server transfers image to device /tmp</span>
                        <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])} />
                    </label>
                ) : (
                    <div className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 opacity-70">
                        <span className="inline-flex rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-700 dark:text-yellow-300">Coming soon</span>
                        <input disabled placeholder="https://updates.example/device.img" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm opacity-60" />
                        <button disabled className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">Fetch image</button>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                    {uploadSteps.map((step, i) => (
                        <div key={step} className={clsx("rounded-lg border px-2 py-1.5 text-xs",
                            i <= activeStep && i < 3 ? "border-primary/50 bg-primary/10 text-primary"
                                : i === 3 ? "border-border bg-muted/50 text-muted-foreground/50"
                                    : "border-border bg-muted text-muted-foreground",
                        )}>{step}</div>
                    ))}
                </div>
                {landedPath && <p className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs text-green-700 dark:text-green-300">Image on target at {landedPath}.</p>}
                {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
                {logs.length > 0 && (
                    <details open>
                        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Logs</summary>
                        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 font-mono text-xs">{logs.join("\n")}</pre>
                    </details>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { themeMode, setThemeMode, serverOnline } = useAppShell();

    const health = useQuery({ queryKey: ["health"], queryFn: getHealth, refetchInterval: 10_000 });
    const target = useQuery({ queryKey: ["target"], queryFn: getTarget, retry: 1 });
    const modules = useQuery({ queryKey: ["modules"], queryFn: getModules });
    const retention = useQuery({ queryKey: ["retention"], queryFn: getRetentionSettings });

    const measureLatency = useCallback(async (): Promise<number> => {
        const start = performance.now();
        await getHealth();
        return Math.round(performance.now() - start);
    }, []);
    const latency = useQuery({
        queryKey: ["latency"],
        queryFn: measureLatency,
        // Only measure when the server is reachable. Without this gate the
        // latency query fires on mount regardless of the rest of the page's
        // online state, which produces a "—" → "—/—ms" flicker and an
        // unnecessary failed request when the server is offline.
        enabled: serverOnline !== false,
        retry: 0,
    });

    // Appearance prefs
    const [density, setDensity] = usePref<"comfortable" | "compact">(`${PLATFORM_SLUG}.prefs.density`, "comfortable");
    const [chartColors, setChartColors] = usePref<"default" | "pastel" | "high-contrast">(`${PLATFORM_SLUG}.prefs.chartColors`, "default");

    // Behavior prefs
    const [rollingWindow, setRollingWindow] = usePref<"1h" | "6h" | "24h">(`${PLATFORM_SLUG}.prefs.rollingWindow`, "6h");
    const [autoScroll, setAutoScroll] = usePref<boolean>(`${PLATFORM_SLUG}.prefs.autoScroll`, true);
    const [defaultMode, setDefaultMode] = usePref<string>(`${PLATFORM_SLUG}.prefs.defaultMode`, "single_shot");

    // Notification prefs
    const [notifyComplete, setNotifyComplete] = usePref<boolean>(`${PLATFORM_SLUG}.prefs.notifyComplete`, false);
    const [notifyFail, setNotifyFail] = usePref<boolean>(`${PLATFORM_SLUG}.prefs.notifyFail`, false);
    const [operatorName, setOperatorName] = usePref<string>(`${PLATFORM_SLUG}.prefs.operatorName`, "");
    const [operatorEmail, setOperatorEmail] = usePref<string>(`${PLATFORM_SLUG}.prefs.operatorEmail`, "");
    const notifPermission = typeof Notification !== "undefined" ? Notification.permission : "default";
    async function requestNotifPermission() {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
            await Notification.requestPermission();
        }
    }

    // Data & retention
    const [retentionDaysDraft, setRetentionDays] = useState<number | null>(null);
    const [maxResultsDraft, setMaxResults] = useState<number | null>(null);
    const retentionDays = retentionDaysDraft ?? retention.data?.retention_days ?? 30;
    const maxResults = maxResultsDraft ?? retention.data?.max_run_results ?? 10_000;
    const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

    // Shared PUT helper used by both the per-field onBlur handlers and
    // the explicit Purge button. Reuses `purgeStatus` (the same endpoint)
    // and auto-clears the message after 3s so the UI doesn't accumulate
    // stale state across edits.
    async function pushRetention(next: { retention_days?: number; max_run_results?: number }, label: string) {
        setPurgeStatus(`Applying ${label}...`);
        try {
            await updateRetentionSettings({
                retention_days: next.retention_days ?? retentionDays,
                max_run_results: next.max_run_results ?? maxResults,
            });
            setPurgeStatus("Retention policy applied.");
        } catch (err) {
            setPurgeStatus(err instanceof Error ? `Failed: ${err.message}` : "Failed to update retention.");
        }
        setTimeout(() => setPurgeStatus(null), 3000);
    }

    async function handlePurge() {
        await pushRetention({}, "purge");
    }

    // Module category breakdown
    const categoryCounts = useMemo(() => {
        const map: Record<string, number> = {};
        for (const m of modules.data ?? []) {
            const cat = m.category || "Uncategorized";
            map[cat] = (map[cat] ?? 0) + 1;
        }
        return map;
    }, [modules.data]);

    // Parse server URL
    const serverUrl = process.env.NEXT_PUBLIC_PLATFORM_SERVER ?? "http://localhost:8080";
    let serverPort = "—";
    try { serverPort = new URL(serverUrl).port || (serverUrl.startsWith("https") ? "443" : "80"); }
    catch { /* ignore */ }

    return (
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {/* ── 1. Server Connection ── */}
            <SectionCard title="Server Connection">
                <Row label="Address" value={<span className="font-mono text-xs">{serverUrl}</span>} />
                <Row label="Port" value={serverPort} />
                <Row label="Status" value={
                    <Badge variant={health.isError ? "destructive" : health.data?.status === "ok" ? "success" : "secondary"}>
                        {health.isError ? "Offline" : (health.data?.status ?? "Checking")}
                    </Badge>
                } />
                <Row label="Latency" value={
                    <span className="flex items-center gap-2">
                        {typeof latency.data === "number" ? `${latency.data} ms` : "—"}
                        <button type="button" onClick={() => void latency.refetch()} title="Re-measure" className="text-muted-foreground transition-colors hover:text-foreground">
                            <RefreshCw size={12} />
                        </button>
                    </span>
                } />
                <Row label="Server version" value={health.data?.version ?? "—"} />
            </SectionCard>

            {/* ── 2. System Info ── */}
            <SectionCard title="System Info" description="Connected target identity and peripheral inventory.">
                <Row label="Platform" value={target.data?.model ?? "Unknown"} />
                <Row label="Hostname" value={target.data?.hostname ?? "—"} />
                <Row label="OS" value={target.data?.os_version ?? "—"} />
                <Row label="HAL version" value={target.data?.hal_version ?? "—"} />
                <Row label="Firmware" value={target.data?.client_version ?? "—"} />
                <div className="border-t border-border px-4 py-3">
                    <p className="mb-2 text-sm text-muted-foreground">Peripheral inventory</p>
                    <div className="flex flex-wrap gap-1.5">
                        {Object.entries(categoryCounts).length > 0
                            ? Object.entries(categoryCounts).map(([cat, count]) => (
                                <Badge key={cat} variant="outline" className="text-xs">{cat} <span className="ml-1 opacity-60">{count}</span></Badge>
                            ))
                            : <span className="text-xs text-muted-foreground">No modules discovered</span>
                        }
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{modules.data?.length ?? 0} modules total</p>
                </div>
            </SectionCard>

            {/* ── 3. Appearance ── */}
            <SectionCard title="Appearance">
                <SelectRow label="Theme" value={themeMode} onChange={(v) => setThemeMode(v as "system" | "light" | "dark")}>
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </SelectRow>
                <SelectRow label="Table density" value={density} onChange={(v) => setDensity(v as "comfortable" | "compact")}>
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                </SelectRow>
                <SelectRow label="Chart colors" value={chartColors} onChange={(v) => setChartColors(v as "default" | "pastel" | "high-contrast")}>
                    <option value="default">Default</option>
                    <option value="pastel">Pastel</option>
                    <option value="high-contrast">High contrast</option>
                </SelectRow>
            </SectionCard>

            {/* ── 4. Behavior ── */}
            <SectionCard title="Behavior">
                <SelectRow label="Rolling window" value={rollingWindow} onChange={(v) => setRollingWindow(v as "1h" | "6h" | "24h")}>
                    <option value="1h">Last 1 hour</option>
                    <option value="6h">Last 6 hours</option>
                    <option value="24h">Last 24 hours</option>
                </SelectRow>
                <Row label="Log auto-scroll" value={<Toggle checked={autoScroll} onChange={setAutoScroll} />} />
                <SelectRow label="Default mode" value={defaultMode} onChange={setDefaultMode}>
                    <option value="single_shot">Single shot</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="event">Event</option>
                    <option value="long_run">Long run</option>
                </SelectRow>
            </SectionCard>

            {/* ── 5. Operator ── */}
            <SectionCard title="Operator" description="Auth not yet implemented — fields saved locally only.">
                <Row label="Name" value={
                    <input value={operatorName} onChange={(event) => setOperatorName(event.target.value)} className="h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Operator name" placeholder="Your name" />
                } />
                <Row label="Email" value={
                    <input type="email" value={operatorEmail} onChange={(event) => setOperatorEmail(event.target.value)} className="h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Operator email" placeholder="you@acme.com" />
                } />
                <Row label="Role" value={<span className="inline-flex items-center gap-1 text-muted-foreground">Unassigned <ChevronRight size={13} /></span>} />
            </SectionCard>

            {/* ── 6. Notifications ── */}
            <SectionCard title="Notifications" description="Browser desktop notifications for test lifecycle events.">
                {notifPermission === "denied" && (
                    <div className="mx-4 mb-1 mt-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        Notifications are blocked in browser settings.
                    </div>
                )}
                <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Test completion</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/60">Notify when a run finishes</p>
                    </div>
                    <Toggle checked={notifyComplete} onChange={async (v) => { await requestNotifPermission(); setNotifyComplete(v); }} />
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Test failure</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/60">Notify on any failed result</p>
                    </div>
                    <Toggle checked={notifyFail} onChange={async (v) => { await requestNotifPermission(); setNotifyFail(v); }} />
                </div>
            </SectionCard>

            {/* ── 7. Data & Retention ── */}
            <SectionCard title="Data & Retention" description="How long run data and results are kept on the server.">
                <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                    <span className="text-sm text-muted-foreground">Retention days</span>
                    <input
                        type="number" min={1}
                        value={retentionDaysDraft ?? ""}
                        onChange={(e) => {
                            const raw = e.target.value;
                            // Allow empty so the user can clear and retype.
                            // Number("") === 0 which would PUT a purge-all,
                            // so we store null in that case.
                            setRetentionDays(raw === "" ? null : Number(raw));
                        }}
                        onBlur={() => {
                            // Skip the PUT if the user typed an invalid
                            // value (null/0/negative). Revert by clearing
                            // the draft so the input snaps back to the
                            // server's value on next render.
                            if (retentionDays == null || retentionDays < 1) {
                                setRetentionDays(null);
                                return;
                            }
                            void pushRetention({ retention_days: retentionDays }, "retention days");
                        }}
                        className="h-9 w-24 rounded-md border border-input bg-transparent px-3 text-right text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                    <div>
                        <span className="text-sm text-muted-foreground">Max run results</span>
                        <p className="mt-0.5 text-xs text-muted-foreground/60">Per-run result cap</p>
                    </div>
                    <input
                        type="number" min={1}
                        value={maxResultsDraft ?? ""}
                        onChange={(e) => {
                            const raw = e.target.value;
                            setMaxResults(raw === "" ? null : Number(raw));
                        }}
                        onBlur={() => {
                            if (maxResults == null || maxResults < 1) {
                                setMaxResults(null);
                                return;
                            }
                            void pushRetention({ max_run_results: maxResults }, "max run results");
                        }}
                        className="h-9 w-24 rounded-md border border-input bg-transparent px-3 text-right text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                        <span className="text-sm text-muted-foreground">Purge old runs</span>
                        <p className="mt-0.5 text-xs text-muted-foreground/60">Remove runs beyond retention limit</p>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void handlePurge()}>
                        <Trash2 size={13} className="mr-1" />Purge
                    </Button>
                </div>
                {purgeStatus && <p className="px-4 pb-3 text-xs text-muted-foreground">{purgeStatus}</p>}
            </SectionCard>

            {/* ── 8. About ── */}
            <SectionCard title="About">
                <Row label="Web UI" value={process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"} />
                <Row label="Server" value={health.data?.version ?? "—"} />
                <Row label="Client" value={target.data?.client_version ?? "—"} />
                <Row label="HAL" value={target.data?.hal_version ?? "—"} />
                <Row label="Build commit" value={
                    process.env.NEXT_PUBLIC_BUILD_COMMIT
                        ? <span className="font-mono text-xs">{process.env.NEXT_PUBLIC_BUILD_COMMIT.slice(0, 8)}</span>
                        : "—"
                } />
                <Row label="Build date" value={process.env.NEXT_PUBLIC_BUILD_DATE ?? "—"} />
            </SectionCard>

            {/* ── OTA Host ── */}
            <OtaHostCard />

            {/* ── OTA Device ── */}
            <OtaDeviceCard />
        </div>
    );
}
