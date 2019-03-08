<template lang='html'>
  <div id="addJobsPage" >
    <mt-button v-if="uri.includes('/index.html')" class="btnClass" type="primary" size='small' @click="popupVisible=true">
       {{btnTitle}}
    </mt-button>
    <mt-button v-else class="btnClass"  type="primary" @click="popupVisible=true">
      {{btnTitle}}
    </mt-button>

    <mt-popup
        v-model="popupVisible"
        position="center"
        style="align:center; overflow-y:scroll;"
        :style="selectStyle">
        <mt-header id="com" title="添加招聘职位">
          <mt-button   class="bgnone" slot="left" @click="popupVisible=false">返回</mt-button>
          <mt-button v-if="forIndexAndDetail()"   class="bgnone" slot="right" @click="apply()">申请加入</mt-button>
        </mt-header>
        <mt-field label="职位名称" placeholder="请输入职位名称" v-model="jobs.name"></mt-field>
        <mt-field label="需求人数" placeholder="请输入需求人数" v-model="jobs.count"></mt-field>
        <mt-field label="职位要求" placeholder="请输入职位要求" v-model="jobs.requirement"></mt-field>
        <br/>
        <mt-button type="primary" size="large" style="height:35px !important;line-height:35px !important;" @click.prevent="saveJobs()">保存职位</mt-button>
      <div v-if="forIndexAndDetail()" >
        <showJobsListCard :list="jobsList" :needBtn="true" :btnTitle="'删除'" :listTitle="listTitle"></showJobsListCard>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Validator from 'async-validator';
import showJobsListCard from './showJobsList-card.vue';
export default {
  name: 'addJobsPage',
  components: {
    showJobsListCard,
  },
  props: {
    fair_id: { type: String, default: '' },
    btnTitle: { type: String, defualt: '添加' },
  },
  data() {
    return {
      popupVisible: false,
      jobs: {},
      jobsList: [],
      uri: window.location.pathname,
      listTitle: [{ name: '招聘职位' }, { count: '需求人数' }, { requirement: '职位要求' }],
      //职位验证
      jobsValidator: new Validator({
        name: { type: 'string', required: true, message: '职位名称不能为空' },
        count: { type: 'string', required: true, message: '招聘人数不能为空' },
        requirement: { type: 'string', required: true, message: '招聘需求不能为空' },
      }),
    };
  },
  created() {},
  computed: {
    selectStyle: {
      get() {
        let style = { width: '80%', height: '40%' };
        if (this.uri.includes('index') || this.uri.includes('jobfairDetail')) {
          style = { width: '80%', height: '40%' };
        }
        return style;
      },
    },
  },
  methods: {
    //企业申请加入招聘会
    ...mapActions(['corpApply']),
    //保存招聘职位的信息验证
    saveJobs() {
      this.jobsValidator.validate(this.jobs, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.handleSuccess();
      });
    },
    //实际执行保存职位信息方法
    handleSuccess() {
      this.jobsList.push(this.jobs);
      this.jobs = {};
    },
    //招聘职位信息存在错误时的方法
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
    //删除添加的职位信息
    jobsDelte(index) {
      this.jobsList.splice(index, 1);
    },
    //判断是否是首页和招聘会详情,控制显示用
    forIndexAndDetail() {
      if (this.uri.includes('index.html') || this.uri.includes('jobfairDetail.html')) return true;
    },
    //企业申请加入招聘会
    async apply() {
      let result = await this.corpApply({ fair_id: this.fair_id, jobs: this.jobsList });
      this.$checkRes(result, () => {
        this.popupVisible = false;
      });
    },
  },
};
</script>

<style scoped>
@import '../style/index.css';
@import '../style/common.css';
@import '../style/jobFair.less';
</style>
<style lang='css' scoped>
.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

#com .mint-cell-title {
  text-align: left !important;
  width: 280px;
}

.btnClass{
    float:left; 
    width:17%; 
    padding:0; 
    margin-right:0;
    position: absolute; 
    bottom:30px;
    border-radius: 0;
  }

</style>
