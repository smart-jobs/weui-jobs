<template lang='html'>
  <div id="LetterList">
      <mt-header title="我的求职信">
        <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
      </mt-header>
      <list :type='type' :needBtn='false'></list>
  </div>
</template>

<script>
import list from '@/components/list.vue';
export default {
  name: 'LetterList',
  metaInfo: {
    title: '求职信列表',
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

<style lang='css' scoped>
    .mint-header{
      background-color: #2577e3;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
     
  }
</style>
