export type ApiUser = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  balance?: number;
  createdAt?: string;
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

async function readResponsePayload(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    const apiPayload = typeof payload === "object" && payload !== null ? payload as ApiErrorPayload : undefined;
    throw new ApiError(apiPayload?.message ?? apiPayload?.error ?? fallbackMessage, response.status, apiPayload);
  }

  return payload as T;
}
