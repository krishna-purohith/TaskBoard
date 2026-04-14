const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ApiErrorResponse {
  success: false;
  error: string;
  data: null;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error: ApiErrorResponse = await res
      .json()
      .catch(() => ({ error: "Network error", success: false, data: null }));
    throw new Error(error.error || "Something went wrong");
  }
  return res.json();
}

export const api = {
  get<T>(endpoint: string) {
    return apiFetch<T>(endpoint);
  },

  post<T>(endpoint: string, body: unknown) {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: unknown) {
    return apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string) {
    return apiFetch<T>(endpoint, {
      method: "DELETE",
    });
  },
};
