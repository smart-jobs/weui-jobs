import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const api = {
  jobfairList: '/weixin/api/jobs/jobfair/query_g',
  campusList: '/weixin/api/jobs/campus/query_g',
  jobinfoList: '/weixin/api/jobs/jobinfo/query_g',
};

export const state = () => ({
  limit: 4,
});

export const mutations = {};

export const actions = {
  //获取首页信息
  async loadIndexList({ state }) {
    let jobfairList = await this.$axios.$get(api.jobfairList, { skip: 0, limit: state.limit });
    let campusList = await this.$axios.$get(api.campusList, { skip: 0, limit: state.limit });
    let jobinfoList = await this.$axios.$get(api.jobinfoList, { skip: 0, limit: state.limit });
    return { jobfairList, campusList, jobinfoList };
  },
};
