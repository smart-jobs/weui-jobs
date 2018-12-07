<template lang="html">
  <div id="App">
      <router-view/>
      <footerbar></footerbar>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import footerbar from "@/components/footerbar.vue";
export default {
  name: "App",
  metaInfo: {
    title: '首页',
    titleTemplate: '智慧就业 - %s',
  },
  components: {
    footerbar,
  },
  data() {
    return {};
  },
  created() {
    this.getUser();
    this.loadUnit();
  },
  methods: {
    ...mapActions(['getUser','loadUnit']),
  }
};
</script>

<style lang="css" scoped>
</style>
