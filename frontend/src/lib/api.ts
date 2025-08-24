// lib/api.ts
export class ApiError extends Error {
  status: number;
  info?: unknown;
  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

type FetchOpts = Omit<RequestInit, "body"> & { body?: unknown; timeoutMs?: number };

export async function http<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const { timeoutMs = 15000, body, headers, ...rest } = opts;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  }).catch((err) => {
    clearTimeout(t);
    throw new ApiError(`Network error: ${err?.message ?? err}`, 0);
  });

  clearTimeout(t);

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status, data);
  }

  return data as T;
}

function safeJson(text: string) {
  try { return JSON.parse(text); } catch { return text; }
}
