"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ModuleWorkspace } from "@/components/module-page/module-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getModule } from "@/lib/api";
import { modulesForOfflineDisplay } from "@/lib/modules/catalog";
import { safeDecodeSegment } from "@/lib/utils";

export default function ModulePage() {
    const params = useParams<{ moduleId: string }>();
    // Keep the raw segment for the query key. Two URLs that decode to
    // the same id (e.g. "/modules/foo" vs "/modules/%66oo") share the
    // same cache entry today, but if a module id ever differed only
    // by encoding (e.g. "foo+bar" vs "foo%20bar") the decoded key
    // would silently collide. Use the raw segment for caching; the
    // decoded form is for display and for getModule().
    const rawModuleId = params.moduleId;
    const moduleId = useMemo(() => safeDecodeSegment(rawModuleId), [rawModuleId]);
    const { data: module, isLoading, isError, refetch } = useQuery({
        queryKey: ["module", rawModuleId],
        queryFn: () => getModule(moduleId),
    });
    const fallbackModule = useMemo(() => modulesForOfflineDisplay(undefined).find((item) => item.id === moduleId), [moduleId]);

    if (isLoading) return <div className="h-80 animate-pulse rounded-2xl bg-white/65 dark:bg-zinc-900/55" />;

    if ((isError || !module) && fallbackModule) {
        return <ModuleWorkspace key={fallbackModule.id} module={fallbackModule} />;
    }

    if (!module) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Module unavailable</CardTitle>
                    <CardDescription>The server did not return metadata for {moduleId}, and no cached or baseline module matches it.</CardDescription>
                    <div><Button type="button" onClick={() => void refetch()}>Retry</Button></div>
                </CardHeader>
            </Card>
        );
    }

    // key={module.id} forces React to remount the workspace when navigating
    // between sibling modules with the same dynamic segment. The workspace's
    // useState lazy initializers (testPlan, moduleEnabled) only run on mount,
    // so without this the second module reuses the first module's persisted
    // plan and enabled flag.
    return <ModuleWorkspace key={module.id} module={module} />;
}