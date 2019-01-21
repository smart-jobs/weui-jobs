import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  jobinfoDetail: '/weixin/api/jobs/jobinfo/fetch',
  corpInfo: '/weixin/api/corp/details',
  corpJobinfoLists: '/weixin/api/jobs/jobinfo/list',
};

export const state = () => ({
  detail: {},
  corpInfo: {},
  corpJobInfoList: [],
});

export const mutations = {
  [types.DETAIL](state, payload) {
    state.detail = payload;
  },
  [types.CORPINFO](state, payload) {
    state.corpInfo = payload;
  },
  [types.CORPJOBINFOLIST](state, payload) {
    state.corpJobInfoList = payload;
  },
};

export const actions = {
  //获取招聘信息详情
  async jobinfoDetail({ commit }) {
    let param = methodsUtil.getParams();
    let jobinfoDetail = await this.$axios.$get(api.jobinfoDetail, {
      id: param.id,
    });
    commit(types.DETAIL, jobinfoDetail);
  },
  //获取查看的企业详情
  async corpInfos({ commit }, payload) {
    const { corpid, _tenant } = payload;
    let result = await this.$axios.$get(api.corpInfo, { corpid: corpid, _tenant: _tenant });
    commit(types.CORPINFO, result);
  },
  //查询该企业的招聘信息
  async getCorpJobInfoList({ commit }, payload) {
    const { corpid, _tenant } = payload;
    let result = await this.$axios.$get(api.corpJobinfoLists, { corpid: corpid, skip: 0, limit: 10 });
    commit(types.CORPJOBINFOLIST, result.data);
  },
};
