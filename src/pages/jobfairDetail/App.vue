<template lang="html">
  <div id="App">
    <!-- <el-container> -->
    <router-view style="width:100%;margin-bottom:50px" />
    <footerbar></footerbar>
    <!-- </el-container> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import footerbar from '@/components/footerbar.vue';
export default {
  name: 'App',
  metaInfo: {
    title: '',
    titleTemplate: '智慧就业 - %s',
  },
  components: {
    footerbar,
  },
  data() {
    return {};
  },
  async created() {
    await this.getUser();
    await this.loadUnit();
  },
  methods: {
    //获取用户信息,获取分站列表
    ...mapActions(['getUser', 'loadUnit']),
  },
};
</script>

<style lang="less" scoped>
@import '../../style/common.css';
</style>
