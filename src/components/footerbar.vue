<template lang='html'>
  <div id="footer">
    <mt-tabbar v-model="selected" fixed>
  <mt-tab-item id="index.html">
    <img v-if="selected.includes('index.html')" slot="icon" src="@/assets/img/首页1.png">
    <img v-else slot="icon" src="@/assets/img/首页.png">
    首页
  </mt-tab-item>
  <mt-tab-item :id="myUrl">
    <img v-if="selected.includes(myUrl)" slot="icon" src="@/assets/img/我的1.png">
    <img v-else slot="icon" src="@/assets/img/我的.png">
    我的
  </mt-tab-item>
  <mt-tab-item id="account">
    <img v-if="selected=='account'" slot="icon" src="@/assets/img/账号密码1.png">
    <img v-else slot="icon" src="@/assets/img/账号密码.png">
    账号
  </mt-tab-item>
</mt-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
export default {
  computed: {
    ...mapState({
      user: state => state.publics.user,
    }),
    selected: {
      get() {
        let uri = window.location.pathname;
        return uri;
      },

      set(value) {
        this.turnTo(value);
      },
    },
    myUrl: {
      get() {
        let role = _.get(this.user, 'role');
        if (role === 'corp') {
          return 'corp.html';
        } else if (role === 'user') {
          return 'user.html';
        } else {
          return 'guest.html';
        }
      },
    },
  },
  methods: {
    turnTo(where) {
      if (where === 'account') {
        location.href = '/weixin/ui/center/index.html';
      } else {
        window.location.href = `${where}`;
      }
    },
  },
};
</script>
