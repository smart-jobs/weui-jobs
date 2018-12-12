import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';
import _ from 'lodash';

Vue.use(Vuex);

const api = {
  resumeList: '/weixin/api/jobs/resume/list', //query:userid,skip,limit 返回所有数据
  letterList: '/weixin/api/jobs/letter/mylist', //query:userid,skip,limit
  ticketList: '/weixin/api/jobs/jobfair/ticket/mylist', //query:userid 返回所有数据
  userInfo: '/weixin/api/user/info',
  deleteResume: '/weixin/api/jobs/resume/delete', //query:id,userid
};

export const state = () => ({
  limit: 10,
  userInfo: {},
  listForComponent: [],
  totalForComponent: 0,
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
      console.log(data);
      state.totalForComponent = state.listForComponent.length;
    }
  },
  [types.USER_INFO](state, payload) {
    state.userInfo = payload;
  },
};

export const actions = {
  //获取用户信息
  async getUserInfo({ commit, rootState }) {
    let result = await this.$axios.$get(api.userInfo, { id: rootState.publics.user.userid });
    commit(types.USER_INFO, result);
  },
  //获取指定列表内容
  async loadList({ state, commit, rootState }, payload) {
    //更改,需要解构payload获得去加载哪个列表 ×
    let { skip, type } = payload;
    console.log('in function:');
    let result = await this.$axios.$get(_.get(api, type), {
      userid: rootState.publics.user.userid,
      skip: skip,
      limit: state.limit,
    });
    commit(types.LIST_FOR_COMPONENT, { data: result, skip: skip, type: type });
  },
  //删除简历
  async deleteResume({ rootState }, payload) {
    let resumeid = payload;
    let result = this.$axios.$post(api.deleteResume, null, { id: resumeid, userid: rootState.publics.user.userid });
    console.log(result);
    return result;
  },
};
