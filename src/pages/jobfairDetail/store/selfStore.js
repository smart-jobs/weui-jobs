import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';

Vue.use(Vuex);

const api = {
  jobfairDetail: '/weixin/api/jobs/jobfair/fetch',
  jobfairCorpList: '/weixin/api/jobs/jobfair/corp/list',
};

export const state = () => ({});

export const mutations = {};

export const actions = {
  //获取招聘会详情
  async jobfairDetail() {
    let param = methodsUtil.getParams();
    let jobfairDetail = await this.$axios.$get(api.jobfairDetail, {
      id: param.id,
    });
    let jobfairCorpList = await this.$axios.$get(api.jobfairCorpList, {
      fair_id: param.id,
    });
    return { jobfairDetail, jobfairCorpList };
  },
};
