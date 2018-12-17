<template lang='html'>
  <div id="CorpLetterDetail">
      <mt-header title="招聘信息详情">
          <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
      </mt-header>
        <mt-field label="标  题" placeholder="请输入标题" v-model="info.title" ></mt-field>
        <newSelect type='city' title='所在城市' placeholder="请选择所在城市" v-model='info.city' mode='both' :originalValue='info.city'></newSelect>
        <mt-field label="需求人数" placeholder="请输入需求人数,例如:1人或1-5人" v-model="info.count"></mt-field>
        <mt-field label="职位描述" placeholder="请输入职位描述" v-model="info.jobdesc" ></mt-field>
        <newSelect type='jobcat' title='职位类别' placeholder="请输入职位类别" v-model='info.jobcat' mode='both' :originalValue='info.jobcat'></newSelect>
        <newSelect type='nature' title='工作性质' placeholder="请选择工作性质" v-model='info.nature' mode='both' :originalValue='info.nature'></newSelect>
        <newSelect type='salary' title='薪资待遇' placeholder="请输入薪资待遇" v-model='info.salary' mode='both' :originalValue='info.salary'></newSelect>
        <newSelect type='xlreqs' title='学历层次' placeholder="请选择学历层次" v-model='info.xlreqs' mode='both' :originalValue='info.xlreqs'></newSelect>
        <mt-field label="专业要求" placeholder="请选择专业要求" v-model="info.zyreqs" ></mt-field>
        <mt-cell title="失效日期"  @click.native="openDate()" >
          <span style="font-size:14px;" :style="selectColor">{{info.expired||'失效日期默认为创建两周后'}}</span>
        </mt-cell>
        <newSelect type='unit' title="选择分站" v-model="info.unit" placeholder='请选择分站' :originalValue='info.unit'></newSelect>
        <mt-field label="信息内容" id="neirong" placeholder="请输入信息内容" v-model="info.content" type="textarea" rows="5" ></mt-field>
        <mt-button style="height:35px !important; line-height:35px !important;"  type="primary" size="large" @click.prevent="toUpdateJobinfo()">修改招聘信息</mt-button>
        
        <!--时间弹框部分-->
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
import Validator from 'async-validator';
import _ from 'lodash';
import { MessageBox } from 'mint-ui';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
export default {
  name: 'CorpLetterDetail',
  metaInfo: {
    title: '企业招聘信息',
  },
  components: { newSelect },
  data() {
    return {
      id: this.$route.query.id || '',
      info: {},
      dateSelect: '',
      starttime: new Date(),
      validator: new Validator({
        title: { type: 'string', required: true, message: '招聘标题不能为空' },
        city: { type: 'object', required: true, message: '所在城市不能为空' },
        count: { type: 'string', required: true, message: '需求人数不能为空' },
        jobdesc: { type: 'string', required: true, message: '职位描述不能为空' },
        jobcat: { type: 'object', required: true, message: '职位类别不能为空' },
        nature: { type: 'object', required: true, message: '工作性质不能为空' },
        salary: { type: 'object', required: true, message: '薪资待遇不能为空' },
        xlreqs: { type: 'object', required: true, message: '学历层次不能为空' },
        zyreqs: { type: 'string', required: true, message: '专业要求不能为空' },
        unit: { type: 'string', required: true, message: '分站信息不能为空' },
        content: { type: 'string', required: true, message: '招聘内容不能为空' },
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
        if (!isNullOrUndefined(_.get(this.info, 'expired'))) {
          style = { color: 'black' };
        }
        return style;
      },
      set(value) {
        let style = { color: 'black' };
        return style;
      },
    },
  },
  async created() {
    const result = await this.loadDetail({ uri: 'corpJobinfoDetail', id: this.id, corpid: this.user.corpid });
    this.$checkRes(result, () => {
      this.$set(this, 'info', result);
    });
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
  methods: {
    ...mapActions(['loadDetail', 'operateDetail']),
    //选择日期组件开关
    openDate() {
      this.$refs.picker.open();
    },
    //选择框的日期整理后赋给detail中
    selectDate(date) {
      let year = date.getYear() + 1900,
        month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let dateStr = year + '-' + month + '-' + day;
      this.$set(this.info, 'expired', dateStr);
    },
    toUpdateJobinfo() {
      this.validator.validate(this.info, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess() {
      let result = await this.operateDetail({ uri: 'corpJobinfoUpdate', data: this.info, corpid: this.user.corpid, id: this.id, _tenant: this.info.unit });
      this.$checkRes(result, () => {
        this.$router.push({ name: 'corpJobinfoList' });
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
    //滑动穿屏问题
    closeTouch() {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false }); //阻止默认事件
    },
    openTouch() {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, { passive: false }); //打开默认事件
    },
  },
};
</script>

<style lang='css' scoped>
</style>
