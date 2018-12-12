import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from './views/Home.vue';
import resumeList from './views/ResumeList.vue';
import letterList from './views/LetterList.vue';
import ticketList from './views/TicketList.vue';
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/resumeList',
      name: 'resumeList',
      component: resumeList,
    },
    {
      path: '/letterList',
      name: 'letterList',
      component: letterList,
    },
    {
      path: '/ticketList',
      name: 'ticketList',
      component: ticketList,
    },
  ],
});
export default router;
