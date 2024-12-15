import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/register",
      name: "register",
      component: () => import("../views/register.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/snack",
      name: "snack",
      component: () => import("../views/snack.vue"),
    },
    ,
    {
      path: "/todo",
      name: "todo",
      component: () => import("../views/todo.vue"),
    },
    {
      path: "/userprofile",
      name: "userprofile",
      component: () => import("../views/userprofile.vue"),
    },
  ],
});

export default router;
