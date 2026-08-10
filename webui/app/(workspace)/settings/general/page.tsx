"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { getHealth, getModules, getRetentionSettings, getTarget, updateRetentionSettings } from "@/lib/api";
import { useAppShell } from "@/state/app-shell-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-right text-sm font-medium">{value}</span>
        </div>
    );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}

export default function GeneralSettingsPage() {
    const { themeMode, setThemeMode } = useAppShell();
    const health = useQuery({ queryKey: ["health"], queryFn: getHealth, refetchInterval: 10_000 });
    const target = useQuery({ queryKey: ["target"], queryFn: getTarget, retry: 1 });
    const modules = useQuery({ queryKey: ["modules"], queryFn: getModules });
    const retention = useQuery({ queryKey: ["retention"], queryFn: getRetentionSettings });

    return (
        <div className="space-y-5 pb-8">
            <Group title="Connection">
                <Row label="Server address" value={process.env.NEXT_PUBLIC_PLATFORM_SERVER ?? "http://localhost:8080"} />
                <Row label="Connection status" value={health.isError ? "Offline" : health.data?.status ?? "Checking"} />
                <Row label="Server version" value={health.data?.version ?? "Unavailable"} />
            </Group>

            <Group title="System">
                <Row label="Platform" value={target.data?.model ?? "Unknown"} />
                <Row label="Hostname" value={target.data?.hostname ?? "Unavailable"} />
                <Row label="Firmware" value={target.data?.client_version ?? "Unavailable"} />
                <Row label="HAL" value={target.data?.hal_version ?? "Unavailable"} />
                <Row label="Peripheral inventory" value={`${modules.data?.length ?? 0} modules`} />
            </Group>

            <Group title="Preferences">
                <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                    <span className="text-sm text-muted-foreground">Appearance</span>
                    <select value={themeMode} onChange={(event) => setThemeMode(event.target.value as "system" | "light" | "dark")} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <Row label="Table density" value="Comfortable" />
                <Row label="Log auto-scroll default" value="Enabled" />
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Retention days</span>
                    <input
                        type="number"
                        min={1}
                        defaultValue={retention.data?.retention_days ?? 30}
                        onBlur={(event) => void updateRetentionSettings({ retention_days: Number(event.target.value) })}
                        className="w-28 h-9 rounded-md border border-input bg-transparent px-3 text-right text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            </Group>

            <Group title="Operator">
                <Row label="Name" value={<input className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Operator name" />} />
                <Row label="Email" value={<input type="email" className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-label="Operator email" />} />
                <Row label="Role" value={<span className="inline-flex items-center gap-1 text-muted-foreground">Unassigned <ChevronRight size={14} /></span>} />
            </Group>
        </div>
    );
}