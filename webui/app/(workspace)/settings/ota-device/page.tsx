"use client";

import clsx from "clsx";
import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadOtaArtifact } from "@/lib/api";

const uploadSteps = ["Uploading to server", "Transferring to device", "Image landed in /tmp", "(Future) Triggering update"];

export default function OtaDevicePage() {
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
            setLogs((prev) => [...prev, "Server accepted image", `Device transfer requested for ${path}`, "Update trigger is not implemented in v1"]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        }
    }

    return (
        <section className="rounded-2xl border border-white/50 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/55">
            <h2 className="text-xl font-semibold">OTA - Device</h2>
            <div className="mt-4 inline-flex rounded-full border border-zinc-300 bg-white/70 p-1 dark:border-zinc-700 dark:bg-zinc-950/70">
                <button type="button" onClick={() => setSource("upload")} className={clsx("rounded-full px-4 py-1.5 text-sm font-medium", source === "upload" ? "bg-sky-600 text-white" : "text-zinc-700 dark:text-zinc-200")}>Upload image</button>
                <button type="button" onClick={() => setSource("fetch")} className={clsx("rounded-full px-4 py-1.5 text-sm font-medium", source === "fetch" ? "bg-sky-600 text-white" : "text-zinc-700 dark:text-zinc-200")}>Fetch from update server</button>
            </div>

            {source === "upload" ? (
                <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white/60 p-6 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
                    <Upload className="mb-3" />
                    <span className="font-medium">Upload target image</span>
                    <span className="mt-1 text-sm text-zinc-500">The server transfers the image to the target /tmp location.</span>
                    <input type="file" className="sr-only" onChange={(event) => event.target.files?.[0] && void handleFile(event.target.files[0])} />
                </label>
            ) : (
                <div className="mt-4 rounded-2xl border border-zinc-300 bg-zinc-100 p-4 opacity-70 dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="mb-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">Coming soon</div>
                    <input disabled placeholder="https://updates.example/device.img" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
                    <button disabled className="mt-3 rounded-full bg-zinc-400 px-4 py-2 text-sm font-semibold text-white">Fetch image</button>
                </div>
            )}

            <div className="mt-5 grid gap-2 md:grid-cols-4">
                {uploadSteps.map((step, index) => <div key={step} className={clsx("rounded-xl border px-3 py-2 text-sm", index <= activeStep && index < 3 ? "border-sky-400 bg-sky-50 text-sky-900 dark:bg-sky-950/30 dark:text-sky-100" : index === 3 ? "border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900" : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900")}>{step}</div>)}
            </div>
            {landedPath && <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">Image is on the target at {landedPath}. Update trigger is not yet implemented; complete the update manually if needed.</div>}
            {error && <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{error}</div>}
            <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-950 p-3 text-sm text-zinc-100 dark:border-zinc-700" open>
                <summary className="cursor-pointer font-medium">Logs</summary>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs">{logs.length ? logs.join("\n") : "No OTA activity yet."}</pre>
            </details>
        </section>
    );
}