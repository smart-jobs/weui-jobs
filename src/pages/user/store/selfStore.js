import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';
import _ from 'lodash';
import util from '@/util/user-util';
import { Util } from 'naf-core';

Vue.use(Vuex);

const { isNullOrUndefined } = Util;
const api = {
  userInfo: '/weixin/api/user/info',
  //求职信
  letterList: '/weixin/api/jobs/letter/mylist', //query:userid,skip,limit
  letterDetail: '/weixin/api/jobs/letter/fetch', //query;id
  //简历
  resumeList: '/weixin/api/jobs/resume/list', //query:userid,skip,limit 返回所有数据
  deleteResume: '/weixin/api/jobs/resume/delete', //query:id,userid
  createResume: '/weixin/api/jobs/resume/create', //query:userid
  resumeDetail: '/weixin/api/jobs/resume/fetch', //query:id
  updateResume: '/weixin/api/jobs/resume/update', //query:id,userid
  //入场券
  ticketList: '/weixin/api/jobs/jobfair/ticket/mylist', //query:userid 返回所有数据
};

export const state = () => ({
  limit: 10,
  userInfo: null,
  listForComponent: [],
  totalForComponent: 0,
  detail: null,
});

export const mutations = {
  [types.LIST_FOR_COMPONENT](state, payload) {
    const { data, skip, type } = payload;
    if (type === 'letterList') {
      if (skip === 0) {
        state.listForComponent = _.get(data, 'data');
      } else {
        _.get(data, 'data').forEach(item => {
          state.listForComponent.push(item);
        });
      }
      state.totalForComponent = _.get(data, 'total');
    } else {
      if (skip === 0) {
        state.listForComponent = data;
      } else {
        data.forEach(item => {
          state.listForComponent.push(item);
        });
      }
      state.totalForComponent = state.listForComponent.length;
    }
  },
  [types.USER_INFO](state) {
    state.userInfo = util.userInfo;
  },
  [types.DETAIL](state, payload) {
    state.detail = payload;
  },
};

export const actions = {
  //获取用户信息
  async getUserInfo({ commit }, payload) {
    const { userid } = payload;
    if (isNullOrUndefined(util.userInfo)) {
      let result = await this.$axios.$get(api.userInfo, { id: userid });
      util.saveUserInfo(result);
      commit(types.USER_INFO);
    } else {
      commit(types.USER_INFO);
    }
  },
  //获取指定列表内容
  async loadList({ state, commit }, payload) {
    let { skip, uri, userid } = payload;
    let result = await this.$axios.$get(_.get(api, uri), { userid: userid, skip: skip, limit: state.limit });
    commit(types.LIST_FOR_COMPONENT, { data: result, skip: skip, type: uri });
  },
  //删除简历
  async deleteResume({ state }, payload) {
    const { resumeid, userid } = payload;
    console.log(resumeid, userid);
    let result = this.$axios.$post(api.deleteResume, {}, { id: resumeid, userid: userid });
    return result;
  },
  //查询详情
  async loadDetail({ commit }, payload) {
    const { uri, id } = payload;
    let result = await this.$axios.$get(_.get(api, uri), { id: id });
    commit(types.DETAIL, result);
    return result;
  },
  //详情操作
  async operateDetail({ state }, payload) {
    const { uri, data, id, userid } = payload;
    let result;
    if (uri.includes('create')) {
      result = this.$axios.$post(_.get(api, uri), data, {
        userid: userid,
      });
    } else {
      result = this.$axios.$post(_.get(api, uri), data, {
        id: id,
        userid: userid,
      });
    }
    return result;
  },
};
