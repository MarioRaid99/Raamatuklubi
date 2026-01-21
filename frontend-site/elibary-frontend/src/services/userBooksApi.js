import { apiFetch } from "@/services/apiFetch";

export async function getMyBooks() {
  const res = await apiFetch("/me/books");
  if (!res.ok) throw new Error(`GET /me/books failed: ${res.status}`);
  return await res.json();
}

export async function addMyBook(payload) {
  const res = await apiFetch("/me/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /me/books failed (${res.status}): ${text}`);
  }

  return await res.json();
}

export async function updateMyBook(bookId, payload) {
  const res = await apiFetch(`/me/books/${bookId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH /me/books/${bookId} failed (${res.status}): ${text}`);
  }

  return await res.json();
}

export async function removeMyBook(bookId) {
  const res = await apiFetch(`/me/books/${bookId}`, { method: "DELETE" });

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`DELETE /me/books/${bookId} failed (${res.status}): ${text}`);
  }

  return true;
}
