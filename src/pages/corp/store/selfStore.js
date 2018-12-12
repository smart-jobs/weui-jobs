import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';
import _ from 'lodash';

Vue.use(Vuex);

const api = {
  ResumeList: '/weixin/api/jobs/jobfair/query_g',
  letterList: '/weixin/api/jobs/campus/query_g',
  ticketList: '/weixin/api/jobs/jobinfo/query_g',
};

export const state = () => ({
  limit: 1,
  listForComponent: [],
  totalForComponent: 0,
});

export const mutations = {
  [types.LIST_FOR_COMPONENT](state, payload) {
    const { data, skip } = payload;
    if (skip === 0) {
      state.listForComponent = _.get(data, 'data');
      state.totalForComponent = _.get(data, 'total');
    } else {
      _.get(data, 'data').forEach(item => {
        state.listForComponent.push(item);
      });
      state.totalForComponent = _.get(data, 'total');
    }
  },
};

export const actions = {
  //获取指定列表内容
  async loadList({ state, commit }, payload) {
    let skip = payload;
    let param = methodsUtil.getParams();
    let result = await this.$axios.$get(_.get(api, param.type), { skip: skip, limit: state.limit });
    commit(types.LIST_FOR_COMPONENT, { data: result, skip: skip });
  },
};
