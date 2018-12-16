import Vue from 'vue';
import Router from 'vue-router';
import qrcode from '@/util/qrcode.vue';

Vue.use(Router);

import Home from './views/Home.vue';
import corpJobfairList from './views/CorpJobfairList.vue';
import corpCampusList from './views/CorpCampusList.vue';
import corpCampusAdd from './views/CorpCampusAdd.vue';
import corpCampusDetail from './views/CorpCampusDetail.vue';
import corpJobinfoList from './views/CorpJobinfoList.vue';
import corpLetterList from './views/CorpLetterList.vue';
import corpLetterDetail from './views/CorpLetterDetail.vue';
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
    {
      path: '/corpJobfairList',
      name: 'corpJobfairList',
      component: corpJobfairList,
    },
    {
      path: '/corpCampusList',
      name: 'corpCampusList',
      component: corpCampusList,
    },
    {
      path: '/corpJobinfoList',
      name: 'corpJobinfoList',
      component: corpJobinfoList,
    },
    {
      path: '/corpLetterList',
      name: 'corpLetterList',
      component: corpLetterList,
    },
    {
      path: '/corpLetterDetail',
      name: 'corpLetterDetail',
      component: corpLetterDetail,
    },
    {
      path: '/corpCampusAdd',
      name: 'corpCampusAdd',
      component: corpCampusAdd,
    },
    {
      path: '/corpCampusDetail',
      name: 'corpCampusDetail',
      component: corpCampusDetail,
    },
  ],
});
export default router;
