"use client";

import { BarChart2, FileText, LineChart, Download } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PLANNED_SECTIONS = [
    {
        icon: FileText,
        title: "Test Summary",
        description: "Aggregated pass/fail statistics",
        source: "GET /api/v1/runs?limit=200",
    },
    {
        icon: LineChart,
        title: "Trend Analysis",
        description: "Pass/fail trends over time",
        source: "GET /api/v1/runs?limit=2000 (time-bucketed)",
    },
    {
        icon: Download,
        title: "Export Reports",
        description: "Download reports in CSV / PDF / JSON",
        source: "GET /api/v1/runs/{id}/export",
    },
] as const;

export default function ReportingPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
                <BarChart2 className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reporting</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate and view test reports
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-warning/40 bg-warning/5 px-4 py-3">
                <p className="text-sm font-medium text-foreground">Coming soon</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    This page is a placeholder. The dashboard today exposes the
                    raw data via the Runs and Modules surfaces — click below to
                    see what would feed each planned section.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PLANNED_SECTIONS.map(({ icon: Icon, title, description, source }) => (
                    <Card key={title}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                {title}
                            </CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                                Will be sourced from
                            </p>
                            <code className="block rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                                {source}
                            </code>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                    In the meantime, runs and modules are the source of truth.
                </span>
                <Link
                    href="/runs"
                    className="font-medium text-primary hover:underline"
                >
                    Go to Runs →
                </Link>
            </div>
        </div>
    );
}