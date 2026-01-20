import { useAuth } from "./authStore";

const API_URL =
  process.env.VUE_APP_API_URL || "http://localhost:8080";

export async function apiFetch(path, options = {}) {
  const { state } = useAuth();

  const headers = {
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return res;
}
