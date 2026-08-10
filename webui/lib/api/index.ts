import { apiUrl, fetchJson } from "@/lib/api/client";
import type {
  ConfigsResponse,
  ConfigInfo,
  ExecutionMode,
  HealthResponse,
  LogsResponse,
  ModuleInfo,
  OtaListResponse,
  RetentionSettings,
  Run,
  RunResultsResponse,
  RunsResponse,
  TargetInfo,
} from "@/lib/types/api";

export async function getHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>("/api/v1/health");
}

export async function getTarget(): Promise<TargetInfo> {
  return fetchJson<TargetInfo>("/api/v1/target");
}

export async function getModules(): Promise<ModuleInfo[]> {
  const data = await fetchJson<{ modules: ModuleInfo[] }>("/api/v1/modules");
  return data.modules;
}

export async function getModule(moduleId: string): Promise<ModuleInfo> {
  return fetchJson<ModuleInfo>(`/api/v1/modules/${moduleId}`);
}

export async function getConfigs(): Promise<ConfigsResponse> {
  return fetchJson<ConfigsResponse>("/api/v1/configs");
}

export async function createConfig(payload: {
  name: string;
  description: string;
  mode: ExecutionMode;
  common_config: Record<string, unknown>;
  modules: Array<Record<string, unknown>>;
}): Promise<ConfigInfo> {
  return fetchJson<ConfigInfo>("/api/v1/configs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getRuns(params?: {
  mode?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<RunsResponse> {
  const q = new URLSearchParams();
  if (params?.mode) q.set("mode", params.mode);
  if (params?.status) q.set("status", params.status);
  if (typeof params?.limit === "number") q.set("limit", String(params.limit));
  if (typeof params?.offset === "number") q.set("offset", String(params.offset));
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return fetchJson<RunsResponse>(`/api/v1/runs${suffix}`);
}

export async function createRun(mode: ExecutionMode, configId = ""): Promise<Run> {
  return fetchJson<Run>("/api/v1/runs", {
    method: "POST",
    body: JSON.stringify({ config_id: configId, mode }),
  });
}

export async function uploadOtaArtifact(file: File): Promise<unknown> {
  const formData = new FormData();
  formData.set("artifact", file);

  const response = await fetch(apiUrl("/api/v1/ota/upload"), {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OTA upload ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204) return {};
  return response.json() as Promise<unknown>;
}

export async function getRun(runId: string): Promise<Run> {
  return fetchJson<Run>(`/api/v1/runs/${runId}`);
}

export async function cancelRun(runId: string): Promise<{ ok: boolean }> {
  return fetchJson<{ ok: boolean }>(`/api/v1/runs/${runId}/cancel`, {
    method: "POST",
  });
}

export async function getRunResults(
  runId: string,
  params?: { moduleId?: string; limit?: number; offset?: number },
): Promise<RunResultsResponse> {
  const q = new URLSearchParams();
  if (params?.moduleId) q.set("module_id", params.moduleId);
  if (typeof params?.limit === "number") q.set("limit", String(params.limit));
  if (typeof params?.offset === "number") q.set("offset", String(params.offset));
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return fetchJson<RunResultsResponse>(`/api/v1/runs/${runId}/results${suffix}`);
}

export async function getGlobalLogs(params?: {
  source?: string;
  level?: string;
  runId?: string;
  query?: string;
  limit?: number;
}): Promise<LogsResponse> {
  const q = new URLSearchParams();
  if (params?.source) q.set("source", params.source);
  if (params?.level) q.set("level", params.level);
  if (params?.runId) q.set("run_id", params.runId);
  if (params?.query) q.set("query", params.query);
  if (typeof params?.limit === "number") q.set("limit", String(params.limit));
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return fetchJson<LogsResponse>(`/api/v1/logs${suffix}`);
}

export async function getOta(): Promise<OtaListResponse> {
  return fetchJson<OtaListResponse>("/api/v1/ota");
}

export async function getRetentionSettings(): Promise<RetentionSettings> {
  return fetchJson<RetentionSettings>("/api/v1/settings/retention");
}

export async function updateRetentionSettings(
  payload: Partial<RetentionSettings>,
): Promise<RetentionSettings> {
  return fetchJson<RetentionSettings>("/api/v1/settings/retention", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
