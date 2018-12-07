<template lang='html'>
  <div id="footer">
    <mt-tabbar v-model="selected" fixed>
  <mt-tab-item id="/index.html">
    <img v-if="selected=='/index.html'" slot="icon" src="@/assets/img/首页1.png">
    <img v-else slot="icon" src="@/assets/img/首页.png">
    首页
  </mt-tab-item>
  <mt-tab-item id="/my.html">
    <img v-if="selected=='/my.html'" slot="icon" src="@/assets/img/我的1.png">
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

export default {

  data() {
    return {
    }
  },
  computed: {
    selected: {
      get: function () {
        let uri = window.location.pathname
        return uri;
      },

      set: function (value) {
        this.turnTo(value)
      }

    },

  },
  methods: {
    turnTo: function (where) {
      if (where === '/index.html') {
        window.location.href = "/index.html"
      } else if (where === '/my.html') {
        window.location.href = "/my.html"
      } else if (where === "account") {
        location.href = '/weixin/ui/center/index.html';

      }
    },
  }



}
</script>