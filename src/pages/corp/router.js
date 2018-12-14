import Vue from 'vue';
import Router from 'vue-router';
import qrcode from '@/util/qrcode.vue';

Vue.use(Router);

import Home from './views/Home.vue';
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: qrcode,
    },
  ],
});
export default router;
