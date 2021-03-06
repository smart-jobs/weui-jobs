import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  campusDetail: '/weixin/api/jobs/campus/fetch',
  corpInfo: '/weixin/api/corp/details',
};

export const state = () => ({
  detail: {},
  corpInfo: {},
});

export const mutations = {
  [types.DETAIL](state, payload) {
    state.detail = payload;
  },
  [types.CORPINFO](state, payload) {
    state.corpInfo = payload;
  },
};

export const actions = {
  //获取招聘会详情
  async campusDetail({ commit }) {
    let param = methodsUtil.getParams();
    let campusDetail = await this.$axios.$get(api.campusDetail, { id: param.id });
    commit(types.DETAIL, campusDetail);
  },
  //获取查看的企业详情
  async corpInfos({ commit }, payload) {
    const { corpid, _tenant } = payload;
    let result = await this.$axios.$get(api.corpInfo, { corpid: corpid, _tenant: _tenant });
    commit(types.CORPINFO, result);
  },
};
