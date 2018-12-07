<template lang='html'>
  <div id="addJobsPage" >
    <mt-button  type="primary" size='small' @click="popupVisible=true">
       {{btnTitle}}
    </mt-button>

    <mt-popup
        v-model="popupVisible"
        position="center"
        style="align:center; overflow-y:scroll;"
        :style="selectStyle">
        <mt-header id="com" title="添加招聘职位">
          <mt-button   class="bgnone" slot="left" @click="popupVisible=false">返回</mt-button>
        </mt-header>
        <mt-field label="职位名称" placeholder="请输入职位名称" v-model="jobs.name"></mt-field>
        <mt-field label="需求人数" placeholder="请输入需求人数" v-model="jobs.count"></mt-field>
        <mt-field label="职位要求" placeholder="请输入职位要求" v-model="jobs.requirement"></mt-field>
        <br/>
        <mt-button type="primary" size="large" style="height:35px !important;line-height:35px !important;" @click.prevent="saveJobs()">保存职位</mt-button>
    

      <div v-if="justForIndex()" >
        <el-card class="box-card" v-for="(item,index) in jobsList" :key="index">
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
            </ul>
        </el-card>
        <mt-button type="primary" size="large" style="height:35px !important;line-height:35px !important;" @click="apply()">申请加入</mt-button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Validator from 'async-validator';
export default {
  name: 'addJobsPage',
  props: {
    fair_id: { type: String, default: '' },
    btnTitle:{type:String,defualt:'添加'}
  },
  data() {
    return {
      popupVisible:false,
      jobs: {},
      jobsList:[],
      uri:window.location.pathname,
      //职位验证
      jobsValidator: new Validator({
        name: { type: 'string', required: true, message: '职位名称不能为空' },
        count: { type: 'string', required: true, message: '招聘人数不能为空' },
        requirement: { type: 'string', required: true, message: '招聘需求不能为空' },
      })
    }
  },
  computed: {
    selectStyle: {
     get(){
       let style={'width':'80%','height':'40%'}
       if(this.uri.includes("index")){
         style={'width':'100%','height':'75%'}
       }
       return style
     }
    }
  },
  methods: {
    //企业申请加入招聘会
    ...mapActions(['corpApply']),
    saveJobs() {
      this.jobsValidator.validate(this.jobs, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.handleSuccess();
      })
    },
    handleSuccess() {
      this.jobsList.push(this.jobs);
      this.jobs={}
    },
    handleErrors(errors, fields) {
      this.$message.error(errors[0].message);
      this.errors = errors.reduce((p, c) => {
        // eslint-disable-next-line no-param-reassign
        p[c.field] = 'error';
        return p;
      }, {});
      // eslint-disable-next-line no-console
      console.debug(errors, fields);
    },
    //判断是否是首页,控制显示用
    justForIndex(){
      if(this.uri==='/index.html') return true
    },
    //企业申请加入招聘会
    async apply(){
      let result=await this.corpApply({fair_id:this.fair_id,jobs:this.jobsList})
      this.$checkRes(result,()=>{
      })
    }
  }
}
</script>

<style lang='css' scoped>
#com .mint-cell-title {
  text-align: left !important;
  width: 280px;
}
</style>