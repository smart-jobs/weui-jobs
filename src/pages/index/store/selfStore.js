import Vue from 'vue';
import Vuex from 'vuex';
import util from '@/util/user-util';
import * as types from './mutation-types';

Vue.use(Vuex);

const api = {
  jobfairList: '/weixin/api/jobs/jobfair/query_g',
  campusList: '/weixin/api/jobs/campus/query_g',
  jobinfoList: '/weixin/api/jobs/jobinfo/query_g',
};


export const state = () => ({
  detail: '',
  userInfo: null,
  openid: '',
  token: '',
  user: {},
  limit: 4,
})

export const mutations = {
  [types.GET_USER](state) {
    state.user = util.user;
    state.openid = util.openid;
    state.token = util.token;
  },
}

export const actions = {
  async loadIndexList({ state }) {
    let jobfairList = await this.$axios.$get(api.jobfairList, { skip: 0, limit: state.limit });
    let campusList = await this.$axios.$get(api.campusList, { skip: 0, limit: state.limit });
    let jobinfoList = await this.$axios.$get(api.jobinfoList, { skip: 0, limit: state.limit });
    return { jobfairList, campusList, jobinfoList };
  },
  async getUser({ commit }) {
    commit(types.GET_USER);
  },
}


