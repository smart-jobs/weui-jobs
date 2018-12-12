import Vue from 'vue';
import Vuex from 'vuex';
import util from '@/util/user-util';
import { Util } from 'naf-core';
import _ from 'lodash';
import * as types from './mutation-types';

Vue.use(Vuex);

const { isNullOrUndefined } = Util;

const api = {
  unit: '/weixin/api/naf/unit/list',
  corpInfo: '/weixin/api/corp/details',
  userApplyJobFair: '/weixin/api/jobs/jobfair/ticket/apply',
  corpApplyJobFair: '/weixin/api/jobs/jobfair/corp/apply',
  resumeList: '/weixin/api/jobs/resume/list',
  deliver: '/weixin/api/jobs/letter/deliver',
};

export const state = () => ({
  unitList: [],
  corpInfo: '',
  openid: '',
  token: '',
  user: {},
  resumeList: [],
  limit: 10,
});

export const mutations = {
  [types.GET_UNIT_LIST](state) {
    state.unitList = util.unit;
  },
  [types.GET_USER](state) {
    state.user = util.user;
    state.openid = util.openid;
    state.token = util.token;
  },
  [types.GET_CORPINFO](state) {
    state.corpInfo = util.corpInfo;
  },
  [types.RESUMELIST](state, payload) {
    const { result, skip } = payload;
    if (skip === 0) {
      state.resumeList = result;
    } else {
      state.resumeList.forEach(item => {
        this.list.push(item);
      });
    }
  },
};

export const actions = {
  //vuex添加用户信息
  async getUser({ commit }) {
    commit(types.GET_USER);
  },
  //获取企业信息
  async getCorpInfo({ state, commit }) {
    if (isNullOrUndefined(util.corpInfo)) {
      const { user } = state;
      const { corpid, _tenant } = user;
      const result = await this.$axios.$get(api.corpInfo, { corpid: corpid, _tenant: _tenant });
      util.saveCorpInfo(result);
      commit(types.GET_CORPINFO);
    } else {
      commit(types.GET_CORPINFO);
    }
  },

  //加载分站列表添加进state和session
  async loadUnit({ commit }) {
    if (isNullOrUndefined(util.unit)) {
      let result = await this.$axios.$get(api.unit);
      let list;
      let unitList = [];
      result.forEach(item => {
        list = { label: item.name, value: item.code };
        unitList.push(list);
      });
      util.saveUnit(unitList);
      commit(types.GET_UNIT_LIST);
    } else {
      commit(types.GET_UNIT_LIST);
    }
  },
  //学生申请门票
  async userApply({ state }, payload) {
    const { user } = state;
    const { userid } = user;
    const { fair_id } = payload;
    console.log(fair_id, userid);
    const result = await this.$axios.$post(api.userApplyJobFair, {}, { fair_id: fair_id, userid: userid });
    return result;
  },
  //企业申请加入招聘会
  async corpApply({ state }, payload) {
    const { user } = state;
    const { corpid } = user;
    const { fair_id, jobs } = payload;
    const result = await this.$axios.$post(api.corpApplyJobFair, { jobs }, { fair_id: fair_id, corpid: corpid });
    return result;
  },
  //获取简历列表
  async getResumeList({ commit, state }, payload) {
    let userid = _.get(state, 'user.userid');
    const { skip, limit } = payload;
    let result = await this.$axios.$get(api.resumeList, { userid: userid, skip: skip, limit: limit });
    commit(types.RESUMELIST, { result: result, skip: skip });
  },
  //投递简历
  async deliver({ state }, payload) {
    let userid = _.get(state, 'user.userid');
    const { data, _tenant } = payload; //data:corpid,resumeid,type,origin
    let result = await this.$axios.$post(api.deliver, data, { userid: userid, _tenant: _tenant });
    return result;
  },
};
