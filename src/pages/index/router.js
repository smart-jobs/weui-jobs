import Vue from 'vue';
import Router from 'vue-router';
import qrCorp from './views/QrcodeCorpInfo.vue';

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
      path: '/qrCorp',
      component: qrCorp,
    },
  ],
});
export default router;
