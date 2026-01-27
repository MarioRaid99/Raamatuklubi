<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import { useAuth } from "@/services/authStore";

const route = useRoute();
const { isLoggedIn, isAdmin, logout } = useAuth();

const isActive = (path) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const authLabel = computed(() => (isLoggedIn.value ? "Konto" : "Login / Register"));
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div class="container py-2">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="fw-semibold">Raamatuklubi</span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink
                to="/"
                class="nav-link"
                :class="{ active: isActive('/') }"
              >
                Home
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink
                to="/books"
                class="nav-link"
                :class="{ active: isActive('/books') }"
              >
                Books
              </RouterLink>
            </li>
            <li class="nav-item">
  <RouterLink
    to="/my-books"
    class="nav-link"
    :class="{ active: isActive('/my-books') }"
  >
    My Books
  </RouterLink>
</li>


            <li class="nav-item">
              <RouterLink
                to="/events"
                class="nav-link"
                :class="{ active: isActive('/events') }"
              >
                Events
              </RouterLink>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <span v-if="isAdmin.value" class="badge text-bg-dark badge-admin">
              ADMIN
            </span>

            <RouterLink
              v-if="!isLoggedIn.value"
              to="/auth"
              class="btn btn-outline-primary"
            >
              {{ authLabel }}
            </RouterLink>

            <div v-else class="d-flex align-items-center gap-2">
              <RouterLink to="/auth" class="btn btn-outline-secondary">
                Konto
              </RouterLink>

              <button class="btn btn-primary" type="button" @click="logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="border-top bg-white">
      <div class="container py-3 small text-muted d-flex justify-content-between flex-wrap gap-2">
        <span>© {{ new Date().getFullYear() }} Raamatuklubi</span>
        <span class="text-muted">Lihtne ja selge navigeerimine</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1 1 auto;
}

.brand-mark {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(13, 110, 253, 1), rgba(25, 135, 84, 1));
  box-shadow: 0 6px 18px rgba(13, 110, 253, 0.25);
}

.nav-link.active {
  font-weight: 600;
}

.badge-admin {
  letter-spacing: 0.06em;
}
</style>
