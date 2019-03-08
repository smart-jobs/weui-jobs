import Vue from 'vue';
import Vuex from 'vuex';
import methodsUtil from '@/util/methods-util';
import * as types from './mutation-types';
import _ from 'lodash';

Vue.use(Vuex);

const api = {
  //企业招聘会
  corpJobfairList: '/weixin/api/jobs/jobfair/corp/mylist', //query:corpid
  corpJobfairDetail: '/weixin/api/jobs/jobfair/fetch', //query:id
  corpJobfairJobList: '/weixin/api/jobs/jobfair/corp/fetch', //query:fair_id,corpid
  corpJobfairJobAdd: '/weixin/api/jobs/jobfair/corp/job/add', //query:corpid,fair_id
  corpJobfairJobUpdate: '/weixin/api/jobs/jobfair/corp/job/update', //query:corpid,job_id
  corpJobfairJobDelete: '/weixin/api/jobs/jobfair/corp/job/delete', //query:corpid,job_id
  //企业宣讲会
  corpCampusList: '/weixin/api/jobs/campus/list', //query:corpid
  corpCampusDetail: '/weixin/api/jobs/campus/fetch', //query:id
  corpCampusCreate: '/weixin/api/jobs/campus/create', //query:corpid,_tenant=>选择的分站,不是user调出来的
  corpCampusUpdate: '/weixin/api/jobs/campus/update', //query:corpid,id,_tenant=>同上
  //企业招聘信息
  corpJobinfoList: '/weixin/api/jobs/jobinfo/list', //query:corpid
  corpJobinfoDetail: '/weixin/api/jobs/jobinfo/fetch', //query:id,corpid
  corpJobinfoAdd: '/weixin/api/jobs/jobinfo/create', //query:corpid,_tenant
  corpJobinfoUpdate: '/weixin/api/jobs/jobinfo/update', //query:id,corpid,_tenant
  //企业求职信
  corpLetterList: '/weixin/api/jobs/letter/list', //query:corpid,type=>0:招聘信息,1:招聘会
  corpLetterDetail: '/weixin/api/jobs/letter/fetch', //query:id
  corpLetterReply: '/weixin/api/jobs/letter/reply', //query:id,corpid
};
const dictionary = {
  jobcat: '/weixin/api/naf/code/zwlb/list',
  nature: '/weixin/api/naf/code/gzxz/list',
  salary: '/weixin/api/naf/code/xzdy/list',
  xlreqs: '/weixin/api/naf/code/xlcc/list',
  provice: '/weixin/api/naf/code/xzqh/list',
  city: '/weixin/api/naf/code/xzqh/list', //query:level=2,parent:省份
};

export const state = () => ({
  limit: 10,
  listForComponent: [],
  totalForComponent: 0,
  detail: {},
});

export const mutations = {
  [types.LIST_FOR_COMPONENT](state, payload) {
    const { data, skip, type } = payload;
    if (type === 'corpJobfairList') {
      if (skip === 0) {
        state.listForComponent = data;
      } else {
        data.forEach(item => {
          state.listForComponent.push(item);
        });
      }
      state.totalForComponent = state.listForComponent.length;
    } else {
      if (skip === 0) {
        state.listForComponent = _.get(data, 'data');
        state.totalForComponent = _.get(data, 'total');
      } else {
        _.get(data, 'data').forEach(item => {
          state.listForComponent.push(item);
        });
        state.totalForComponent = _.get(data, 'total');
      }
    }
  },
  [types.DETAIL](state, payload) {
    state.detail = payload;
  },
};

export const actions = {
  //获取指定列表内容
  async loadList({ state, commit }, payload) {
    let { skip, uri, corpid, type } = payload;
    let result;
    if (uri === 'corpLetterList') {
      result = await this.$axios.$get(_.get(api, uri), { corpid: corpid, type: type, skip: skip, limit: state.limit });
      return result;
    } else {
      result = await this.$axios.$get(_.get(api, uri), { corpid: corpid, skip: skip, limit: state.limit });
      commit(types.LIST_FOR_COMPONENT, { data: result, skip: skip, type: uri });
    }
  },
  //查询详情
  async loadDetail({ commit }, payload) {
    const { uri, id, corpid } = payload;
    let result = await this.$axios.$get(_.get(api, uri), { id: id });
    commit(types.DETAIL, result);
    if (uri === 'corpJobfairDetail') {
      result = await this.$axios.$get(api.corpJobfairJobList, { fair_id: id, corpid: corpid });
    } else if (uri === 'corpJobinfoDetail') {
      result = await this.$axios.$get(_.get(api, uri), { id: id, corpid: corpid });
    }
    return result;
  },
  //详情操作
  async operateDetail({ state }, payload) {
    const { uri, data, id, corpid, _tenant } = payload;
    let result;
    if (uri.includes('create')) {
      result = this.$axios.$post(_.get(api, uri), data, { corpid: corpid });
    } else if (uri === 'corpJobfairJobAdd') {
      result = this.$axios.$post(_.get(api, uri), data, { fair_id: id, corpid: corpid });
    } else if (uri === 'corpJobfairJobDelete' || uri === 'corpJobfairJobUpdate') {
      result = this.$axios.$post(_.get(api, uri), {}, { job_id: id, corpid: corpid });
    } else if (uri === 'corpCampusCreate') {
      result = this.$axios.$post(_.get(api, uri), data, { corpid: corpid, _tenant: _tenant });
    } else if (uri === 'corpCampusUpdate') {
      result = this.$axios.$post(_.get(api, uri), data, { corpid: corpid, _tenant: _tenant, id: id });
    } else {
      result = this.$axios.$post(_.get(api, uri), data, { id: id, corpid: corpid });
    }
    return result;
  },
  //读取字典表数据
  async loadDictionary({ state }, payload) {
    const { type, parent } = payload;
    let result;
    if (type === 'provice') {
      result = await this.$axios.$get(_.get(dictionary, type), { level: '1' });
    } else if (type === 'city') {
      result = await this.$axios.$get(_.get(dictionary, type), { level: '2', parent: parent });
    } else {
      result = await this.$axios.$get(_.get(dictionary, type));
    }
    let list;
    let newList = [];
    result.forEach(item => {
      list = {
        label: item.name,
        value: item.code,
      };
      newList.push(list);
    });
    return newList;
  },
};
