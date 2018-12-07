<template lang='html'>
  <div id="newNavbar">
      <mt-navbar id="tabTab" v-model="active" >
        <mt-tab-item v-for="(item,index) in titles" :key="index" :id="'tab'+index" >{{item}}</mt-tab-item>
      </mt-navbar>
  </div>
</template>

<script>
export default {
  name: 'newNavbar',
  props: {
    titles: {
      type: Array,
    }
  },
  watch:{
    active:{
      handler(newValue) {
        this.$emit('input', newValue);
      }
    }
  },
  data() {
    return {
      active:"tab0"
    }
  },
  methods:{
  }
}
</script>

<style lang='css' scoped>
</style>