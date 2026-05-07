import { getToken } from "@/lib/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  balance?: number;
  createdAt?: string;
};

export type ApiSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: ApiUser;
};

export type ApiTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  referenceId: string;
  description: string | null;
  createdAt: string;
  receiptUrl?: string;
};

export type ApiPaymentKey = {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  user: ApiUser;
};

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: unknown;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
  auth?: boolean;
};

type ApiBlobOptions = Omit<ApiFetchOptions, "body">;

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });
    const payload = await readJson(response);

    if (!response.ok) {
      const apiPayload = typeof payload === "object" && payload !== null ? payload as ApiErrorPayload : undefined;
      throw new ApiError(apiPayload?.message ?? apiPayload?.error ?? "The demo backend may be waking up.", response.status, apiPayload);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The demo backend took too long to respond.", 408);
    }

    throw new ApiError("The demo backend may be waking up. Try again in a moment.", 0);
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function apiBlob(path: string, options: ApiBlobOptions = {}): Promise<Blob> {
  const { auth, timeoutMs, ...requestOptions } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs ?? 12000);
  const headers = new Headers(options.headers);

  if (auth !== false) {
    const token = getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await readJson(response);
      const apiPayload = typeof payload === "object" && payload !== null ? payload as ApiErrorPayload : undefined;
      throw new ApiError(apiPayload?.message ?? apiPayload?.error ?? "Could not download receipt.", response.status, apiPayload);
    }

    return response.blob();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The demo backend took too long to respond.", 408);
    }

    throw new ApiError("The demo backend may be waking up. Try again in a moment.", 0);
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string, options?: ApiFetchOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiFetchOptions) => apiFetch<T>(path, { ...options, method: "POST", body }),
  delete: <T>(path: string, options?: ApiFetchOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};

export const endpoints = {
  health: () => api.get<{ ok: boolean }>("/health", { auth: false, timeoutMs: 5000 }),
  login: (body: { email: string; password: string }) => api.post<{ session: ApiSession }>("/auth/login", body, { auth: false }),
  register: (body: { name: string; email: string; password: string; taxId: string }) => api.post<{ user: ApiUser }>("/auth/register", body, { auth: false }),
  me: () => api.get<{ user: ApiUser }>("/users/me"),
  transactions: () => api.get<{ transactions: ApiTransaction[] }>("/users/transactions?limit=50"),
  paymentKeys: () => api.get<{ paymentKeys: ApiPaymentKey[] }>("/payment-keys"),
  createPaymentKey: () => api.post<{ paymentKey: ApiPaymentKey }>("/payment-keys"),
  resolvePaymentKey: (key: string) => api.get<{ paymentKey: ApiPaymentKey }>(`/payment-keys/${encodeURIComponent(key)}`),
  deletePaymentKey: (key: string) => api.delete<void>(`/payment-keys/${encodeURIComponent(key)}`),
  receipt: (transactionId: string) => apiBlob(`/transactions/${encodeURIComponent(transactionId)}/receipt`),
  createPayment: (body: { paymentKey: string; amount: number; description?: string }, idempotencyKey: string) =>
    api.post<{ success: boolean; transactionId?: string; receiptUrl?: string; error?: string }>("/payments", body, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }),
};
