<template lang='html'>
  <div id="Home">
      <mt-header title="我    的"></mt-header>
      <span v-if="check()">
          <a href="/weixin/ui/center/index.html">
            <mt-cell  id="nameM"  title="您当前没有绑定学籍,此处绑定学籍"  style="background-color:red;color:yellow;" icon="field-warning"></mt-cell>
          </a>
      </span>
      <span v-else>
        <!--:to="{name:'wechatPersonalList',query:{type:'resumeList'}}"-->
          <mt-cell id="nameM"  title="我的简历" @click.native="toList('resumeList')"></mt-cell>
          <mt-cell id="nameN"  title="我的求职信" @click.native="toList('letterList')"></mt-cell>
          <mt-cell id="nameN"  title="我的入场卷" @click.native="toList('ticketList')"></mt-cell>
      </span>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import { Util } from 'naf-core';
const { isNullOrUndefined } = Util;
export default {
  name: 'Home',
  metaInfo: {
    title: '我的',
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      user: state => state.publics.user,
      userInfo: state => state.self.userInfo,
    }),
  },
  methods: {
    ...mapActions(['loadList']),
    //检查用户是否注册学籍
    check() {
      let userid = _.get(this.user, 'userid');
      return isNullOrUndefined(userid);
    },
    //查询列表+切换路由
    async toList(searchItem) {
      this.$router.push({ path: `/${searchItem}` });
    },
  },
};
</script>

<style lang='css' scoped>
</style>
