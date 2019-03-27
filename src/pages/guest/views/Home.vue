<template lang="html">
  <div id="Home">
    <mt-header title="您当前是游客"></mt-header>
    <mt-cell style="marign-top:50px !important;" id="nameM" title="前往个人中心注册或完善企业信息" @click.native="turnTo()"></mt-cell>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';

export default {
  name: 'Home',
  metaInfo: {
    title: '游客',
  },
  data() {
    return {};
  },
  async created() {},
  computed: {
    ...mapState({
      user: state => state.publics.user,
    }),
  },
  methods: {
    turnTo() {
      window.location.href = '/weixin/ui/center/index.html';
    },
  },
};
</script>
<style scoped>
@import '../../../style/index.css';
</style>
<style lang="css" scoped>
.mint-swipe {
  overflow: hidden;
  position: relative;
  height: 29vh;
}
.mint-header {
  background-color: #2577e3;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding: 0;
}
</style>
