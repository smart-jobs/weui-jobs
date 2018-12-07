<template lang="html">
  <div id="Home">
      <p> Home2 </p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {};
  },
  created(){
    this.getData();
  },
  methods: {
    ...mapActions(['loadIndexList']),
    async getData() {
      const {jobfairList, campusList, jobinfoList} = await this.loadIndexList();
      console.log(jobfairList);
      console.log(campusList);
      console.log(jobinfoList);
    }
  }
};
</script>

<style lang="css" scoped>
</style>
