import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';

Vue.use(Vuex);

const api = {
  campusDetail: '/weixin/api/jobs/campus/fetch',
};

export const state = () => ({});

export const mutations = {};

export const actions = {
  //获取招聘会详情
  async campusDetail() {
    let param = methodsUtil.getParams();
    let campusDetail = await this.$axios.$get(api.campusDetail, { id: param.id });
    return campusDetail;
  },
};
