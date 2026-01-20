const API_URL = process.env.VUE_APP_API_URL || "http://localhost:8080";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Failed to load events");
  return await res.json();
}

export async function createEvent(payload) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Create event failed");
  }

  return data;
}

export async function updateEvent(id, payload) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Update failed");
  }

  return data;
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error("Delete failed");
  }

  return true;
}
