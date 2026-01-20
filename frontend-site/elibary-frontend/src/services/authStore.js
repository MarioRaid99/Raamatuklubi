const KEY = "rk_token";
const USER_KEY = "rk_user";

export function getToken() {
  return localStorage.getItem(KEY) || "";
}

export function setAuth(token, user) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function isAdmin() {
  const u = getUser();
  return u?.Role === "ADMIN";
}

export function isLoggedIn() {
  return Boolean(getToken());
}
