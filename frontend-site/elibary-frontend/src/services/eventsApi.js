const API_URL = "http://localhost:8080";

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error(`GET /events failed: ${res.status}`);
  return await res.json();
}

export async function createEvent(payload) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /events failed: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function deleteEvent(eventId) {
  const res = await fetch(`${API_URL}/events/${eventId}`, { method: "DELETE" });

  if (!res.ok && res.status !== 204) {
    throw new Error(`DELETE /events/${eventId} failed: ${res.status}`);
  }

  return true;
}

export async function updateEvent(eventId, payload) {
  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH /events/${eventId} failed: ${res.status} ${text}`);
  }

  return await res.json();
}
