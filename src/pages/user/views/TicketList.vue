<template lang="html">
  <div id="TicketList">
    <mt-header title="我的入场券">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/' })">返回</mt-button>
    </mt-header>
    <list :type="type" :needBtn="true"></list>
  </div>
</template>

<script>
import list from '@/components/list.vue';
export default {
  name: 'TicketList',
  metaInfo: {
    title: '入场券列表',
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

<style lang="css" scoped>
  .mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;

}
</style>
