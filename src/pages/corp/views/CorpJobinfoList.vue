<template lang='html'>
  <div id="CorpJobinfoList">
      <mt-header title="企业招聘信息">
        <mt-button  class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
      </mt-header>
      <list :type='type' :needBtn='false'></list>
  </div>
</template>

<script>
import list from '@/components/list.vue';
export default {
  name: 'CorpJobinfoList',
  metaInfo: {
    title: '企业招聘信息列表',
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

</style>
