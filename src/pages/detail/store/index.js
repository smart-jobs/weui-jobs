import Vue from "vue";
import Vuex from "vuex";
// import util from "@/util/user-util";
// import * as types from "./mutation-types";

Vue.use(Vuex);

// const api = {
//   jobfairList: "",
//   campusList: "",
//   jobinfoList: ""
// };

export default new Vuex.Store({
  state: {
    detail: "",
    user: "",
    limit: 4
  },
  mutations: {},
  actions: {
    async loadIndexList({ state }) {
      const jobfairListUri ="/weixin/api/jobs/jobfair/query_g?skip=0&limit=" + state.limit;
      let result = await this.$axios.$get(jobfairListUri);
      console.log(result);
      return result;
    }
  }
});
