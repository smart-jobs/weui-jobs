import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const api = {
  jobfairList: '/weixin/api/jobs/jobfair/query_g',
  campusList: '/weixin/api/jobs/campus/query_g',
  jobinfoList: '/weixin/api/jobs/jobinfo/query_g',
  corpInfo: '/weixin/api/corp/details',
};

export const state = () => ({
  limit: 4,
});

export const mutations = {};

export const actions = {
  //获取首页信息
  async loadIndexList({ state }) {
    let jobfairList = await this.$axios.$get(api.jobfairList, {
      skip: 0,
      limit: state.limit,
    });
    let campusList = await this.$axios.$get(api.campusList, {
      skip: 0,
      limit: state.limit,
    });
    let jobinfoList = await this.$axios.$get(api.jobinfoList, {
      skip: 0,
      limit: state.limit,
    });
    return { jobfairList, campusList, jobinfoList };
  },
  //请求企业详情
  //获取要查看的企业详情
  async corpInfos({ commit }, payload) {
    const { corpid, _tenant } = payload;
    let result = await this.$axios.$get(api.corpInfo, {
      corpid: corpid,
      _tenant: _tenant,
    });
    return result;
  },
};
