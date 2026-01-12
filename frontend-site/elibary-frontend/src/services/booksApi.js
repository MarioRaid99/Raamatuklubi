const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:8080";

export async function getBooks() {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) throw new Error(`GET /books failed: ${res.status}`);
  return await res.json();
}

export async function createBook(payload) {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /books failed: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function deleteBook(bookId) {
  const res = await fetch(`${API_URL}/books/${bookId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(`DELETE /books/${bookId} failed: ${res.status}`);
  return true;
}

// jätame valmis – töötab alles siis kui backendil on PUT/PATCH route
export async function updateBook(bookId, payload) {
  const res = await fetch(`${API_URL}/books/${bookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PATCH /books/${bookId} failed: ${res.status}`);
  return await res.json();
}
