import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format an ISO timestamp as a locale time string (HH:MM:SS). */
export function formatClock(iso: string | undefined): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString();
}

/** Format a nanosecond duration into a human-readable string. */
export function formatDuration(ns: number | undefined): string {
    if (!ns) return "—";
    if (ns < 1_000_000) return `${(ns / 1_000).toFixed(1)} µs`;
    if (ns < 1_000_000_000) return `${(ns / 1_000_000).toFixed(1)} ms`;
    return `${(ns / 1_000_000_000).toFixed(2)} s`;
}

/** Format the wall-clock duration between two ISO timestamps. */
export function formatRunDuration(startIso: string | undefined, endIso: string | undefined): string {
    if (!startIso || !endIso) return "—";
    const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
    if (ms <= 0) return "—";
    if (ms < 60_000) return `${(ms / 1_000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60_000);
    const secs = Math.round((ms % 60_000) / 1_000);
    return `${mins}m ${secs}s`;
}

/** Map a generic status string to a badge variant. */
export function statusVariant(status: string | undefined): "success" | "warning" | "destructive" | "secondary" {
    const normalized = status?.toLowerCase() ?? "";
    if (normalized.includes("ok") || normalized.includes("online") || normalized.includes("pass") || normalized.includes("complete")) return "success";
    if (normalized.includes("warn") || normalized.includes("running") || normalized.includes("pending")) return "warning";
    if (normalized.includes("error") || normalized.includes("fail") || normalized.includes("offline") || normalized.includes("cancel")) return "destructive";
    return "secondary";
}

/** Map a test-result status string to a badge variant. */
export function resultVariant(status: string | undefined): "success" | "destructive" | "warning" | "secondary" {
    const s = status?.toLowerCase() ?? "";
    if (s.includes("pass")) return "success";
    if (s.includes("fail") || s.includes("error")) return "destructive";
    if (s.includes("warn")) return "warning";
    return "secondary";
}

/** Normalise a raw API status string to Title Case for display (e.g. "PASS" → "Pass"). */
export function normalizeStatus(status: string | undefined): string {
    if (!status) return "—";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/**
 * Safely decode a URL path segment. Next.js hands the dynamic segment raw
 * (e.g. "%E0%A4%A") and we usually want the decoded form, but a malformed
 * escape throws URIError and white-screens the page when no error
 * boundary exists above. Fall back to the raw value on failure.
 */
export function safeDecodeSegment(value: string | undefined | null): string {
    if (!value) return "";
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}
