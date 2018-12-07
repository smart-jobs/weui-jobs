<template lang="html">
  <div id="App">
      <router-view/>
      <footerbar></footerbar>
  </div>
</template>

<script>
import footerbar from "@/components/footerbar.vue";
export default {
  name: "App",
  components: {
    footerbar,
  },
  data() {
    return {};
  }
};
</script>

<style lang="css" scoped>
</style>
