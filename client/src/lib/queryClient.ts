import { QueryClient, QueryFunction } from "@tanstack/react-query";

/** Safely read a response body as JSON or text (handles empty bodies too) */
async function readBody(res: Response): Promise<any | string | null> {
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const text = await res.text(); // can be empty
  if (!text) return null;
  try {
    return isJson ? JSON.parse(text) : text;
  } catch {
    return text;
  }
}

/** Throw with a useful message when the response is not ok */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const body = await readBody(res);
    const msg =
      (body && typeof body === "object" && ("message" in body || "error" in body)
        ? (body as any).message ?? (body as any).error
        : typeof body === "string"
        ? body
        : res.statusText) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
}

/** Use this everywhere you do fetches from the UI */
export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown,
): Promise<T> {
  // Detect FormData to support multipart uploads (e.g., preview image)
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const res = await fetch(url, {
    method,
    // IMPORTANT: Do NOT set Content-Type for FormData.
    // The browser will set the correct multipart boundary.
    headers: isFormData
      ? {}
      : data
      ? { "Content-Type": "application/json" }
      : {},
    body: data ? (isFormData ? (data as FormData) : JSON.stringify(data)) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  const body = await readBody(res);
  return (body as T) ?? ({} as T);
}

type UnauthorizedBehavior = "returnNull" | "throw";

/** Default query fetcher that also surfaces server error messages */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, { credentials: "include" });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await readBody(res)) as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
