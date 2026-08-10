import { describe, it, expect } from "vitest";
import { formatDuration, formatRunDuration, normalizeStatus, resultVariant, safeDecodeSegment } from "./utils";

describe("formatDuration", () => {
    it("returns em-dash for falsy input", () => {
        expect(formatDuration(undefined)).toBe("—");
        expect(formatDuration(0)).toBe("—");
    });

    it("formats nanoseconds in microseconds below 1ms", () => {
        expect(formatDuration(500)).toBe("0.5 µs");
        expect(formatDuration(12_345)).toBe("12.3 µs");
    });

    it("formats sub-second in milliseconds below 1s", () => {
        expect(formatDuration(1_500_000)).toBe("1.5 ms");
        expect(formatDuration(123_456_789)).toBe("123.5 ms");
    });

    it("formats seconds at 1s and above", () => {
        expect(formatDuration(1_000_000_000)).toBe("1.00 s");
        expect(formatDuration(3_500_000_000)).toBe("3.50 s");
    });
});

describe("formatRunDuration", () => {
    it("returns em-dash when either end is missing", () => {
        expect(formatRunDuration(undefined, undefined)).toBe("—");
        expect(formatRunDuration("2024-01-01T00:00:00Z", undefined)).toBe("—");
    });

    it("returns em-dash when end is before start", () => {
        expect(formatRunDuration("2024-01-01T00:00:01Z", "2024-01-01T00:00:00Z")).toBe("—");
    });

    it("formats sub-minute durations in seconds", () => {
        expect(formatRunDuration("2024-01-01T00:00:00Z", "2024-01-01T00:00:12.500Z")).toBe("12.5s");
    });

    it("formats minute-plus durations as Xm Ys", () => {
        expect(formatRunDuration("2024-01-01T00:00:00Z", "2024-01-01T00:02:30Z")).toBe("2m 30s");
    });
});

describe("normalizeStatus", () => {
    it("em-dash for falsy", () => {
        expect(normalizeStatus(undefined)).toBe("—");
        expect(normalizeStatus("")).toBe("—");
    });

    it("title-cases UPPER and lower inputs", () => {
        expect(normalizeStatus("PASS")).toBe("Pass");
        expect(normalizeStatus("fail")).toBe("Fail");
        expect(normalizeStatus("running")).toBe("Running");
    });
});

describe("resultVariant", () => {
    it("maps pass to success", () => {
        expect(resultVariant("pass")).toBe("success");
    });

    it("maps fail and error to destructive", () => {
        expect(resultVariant("fail")).toBe("destructive");
        expect(resultVariant("error")).toBe("destructive");
    });

    it("maps warn to warning", () => {
        expect(resultVariant("warn")).toBe("warning");
    });

    it("falls back to secondary for unknown", () => {
        expect(resultVariant("skipped")).toBe("secondary");
        expect(resultVariant(undefined)).toBe("secondary");
    });
});

describe("safeDecodeSegment", () => {
    it("returns empty string for nullish input", () => {
        expect(safeDecodeSegment(undefined)).toBe("");
        expect(safeDecodeSegment(null)).toBe("");
        expect(safeDecodeSegment("")).toBe("");
    });

    it("decodes valid percent-encoded input", () => {
        expect(safeDecodeSegment("hello%20world")).toBe("hello world");
        expect(safeDecodeSegment("zion%2Fdash")).toBe("zion/dash");
    });

    it("returns the raw value when the input is malformed", () => {
        // Trailing %E0%A4%A is a partial escape that throws URIError when decoded.
        expect(() => decodeURIComponent("%E0%A4%A")).toThrow();
        // safeDecodeSegment must NOT throw — it should return the raw string.
        expect(safeDecodeSegment("%E0%A4%A")).toBe("%E0%A4%A");
    });
});
