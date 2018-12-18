<template lang="html">
  <div id="Home">
      <mt-header title="您当前是游客"></mt-header>
      <a href="/weixin/ui/center/index.html">
          <mt-cell style="marign-top:50px !important;" id="nameM" title="前往个人中心注册或完善企业信息" ></mt-cell>
      </a>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';

export default {
  name: 'Home',
  metaInfo: {
    title: '首页',
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
    //获取首页列表;学生申请门票
    ...mapActions(['loadIndexList', 'userApply', 'getCorpInfo', 'userApply', 'corpApply']),
    //获取首页的招聘会,宣讲会,招聘信息列表
    async getData() {},
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
