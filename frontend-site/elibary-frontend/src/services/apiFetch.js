import { useAuth } from "@/services/authStore";

export const API_URL = process.env.VUE_APP_API_URL || "http://localhost:8080";

export async function apiFetch(path, options = {}) {
  const auth = useAuth();

  const headers = {
    ...(options.headers || {}),
  };

  const hasFormData = options.body instanceof FormData;

  if (options.body && !hasFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (auth?.state?.token) {
    headers.Authorization = `Bearer ${auth.state.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return res;
}
