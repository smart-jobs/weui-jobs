import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from './views/Home.vue';
import resumeList from './views/ResumeList.vue';
import letterList from './views/LetterList.vue';
import ticketList from './views/TicketList.vue';
import resumeDetail from './views/ResumeDetail.vue';
import resumeAdd from './views/ResumeAdd.vue';
import letterDetail from './views/LetterDetail.vue';
import qrcode from '@/util/qrcode.vue';
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
    {
      path: '/resumeAdd',
      name: 'resumeAdd',
      component: resumeAdd,
    },
    {
      path: '/resumeDetail',
      name: 'resumeDetail',
      component: resumeDetail,
    },
    {
      path: '/letterDetail',
      name: 'letterDetail',
      component: letterDetail,
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: qrcode,
    },
  ],
});
export default router;
