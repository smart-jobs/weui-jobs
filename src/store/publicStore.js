import Vue from 'vue';
import Vuex from 'vuex';
import util from '@/util/user-util';
import { Util } from 'naf-core';
import * as types from './mutation-types';

Vue.use(Vuex);

const { isNullOrUndefined } = Util;

const api = {
  unit: '/weixin/api/naf/unit/list',
};

export const state = () => ({
  unitList: [],
  corpUnit: '',
});

export const mutations = {
  [types.GET_UNIT_LIST](state) {
    state.unitList = util.unit;
  },
};

export const actions = {
  async loadUnit({ commit }) {
    if (isNullOrUndefined(util.unit)) {
      let result = await this.$axios.$get(api.unit);
      let list;
      let unitList = [];
      result.forEach(item => {
        list = {
          label: item.name,
          value: item.code,
        };
        unitList.push(list);
      });
      util.saveUnit(unitList);
      commit(types.GET_UNIT_LIST);
    } else {
      commit(types.GET_UNIT_LIST);
    }
  },
};
