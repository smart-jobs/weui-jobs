<template lang='html'>
  <div id="CorpCampusDetail">
      <mt-header title="修改宣讲会">
          <mt-button   class="bgnone"  slot="left" @click="$router.go(-1)">返回</mt-button>
      </mt-header> 
      <mt-field label="宣讲会标题" placeholder="请输入宣讲会标题" v-model="info.subject" :disabled='canEdit'></mt-field>
      <mt-field label="举办地址" placeholder="请输入举办地址" v-model="info.address" :disabled='canEdit'></mt-field>
      <mt-field label="举办时间" placeholder="请输入举办时间" type="time" v-model="info.time" :disabled='canEdit'></mt-field>
      <mt-field label="电子邮箱" placeholder="请输入电子邮箱" v-model="info.email" :disabled='canEdit'></mt-field>
      <mt-field label="联系电话" placeholder="请输入联系电话" v-model="info.contact" :disabled='canEdit'></mt-field>
      <mt-cell title="举办日期"  @click.native="openDate()" >
        <span style="font-size:14px;" :style="selectColor">{{info.date||'请选择举办日期'}}</span>
      </mt-cell>
      <newSelect type='unit' title="选择分站" v-model="info.unit" :originalValue='info.unit' :canEdit='!canEdit' placeholder='请选择分站'></newSelect>
      <mt-cell  id="zhiwei" title="招聘职位" label="点击此处为宣讲会添加招聘信息" @click.native="toOperateJobs()"></mt-cell>
      <!--编辑职位框-->
      <mt-popup
          v-model="popupVisible"
          position="center"
          :modal='false'
          style="width:80%;height:40%;align:center;">
          <mt-header title="添加招聘职位">
              <mt-button   class="bgnone" slot="left" @click="popupVisible=false">返回</mt-button>
          </mt-header> 
      
          <mt-field label="职位名称" placeholder="请输入职位名称" v-model="form.name"></mt-field>
          <mt-field label="需求人数" placeholder="请输入需求人数" v-model="form.count"></mt-field>
          <mt-field label="职位要求" placeholder="请输入职位要求" v-model="form.requirement"></mt-field>
          <br/>
          <mt-button type="primary" size="large" @click.prevent="operateJobs({type:'add',id:info.fair_id})">保存职位</mt-button>
      </mt-popup>
      <newNavbar v-model="tab" :titles='navbarTitle'></newNavbar>

      <mt-tab-container v-model="tab">
          <mt-tab-container-item id="tab1" >
              <mt-field v-if='!canEdit' label="宣讲会内容" id="neirong" placeholder="请输入宣讲会内容" type="textarea" v-model="info.content" rows="5" ></mt-field>
              <pre v-else >{{info.content}} </pre>
          </mt-tab-container-item>

          <mt-tab-container-item id="tab2" >
              <showJobsListCard :list='info.jobs' :needBtn='!canEdit' @operation='operateJobs' :withApi='false'></showJobsListCard>
          </mt-tab-container-item>

      </mt-tab-container>
      <mt-button v-if='!canEdit' class='lastbtn' style="height:35px !important; line-height:35px !important;"  type="primary" size="large" @click.prevent="toUpdateCampus()">修改宣讲会</mt-button>

      <!--弹框部分-->
      <mt-datetime-picker
            ref="picker"
            v-model="dateSelect"
            type="date"
            :start-date="starttime"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="selectDate">
      </mt-datetime-picker>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import newSelect from '@/components/newSelect.vue';
import newNavbar from '@/components/newNavbar.vue';
import showJobsListCard from '@/components/showJobsList-card.vue';
import Validator from 'async-validator';
import { MessageBox } from 'mint-ui';
import _ from 'lodash';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
export default {
  name: 'CorpCampusDetail',
  metaInfo: {
    title: '企业宣讲会修改',
  },
  components: { newSelect, newNavbar, showJobsListCard },
  data() {
    return {
      id: this.$route.query.id,
      info: { jobs: [] },
      dateSelect: '',
      starttime: new Date(),
      popupVisible: false,
      tab: 'tab1',
      form: {},
      jobsValidator: new Validator({
        name: { type: 'string', required: true, message: '职位信息不能为空' },
        count: { type: 'string', required: true, message: '招聘人数不能为空' },
        requirement: { type: 'string', required: true, message: '招聘需求不能为空' },
      }),
      campusValidator: new Validator({
        subject: { type: 'string', required: true, message: '宣讲会标题为空' },
        address: { type: 'string', required: true, message: '举办地址不能为空' },
        time: { type: 'string', required: true, message: '举办时间不能为空' },
        email: { type: 'string', required: true, message: '电子邮箱不能为空' },
        contact: { type: 'string', required: true, message: '联系电话不能为空' },
        date: { type: 'string', required: true, message: '举办日期不能为空' },
        unit: { type: 'string', required: true, message: '分站信息不能为空' },
      }),
    };
  },
  computed: {
    ...mapState({
      detail: state => state.self.detail,
      user: state => state.publics.user,
    }),
    selectColor: {
      get() {
        let style = {};
        if (!isNullOrUndefined(_.get(this.info, 'date'))) {
          style = { color: 'black' };
        }
        return style;
      },
      set(value) {
        let style = { color: 'black' };
        return style;
      },
    },
    navbarTitle: {
      get() {
        let result;
        if (_.get(this.info, 'status') === '0') {
          result = ['招聘会详情', '已申请的职位'];
        } else {
          result = ['招聘会详情', '申请中的职位'];
        }
        return result;
      },
    },
    canEdit: {
      get() {
        if (this.info.status === '0' || this.detail.status === '0') {
          return true;
        } else {
          return false;
        }
      },
    },
  },
  watch: {
    dateSelect(val) {
      if (val) {
        this.closeTouch();
      } else {
        this.openTouch();
      }
    },
  },
  async created() {
    let result = await this.loadDetail({ uri: 'corpCampusDetail', id: this.id });
    this.$checkRes(result, () => {
      this.$set(this, 'info', result);
    });
  },
  methods: {
    ...mapActions(['operateDetail', 'loadDetail']),
    //选择日期组件开关
    openDate() {
      if (!this.canEdit) {
        this.$refs.picker.open();
      }
    },
    //选择框的日期整理后赋给detail中
    selectDate(date) {
      let year = date.getYear() + 1900,
        month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let dateStr = year + '-' + month + '-' + day;
      this.$set(this.info, 'date', dateStr);
    },
    //打开编辑职位弹框
    toOperateJobs() {
      if (!this.canEdit) {
        this.popupVisible = true;
      }
    },
    //操作职位信息
    operateJobs(data) {
      const { type, id } = data;
      if (type === 'add') {
        this.jobsValidator.validate(this.form, (errors, fields) => {
          if (errors) {
            return this.handleErrors(errors, fields);
          }
          return this.handleSuccess(data);
        });
      } else if (type === 'delete') {
        return this.handleSuccess(data);
      }
    },
    //验证宣讲会内容
    toUpdateCampus() {
      this.campusValidator.validate(this.info, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess(data) {
      if (!isNullOrUndefined(data)) {
        const { type, id } = data;
        if (type === 'add') {
          this.info.jobs.push(this.form);
          this.form = {};
        } else {
          this.info.jobs.splice(id, 1);
        }
      } else {
        let result = await this.operateDetail({ uri: 'corpCampusUpdate', corpid: this.user.corpid, _tenant: this.info.unit, data: this.info, id: this.id });
        this.$checkRes(result, () => {
          MessageBox.alert('修改宣讲会成功').then(() => {
            this.$router.push({ name: 'corpCampusList' });
          });
        });
      }
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
  },
};
</script>

<style lang='css' scoped>
.lastbtn{
  margin-top:50px !important;
}
</style>
