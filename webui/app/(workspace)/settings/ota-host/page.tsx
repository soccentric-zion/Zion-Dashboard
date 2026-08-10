"use client";

import clsx from "clsx";
import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadOtaArtifact } from "@/lib/api";

const steps = ["Uploading", "Verifying", "Applying", "Reloading"];

export default function OtaHostPage() {
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
        <section className="rounded-2xl border border-white/50 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/55">
            <h2 className="text-xl font-semibold">OTA - Host</h2>
            <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white/60 p-6 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
                <Upload className="mb-3" />
                <span className="font-medium">Upload host update bundle</span>
                <span className="mt-1 text-sm text-zinc-500">Drag-drop support is browser-native here; click to browse.</span>
                <input type="file" className="sr-only" onChange={(event) => event.target.files?.[0] && void handleFile(event.target.files[0])} />
            </label>

            <div className="mt-5 grid gap-2 md:grid-cols-4">
                {steps.map((step, index) => <div key={step} className={clsx("rounded-xl border px-3 py-2 text-sm", index <= activeStep ? "border-sky-400 bg-sky-50 text-sky-900 dark:bg-sky-950/30 dark:text-sky-100" : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900")}>{step}</div>)}
            </div>
            {error && <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{error}</div>}
            <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-950 p-3 text-sm text-zinc-100 dark:border-zinc-700" open>
                <summary className="cursor-pointer font-medium">Logs</summary>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs">{logs.length ? logs.join("\n") : "No OTA activity yet."}</pre>
            </details>
        </section>
    );
}