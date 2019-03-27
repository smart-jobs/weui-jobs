<template lang="html">
  <div id="CorpJobinfoAdd">
    <mt-header title="添加招聘信息">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/corpJobinfoList' })">返回</mt-button>
    </mt-header>
    <mt-field label="标  题" placeholder="请输入标题" v-model="detail.title"></mt-field>
    <newSelect type="city" title="所在城市" placeholder="请选择所在城市" v-model="detail.city" mode="both"></newSelect>
    <mt-field label="需求人数" placeholder="请输入需求人数,例如:1人或1-5人" v-model="detail.count"></mt-field>
    <mt-field label="职位描述" placeholder="请输入职位描述" v-model="detail.jobdesc"></mt-field>
    <newSelect type="jobcat" title="职位类别" placeholder="请输入职位类别" v-model="detail.jobcat" mode="both"></newSelect>
    <newSelect type="nature" title="工作性质" placeholder="请选择工作性质" v-model="detail.nature" mode="both"></newSelect>
    <newSelect type="salary" title="薪资待遇" placeholder="请输入薪资待遇" v-model="detail.salary" mode="both"></newSelect>
    <newSelect type="xlreqs" title="学历层次" placeholder="请选择学历层次" v-model="detail.xlreqs" mode="both"></newSelect>
    <mt-field label="专业要求" placeholder="请选择专业要求" v-model="detail.zyreqs"></mt-field>
    <mt-cell title="失效日期" @click.native="openDate()">
      <span style="font-size:14px;" :style="selectColor">{{ detail.expired || '失效日期默认为创建两周后' }}</span>
    </mt-cell>
    <newSelect type="unit" title="选择分站" v-model="detail.unit" placeholder="请选择分站"></newSelect>
    <mt-field label="信息内容" id="neirong" placeholder="请输入信息内容" v-model="detail.content" type="textarea" rows="5"></mt-field>
    <mt-button
      style="height:35px !important; line-height:35px !important;margin-top: 20px !important; "
      type="primary"
      size="large"
      @click.prevent="toApplyJobinfo()"
      >发布招聘信息</mt-button
    >

    <!--时间弹框部分-->
    <mt-datetime-picker
      ref="picker"
      v-model="dateSelect"
      type="date"
      :start-date="starttime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="selectDate"
    >
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
  name: 'CorpJobinfoAdd',
  metaInfo: {
    title: '企业招聘信息添加',
  },
  components: { newSelect },
  data() {
    return {
      detail: {},
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
      user: state => state.publics.user,
    }),
    selectColor: {
      get() {
        let style = {};
        if (!isNullOrUndefined(_.get(this.detail, 'date'))) {
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
    ...mapActions(['operateDetail']),
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
      this.$set(this.detail, 'expired', dateStr);
    },
    //验证招聘信息内容
    toApplyJobinfo() {
      this.validator.validate(this.detail, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        return this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess() {
      let result = await this.operateDetail({ uri: 'corpJobinfoAdd', corpid: this.user.corpid, _tenant: this.detail.unit, data: this.detail });
      this.$checkRes(result, () => {
        MessageBox.alert('创建招聘信息成功').then(() => {
          this.$router.push({ name: 'corpJobinfoList' });
        });
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

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
</style>
<style lang="css" scoped>

.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height:40px;
  font-size: 16px;
}
</style>
