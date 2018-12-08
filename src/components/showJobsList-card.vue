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
              <mt-button v-if="needBtn"  type="danger" style="position:relative;left:80%;bottom: 3em;" @click="operation(index)"> {{btnTitle}}</mt-button>
          </ul>
      </el-card>
  </div>
</template>

<script>
// import _ from "lodash";
export default {
  name: 'showList-card',
  props: {
    list: { type: Array },
    // listTitle: { type: Array },
    needBtn: { type: Boolean, default: false },
    btnTitle: { type: String, default: '' },
  },
  methods: {
    operation(data) {
      this.$emit('', data);
    },
    //以后再研究把对应的key也跟着循环输出,先固定输出这些
    // getTitle(data){
    //       const {position,keys}=data
    //       let keyNames=Object.keys(keys);
    //       let name=_.get(_.find(this.listTitle,keyNames[position]),keyNames[position])
    //       return name
    // }
  },
};
</script>

<style lang='css' scoped>
</style>
