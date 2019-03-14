<template lang='html'>
  <div id="listOptions">
      <li :class="selectClass">{{content}} </li>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'listOptions',
  props: {
    content: { type: String, default: null },
    selectClass: { type: String, default: null },
  },
  data() {
    return {};
  },
};
</script>

<style lang='css' scoped>
 .listOpt li{
   /* line-height:40px; */
 }
</style>
