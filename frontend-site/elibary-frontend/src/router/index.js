import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/books",
    name: "books",
    component: () => import("../views/BooksView.vue"),
  },
  {
    path: "/events",
    name: "events",
    component: () => import("../views/EventsView.vue"),
  },
  {
  path: "/auth",
  name: "auth",
  component: AuthView,
},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
