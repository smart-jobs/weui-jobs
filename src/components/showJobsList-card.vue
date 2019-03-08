<template lang='html'>
  <div id="showList-card">
      <el-card class="box-card" v-for="(item,index) in list" :key="index" >
          <ul style="text-align:left; float:left; width:70%; padding-bottom: 10px; margin-right:10%;">
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
          </ul>
          <mt-button v-if="needBtn&&withApi"  type="danger" class="bnClass" style="text-align:center !important;" @click="operation(item)"> {{btnTitle}}</mt-button>
          <mt-button v-else-if='needBtn&&withApi===false' style="text-align:center !important;"  type="danger" class="bnClass" @click="operation(index)"> {{btnTitle}}</mt-button>
          <mt-button v-if="needEdit"  type="primary" class="bnClass" style="text-align:center !important;" @click="toEdit(item)"> 修改</mt-button>
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
    needEdit: { type: Boolean, default: false },
  },
  data() {
    return {
      popupVisible: false,
      form: {},
      operaId: '',
    };
  },
  methods: {
    operation(data) {
      const { type, id } = data;
      if (this.withApi) {
        this.$emit('operation', { type: 'delete', id: data._id });
      } else {
        this.$emit('operation', { type: 'delete', id: data });
      }
    },
    toEdit(item) {
      console.log(item);
    },
  },
};
</script>

<style lang='css' scoped>
.btnClass {
  float:left;
  width:17%;
  padding:0;
  margin-right:0;
  margin-top: 30px;
  font-size: 12px;
  border-radius: 0;
}
.bnClass {
  /* float:left; */
  width:17%;
  padding:0;
  margin-right:0;
  margin-bottom: 7px;
  font-size: 12px;
  border-radius: 0;
  text-align:center;
}
</style>
