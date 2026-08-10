const API_BASE =
  process.env.NEXT_PUBLIC_PLATFORM_SERVER?.replace(/\/$/, "") ?? "http://localhost:8080";

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
