export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  return response.json();
}
