import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import BooksView from "../views/BooksView.vue";
import EventsView from "../views/EventsView.vue";
import AuthView from "../views/AuthView.vue";

import { useAuth } from "@/services/authStore";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/books",
    name: "books",
    component: BooksView,
  },
  {
    path: "/events",
    name: "events",
    component: EventsView,
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();

  if (to.meta?.requiresAdmin) {
    if (!auth.isLoggedIn.value) return next("/auth");
    if (!auth.isAdmin.value) return next("/auth");
  }

  return next();
});

export default router;
