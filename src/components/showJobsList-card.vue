<template lang='html'>
  <div id="showList-card">
      <el-card class="box-card" v-for="(item,index) in list" :key="index" >
          <ul style="text-align:left;" >
              <li slot="header" class="clearfix">
                  招聘职位:
                  {{item.name}}
              </li>
              <li class="text item" >
                  需求人数:
                  {{item.count}}
              </li>
              <li class="text item">
                  职位要求:
                  {{item.requirement}}
              </li>
              <mt-button v-if="needBtn&&withApi"  type="danger" style="position:relative;left:80%;bottom: 3em;" @click="operation(item)"> {{btnTitle}}</mt-button>
              <mt-button v-else  type="danger" style="position:relative;left:80%;bottom: 3em;" @click="operation(index)"> {{btnTitle}}</mt-button>
          </ul>
      </el-card>
  </div>
</template>

<script>
export default {
  name: 'showList-card',
  props: {
    list: { type: Array },
    needBtn: { type: Boolean, default: false },
    btnTitle: { type: String, default: '删除' },
    withApi: { type: Boolean, default: true },
  },
  methods: {
    operation(data) {
      if (this.withApi) {
        this.$emit('operation', { type: 'delete', id: data._id });
      } else {
        this.$emit('operation', { type: 'delete', id: data });
      }
    },
  },
};
</script>

<style lang='css' scoped>
</style>
