<template lang="html">
  <div id="CorpCampusList">
    <mt-header title="企业宣讲会">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/' })">返回</mt-button>
      <mt-button class="bgnone" style="text-align:right !important;" slot="right" @click="$router.push({ path: '/corpCampusAdd' })">添加</mt-button>
    </mt-header>
    <list :type="type" :needBtn="false"></list>
  </div>
</template>

<script>
import list from '@/components/list.vue';
export default {
  name: 'CorpCampusList',
  metaInfo: {
    title: '企业宣讲会列表',
  },
  components: { list },
  data() {
    return {};
  },
  computed: {
    type: {
      get() {
        return this.$route.name;
      },
    },
  },
  methods: {},
};
</script>

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
</style>
<style lang="css" scoped>

.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
