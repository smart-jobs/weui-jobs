<template lang="html">
  <div id="ResumeList">
    <mt-header title="我的简历">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/' })">返回</mt-button>
      <mt-button class="bgnone" slot="right" @click="$router.push({ path: '/resumeAdd' })">添加简历</mt-button>
    </mt-header>
    <list :type="type" :needBtn="true"></list>
  </div>
</template>

<script>
import list from '@/components/list.vue';
export default {
  name: 'ResumeList',
  metaInfo: {
    title: '简历列表',
  },
  components: {
    list,
  },
  computed: {
    type: {
      get() {
        return this.$route.name;
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="css" scoped>
  .mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}
</style>
