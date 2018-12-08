import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';

Vue.use(Vuex);

const api = {
  jobinfoDetail: '/weixin/api/jobs/jobinfo/fetch',
};

export const state = () => ({});

export const mutations = {};

export const actions = {
  //获取招聘会详情
  async jobinfoDetail() {
    let param = methodsUtil.getParams();
    let jobinfoDetail = await this.$axios.$get(api.jobinfoDetail, {
      id: param.id,
    });
    return jobinfoDetail;
  },
};
