import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  jobfairDetail: '/weixin/api/jobs/jobfair/fetch',
  jobfairCorpList: '/weixin/api/jobs/jobfair/corp/list',
  corpInfo: '/weixin/api/corp/details',
  jobInfoList: '/weixin/api/jobs/jobfair/corp/fetch',
};

export const state = () => ({
  detail: {},
  corpList: [],
  corpInfo: {},
  jobInfoList: [],
});

export const mutations = {
  [types.DETAIL](state, payload) {
    state.detail = payload;
  },
  [types.CORPLIST](state, payload) {
    state.corpList = payload;
  },
  [types.CORPINFO](state, payload) {
    state.corpInfo = payload;
  },
  [types.JOBINFOLIST](state, payload) {
    state.jobInfoList = payload;
  },
};

export const actions = {
  //获取招聘会详情
  async jobfairDetail({ commit }) {
    let param = methodsUtil.getParams();
    let jobfairDetail = await this.$axios.$get(api.jobfairDetail, {
      id: param.id,
    });
    commit(types.DETAIL, jobfairDetail);
    let jobfairCorpList = await this.$axios.$get(api.jobfairCorpList, {
      fair_id: param.id,
    });
    commit(types.CORPLIST, jobfairCorpList);
  },
  //获取要查看的企业详情
  async corpInfos({ commit }, payload) {
    const { corpid, _tenant } = payload;
    let result = await this.$axios.$get(api.corpInfo, { corpid: corpid, _tenant: _tenant });
    commit(types.CORPINFO, result);
  },
  //获取要查看的企业的招聘信息列表
  async jobInfoLists({ commit }, payload) {
    const { corpid, fair_id } = payload;
    let result = await this.$axios.$get(api.jobInfoList, { corpid: corpid, fair_id: fair_id });
    commit(types.JOBINFOLIST, result);
  },
};
