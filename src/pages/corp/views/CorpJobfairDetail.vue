<template lang='html'>
  <div id="CorpJobfairDetail">
      <mt-header title="招聘会详情">
            <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>    
        <mt-cell :title="detail.subject" id="title"></mt-cell>
        <mt-cell  class="width" title="招聘会类型" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.type}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办日期" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.date}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办时间" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.time}} </span>
        </mt-cell>
        <mt-cell  class="width" title="举办城市" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{{data: detail,searchItem:'city.name'}|getName}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办地址" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.address}} </span>
        </mt-cell>
        <mt-cell id="nameSpan" class="width" title="" >
              <span class="spanCla">温馨提示：为防讯息临时变动,参会前可联系招聘会举办方确认。</span>
        </mt-cell>
        <mt-cell id="xiugai">
          <!--如果看不见按钮:v-if中加个!号就能看见了-->
            <mt-button type="primary" @click.native="popupVisible=true" v-if="!canUpdateStatus">添加招聘职位</mt-button>
        </mt-cell>

        <!--添加职位框-->
        <mt-popup
            v-model="popupVisible"
            position="center"
            style="width:80%;height:40%;align:center;">
            <mt-header title="添加招聘职位">
                <mt-button   class="bgnone" slot="left" @click="popupVisible=false">返回</mt-button>
            </mt-header> 
        
            <mt-field label="职位名称" placeholder="请输入职位名称" v-model="form.name"></mt-field>
            <mt-field label="需求人数" placeholder="请输入需求人数,例如:1人或1-5人" v-model="form.count"></mt-field>
            <mt-field label="职位要求" placeholder="请输入职位要求" v-model="form.requirement"></mt-field>
            <br/>
            <mt-button type="primary"  style="height:35px !important;line-height:35px !important;"  size="large" @click.prevent="operateJobs({type:'add',id:detail.fair_id})">保存职位</mt-button>
        </mt-popup>

        <!--修改职位框-->
        <mt-popup
            v-model="popupVisible_edit"
            position="center"
            style="width:80%;height:40%;align:center;">
            <mt-header title="添加招聘职位">
                <mt-button   class="bgnone" slot="left" @click="popupVisible_edit=false">返回</mt-button>
            </mt-header> 
        
            <mt-field label="职位名称" placeholder="请输入职位名称" v-model="UpdateForm.name"></mt-field>
            <mt-field label="需求人数" placeholder="请输入需求人数,例如:1人或1-5人" v-model="UpdateForm.count"></mt-field>
            <mt-field label="职位要求" placeholder="请输入职位要求" v-model="UpdateForm.requirement"></mt-field>
            <br/>
            <mt-button type="primary"  style="height:35px !important;line-height:35px !important;"  size="large" @click.prevent="operateJobs({type:'update',id:UpdateForm._id})">保存职位</mt-button>
        </mt-popup>
        <newNavbar v-model="tab" :titles='navbarTitle'></newNavbar>
        <mt-tab-container v-model="tab">
          <mt-tab-container-item id="tab1" >
              <pre style="text-align:left;">{{detail.content}}</pre>
          </mt-tab-container-item>

          <mt-tab-container-item id="tab2" >
              <showJobsListCard :list='jobs' :needBtn='true' :needEdit="true" @operation='operateJobs' @update="toUpdate"></showJobsListCard>
          </mt-tab-container-item>

        </mt-tab-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import Validator from 'async-validator';
import showJobsListCard from '@/components/showJobsList-card.vue';
import newNavbar from '@/components/newNavbar.vue';
export default {
  name: 'CorpJobfairDetail',
  metaInfo: {
    title: '企业的招聘会',
  },
  components: { showJobsListCard, newNavbar },
  data() {
    return {
      id: this.$route.query.id,
      jobs: [],
      form: {},
      UpdateForm: {},
      jobsValidator: new Validator({
        //职位验证
        form: {
          type: 'object',
          required: true,
          fields: {
            name: { type: 'string', required: true, message: '职位信息不能为空' },
            count: { type: 'string', required: true, message: '招聘人数不能为空' },
            requirement: { type: 'string', required: true, message: '招聘需求不能为空' },
          },
        },
      }),
      popupVisible: false,
      popupVisible_edit: false,
      tab: 'tab1',
    };
  },
  async created() {
    this.load();
  },
  computed: {
    ...mapState({
      detail: state => state.self.detail,
      user: state => state.publics.user,
    }),
    canUpdateStatus: {
      get() {
        let status = _.get(this.detail, 'status');
        if (status === '0') {
          return false;
        } else {
          return true;
        }
      },
    },
    navbarTitle: {
      get() {
        let result;
        if (this.canUpdateStatus) {
          result = ['招聘会详情', '已申请的职位'];
        } else {
          result = ['招聘会详情', '申请中的职位'];
        }
        return result;
      },
    },
  },
  methods: {
    ...mapActions(['loadDetail', 'operateDetail']),
    //load
    async load() {
      let result = await this.loadDetail({ uri: 'corpJobfairDetail', id: this.id, corpid: this.user.corpid });
      this.$checkRes(result, () => {
        this.$set(this, 'jobs', result.jobs);
      });
    },
    //职位操作
    operateJobs(data) {
      const { type, id } = data;
      if (type === 'add') {
        this.jobsValidator.validate(this.form, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.handleSuccess({ uri: 'corpJobfairJobAdd', id: id });
        });
      } else if (type === 'delete') {
        return this.handleSuccess({ uri: 'corpJobfairJobDelete', id: id });
      } else if (type === 'update') {
        this.jobsValidator.validate(this.UpdateForm, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.handleSuccess({ uri: 'corpJobfairJobUpdate', id: id });
        });
      }
    },
    //验证正确=>提交
    async handleSuccess(data) {
      const { uri, id } = data;
      let result = await this.operateDetail({
        uri: uri,
        data: uri === 'corpJobfairJobUpdate' ? this.UpdateForm : uri === 'corpJobfairJobDelete' ? {} : this.form,
        corpid: this.user.corpid,
        id: uri === 'corpJobfairJobUpdate' || uri === 'corpJobfairJobDelete' ? id : this.id,
      });
      this.$checkRes(result, () => {
        if (uri === 'corpJobfairJobUpdate') {
          this.$message.success('修改成功');
          this.popupVisible_edit = false;
        } else if (uri === 'corpJobfairJobAdd') {
          this.$message.success('添加成功');
          this.form = {};
        } else if (uri === 'corpJobfairJobDelete') {
          this.$message.success('删除成功');
        }
        // this.$router.push({ name: 'corpJobfairList' });
        this.load();
      });
    },
    //验证错误
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
    //打开修改框
    toUpdate(data) {
      const { job_info } = data;
      this.popupVisible_edit = true;
      this.UpdateForm = JSON.parse(JSON.stringify(job_info));
    },
  },
};
</script>

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
@import '../../../style/jobFair.less';
</style>
<style lang='css' scoped>

.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

</style>
