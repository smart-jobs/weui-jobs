/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import Vue from 'vue';

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(vue, options) {
    // 3. 注入组件
    vue.mixin({
      created() {
        // eslint-disable-next-line no-underscore-dangle
        const rootVue_uid = this.$root._uid;
        const isRoot = this._uid === rootVue_uid;
        if (isRoot) {
          const el = document.getElementById('loading');
          if (el) el.style.display = 'none';
        }
      },
    });
  },
};

Vue.use(Plugin, { baseUrl: process.env.VUE_APP_AXIOS_BASE_URL });
