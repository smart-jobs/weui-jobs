import Vue from 'vue';
import Vuex from 'vuex';
import * as publics from '@/store/publicStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    publics: publics,
  },
});
