import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('../views/BooksView.vue')
  },
  {
    path: '/books/:seekID',
    name: 'books',
    component: () => import('../views/SingleBookView.vue'),
    props: route => {return {seekID: String(route.params.BookID)}}
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
