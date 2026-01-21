import { apiFetch, API_URL } from "@/services/apiFetch";

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await apiFetch("/upload", {
    method: "POST",
    body: fd,
    headers: {}, 
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const data = await res.json(); 
  return `${API_URL}${data.url}`;
}
