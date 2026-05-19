export const API_URL =
  "https://txwzcdqudtzycstlynaqilfjcy0cyutr.lambda-url.us-east-1.on.aws";

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