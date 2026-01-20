// src/services/authStore.js
import { reactive, computed } from "vue";

const state = reactive({
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
});

const isLoggedIn = computed(() => !!state.token);
const role = computed(() => state.user?.Role || "GUEST");
const isAdmin = computed(() => role.value === "ADMIN");

function setAuth(token, user) {
  state.token = token;
  state.user = user;

  localStorage.setItem("token", token || "");
  localStorage.setItem("user", JSON.stringify(user || null));
}

function logout() {
  state.token = "";
  state.user = null;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function useAuth() {
  return {
    state,
    isLoggedIn,
    role,
    isAdmin,
    setAuth,
    logout,
  };
}
