export type ExecutionMode = "single_shot" | "monitoring" | "event" | "long_run";

export interface HealthResponse {
  status: string;
  version: string;
}

export interface TargetInfo {
  id: string;
  name: string;
  hostname: string;
  model: string;
  status: string;
  first_seen: string;
  last_seen: string;
  os_version: string;
  hal_version: string;
  client_version: string;
}

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  result_type_url: string;
  config_type_url: string;
}

export interface RunsResponse {
  runs: Run[];
  total: number;
}

export interface Run {
  id: string;
  name: string;
  description: string;
  mode: string;
  status: string;
  baseline_flag: boolean;
  notes: string;
  error_message: string;
  created_at: string;
  created_by: string;
  started_at: string;
  ended_at: string;
  tags: Record<string, unknown>;
}

export type TypedValue = boolean | number | string;

export interface TestResult {
  id: string;
  run_id: string;
  module_id: string;
  module_version: string;
  test_id: string;
  name: string;
  sequence: number;
  timestamp: string;
  duration_ns: number;
  status: string;
  severity: string;
  error_message: string;
  mode: string;
  reason: Record<string, string>;
  metrics: Record<string, TypedValue>;
  monitoring: Record<string, TypedValue>;
  event: Record<string, TypedValue>;
  subtests: TestResult[];
  payload_type_url: string;
  payload_b64: string;
}

export interface RunResultsResponse {
  results: TestResult[];
  total: number;
}

export interface RunEventState {
  type: "state";
  run_id: string;
  status: string;
}

export interface LogEntry {
  id: string;
  run_id: string;
  source: string;
  level: string;
  severity: string;
  message: string;
  timestamp: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  total?: number;
}

export interface OtaUpgrade {
  id: string;
  status: string;
  progress: number;
  artifact_path: string;
  artifact_hash: string;
  from_version: string;
  to_version: string;
  created_at: string;
  ended_at: string;
}

export interface OtaListResponse {
  upgrades: OtaUpgrade[];
}

export interface RetentionSettings {
  retention_days: number;
  max_run_results: number;
}

export interface ConfigInfo {
  id: string;
  name: string;
  description?: string;
  mode?: string;
  module_id?: string;
  common_config?: string | Record<string, unknown>;
  modules?: string | Array<Record<string, unknown>>;
  payload?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ConfigsResponse {
  configs: ConfigInfo[];
}

export interface ModuleRunSelection {
  moduleId: string;
  moduleName: string;
  configTypeUrl: string;
  enabledTestNames: string[];
  moduleConfig: Record<string, unknown>;
}
