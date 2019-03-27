<template lang="html">
  <div id="newInput">
    <!--做个可以根据isDisabled判断是否可编辑的组件-->
    <mt-field label="专业名称" v-model="detail.info.zymc" disabled></mt-field>
  </div>
</template>

<script>
export default {
  name: 'newInput',
  props: {
    isDisabled: { type: Boolean, default: false },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="css" scoped></style>
