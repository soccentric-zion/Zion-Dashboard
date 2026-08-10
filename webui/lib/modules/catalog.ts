import { HAL_MODULE_CATALOG } from "@/lib/modules/hal-derived-catalog";
import { PLATFORM_SLUG } from "@/lib/platform";
import type { ExecutionMode, ModuleInfo } from "@/lib/types/api";

export type TestFieldType = "boolean" | "number" | "text" | "select";

export interface ModuleTestField {
    key: string;
    label: string;
    type: TestFieldType;
    defaultValue: boolean | number | string;
    unit?: string;
    options?: string[];
}

export interface ModuleTestDefinition {
    id: string;
    name: string;
    description: string;
    modes: ExecutionMode[];
    fields: ModuleTestField[];
}

export const MODULE_CACHE_KEY = `${PLATFORM_SLUG}.modules.catalog`;

export const FALLBACK_MODULES: ModuleInfo[] = HAL_MODULE_CATALOG.map((module) => ({
    id: module.id,
    name: module.name,
    description: module.description,
    version: module.version,
    category: module.category,
    result_type_url: module.result_type_url,
    config_type_url: module.config_type_url,
}));

export function readCachedModules(): ModuleInfo[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(MODULE_CACHE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isModuleInfo);
    } catch {
        return [];
    }
}

export function writeCachedModules(modules: ModuleInfo[]): void {
    if (typeof window === "undefined" || modules.length === 0) return;
    window.localStorage.setItem(MODULE_CACHE_KEY, JSON.stringify(modules));
}

export function modulesForOfflineDisplay(liveModules: ModuleInfo[] | undefined): ModuleInfo[] {
    if (liveModules && liveModules.length > 0) return mergeHalMetadata(liveModules);

    const cached = readCachedModules();
    if (cached.length > 0) return mergeHalMetadata(cached);

    return FALLBACK_MODULES;
}

export function testsForModule(module: ModuleInfo): ModuleTestDefinition[] {
    const halModule = HAL_MODULE_CATALOG.find((entry) => entry.id === module.id);
    const modes = halModule?.modes.length ? halModule.modes : (["single_shot", "monitoring", "event", "long_run"] as ExecutionMode[]);
    const tests = halModule?.tests.length
        ? halModule.tests
        : [
            {
                id: `${module.id}_availability`,
                name: "Availability",
                description: `HAL availability check for ${module.name || module.id}.`,
                modes,
            },
        ];

    return tests.map((test) => ({
        id: test.id,
        name: test.name,
        description: test.description,
        modes: test.modes,
        fields: fieldsForHalTest(module, test.id),
    }));
}

function mergeHalMetadata(modules: ModuleInfo[]): ModuleInfo[] {
    const byId = new Map(HAL_MODULE_CATALOG.map((module) => [module.id, module]));
    const merged = modules.map((module) => {
        const halModule = byId.get(module.id);
        if (!halModule) return module;

        return {
            id: module.id,
            name: module.name || halModule.name,
            description: module.description || halModule.description,
            version: module.version || halModule.version,
            category: module.category || halModule.category,
            result_type_url: module.result_type_url || halModule.result_type_url,
            config_type_url: module.config_type_url || halModule.config_type_url,
        };
    });

    for (const halModule of HAL_MODULE_CATALOG) {
        if (!merged.some((module) => module.id === halModule.id)) {
            merged.push({
                id: halModule.id,
                name: halModule.name,
                description: halModule.description,
                version: halModule.version,
                category: halModule.category,
                result_type_url: halModule.result_type_url,
                config_type_url: halModule.config_type_url,
            });
        }
    }

    return merged;
}

function fieldsForHalTest(module: ModuleInfo, testId: string): ModuleTestField[] {
    const fields: ModuleTestField[] = [
        {
            key: "test_names",
            label: "HAL test_names",
            type: "text",
            defaultValue: testId,
        },
        {
            key: "timeout_ms",
            label: "Timeout",
            type: "number",
            defaultValue: 5000,
            unit: "ms",
        },
    ];

    if (module.category === "connectivity" || module.category === "io") {
        fields.push({ key: "interface", label: "Interface / device", type: "text", defaultValue: defaultInterfaceFor(module.id) });
    }

    if (module.category === "sensors" || module.id.includes("thermal") || module.id.includes("environmental")) {
        fields.push({ key: "sample_interval_ms", label: "Sample interval", type: "number", defaultValue: 1000, unit: "ms" });
    }

    if (module.category === "storage") {
        fields.push({ key: "block_size_kb", label: "Block size", type: "number", defaultValue: 1024, unit: "KB" });
    }

    return fields;
}

function defaultInterfaceFor(moduleId: string): string {
    if (moduleId.includes("ethernet")) return "eth0";
    if (moduleId === "i2c") return "i2c-1";
    if (moduleId === "spi") return "/dev/spidev0.0";
    if (moduleId === "uart" || moduleId === "rs485") return "/dev/ttyS0";
    if (moduleId === "can_bus") return "can0";
    return "auto";
}

function isModuleInfo(value: unknown): value is ModuleInfo {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<ModuleInfo>;
    return typeof candidate.id === "string" && typeof candidate.name === "string";
}
