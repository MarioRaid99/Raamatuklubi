<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuth } from "@/services/authStore";

const { isLoggedIn, isAdmin, logout } = useAuth();
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/books">Books</router-link> |

    <router-link to="/events">Events</router-link> |

    <router-link v-if="!isLoggedIn" to="/auth">Login / Register</router-link>

    <span v-if="isLoggedIn">
      | <a href="#" @click.prevent="logout">Logout</a>
    </span>

    <span v-if="isAdmin"> | ADMIN</span>
  </nav>

  <router-view />
</template>
