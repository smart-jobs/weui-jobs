import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Home from "./views/Home.vue";
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home
    }
  ]
});
export default router;