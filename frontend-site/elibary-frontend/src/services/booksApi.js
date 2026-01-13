import axios from "axios";

const API_BASE = "http://localhost:8080";

export async function getBooks(params = {}) {
  const res = await axios.get(`${API_BASE}/books`, { params });
  return res.data;
}
