<template lang="html">
  <div id="ResumeAdd">
    <mt-header title="简历详情">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/resumeList' })">返回</mt-button>
    </mt-header>
    <mt-field label="模板标题" placeholder="请输入模板标题" v-model="detail.title"></mt-field>
    <mt-field label="学历" v-model="detail.info.xl" readonly></mt-field>
    <mt-field label="性别" id="sex" v-model="detail.info.xb" readonly></mt-field>
    <mt-field label="毕业院校" v-model="detail.info.yxmc" readonly></mt-field>
    <mt-field label="专业名称" v-model="detail.info.zymc" readonly></mt-field>
    <mt-cell title="出生日期" v-model="detail.info.csrq" @click.native="openDate()">
      <span style="font-size:14px;" :style="selectColor">{{ (detail.info && detail.info.csrq) || '请选择出生日期' }}</span>
    </mt-cell>
    <mt-field label="联系电话" placeholder="请输入联系电话" v-model="detail.contact.mobile"></mt-field>
    <mt-field label="电子邮箱" placeholder="请输入电子邮箱" v-model="detail.contact.email"></mt-field>
    <mt-field label="自我介绍" placeholder="请输入自我介绍" id="neirong" v-model="detail.content" type="textarea" rows="5"></mt-field>
    <mt-button type="primary" size="large" style="margin-top:30px !important; height:35px !important; line-height:35px;" @click="addResume()">新建</mt-button>
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
import _ from 'lodash';
import Validator from 'async-validator';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
export default {
  name: 'ResumeAdd',
  metaInfo: {
    title: '添加简历',
  },
  components: {},
  data() {
    return {
      detail: {
        title: '',
        info: { csrq: null },
        contact: {},
        content: '',
      },
      resumeValidator: new Validator({
        title: { type: 'string', required: true, message: '模板标题不能为空' },
        info: {
          type: 'object',
          required: true,
          fields: {
            xl: { type: 'string', required: true, message: '学历不能为空' },
            xb: { type: 'string', required: true, message: '请选择性别' },
            yxmc: { type: 'string', required: true, message: '毕业院校不能为空' },
            zymc: { type: 'string', required: true, message: '专业名称不能为空' },
            csrq: { type: 'string', required: true, message: '出生日期不能为空' },
          },
        },
        contact: {
          type: 'object',
          required: true,
          fields: {
            mobile: { type: 'string', required: true, message: '联系电话不能为空' },
            email: { type: 'string', required: true, message: '电子邮箱不能为空' },
          },
        },
      }),
      dateSelect: '',
      starttime: new Date('1990-01-01'),
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.self.userInfo,
      user: state => state.publics.user,
    }),
    selectColor: {
      get() {
        let style = {};
        if (!isNullOrUndefined(_.get(this.detail, 'info.csrq'))) {
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
  async mounted() {
    await this.getUserInfo({ userid: this.user.userid });
    this.getDefalutData();
  },
  methods: {
    ...mapActions(['getUserInfo', 'operateDetail']),
    //赋默认值
    getDefalutData() {
      this.$set(this.detail.info, 'xl', _.get(this.userInfo, 'xl'));
      this.$set(this.detail.info, 'xb', _.get(this.userInfo, 'xb'));
      this.$set(this.detail.info, 'yxmc', _.get(this.userInfo, 'yxmc'));
      this.$set(this.detail.info, 'zymc', _.get(this.userInfo, 'zymc'));
    },
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
      this.$set(this.detail.info, 'csrq', dateStr);
    },
    //新建简历
    addResume() {
      this.resumeValidator.validate(this.detail, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess() {
      let result = await this.operateDetail({ uri: 'createResume', data: this.detail, userid: this.user.userid });
      this.$checkRes(result, () => {
        this.$message.success('新建简历成功');
        this.$router.push({ path: '/resumeList' });
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
  },
};
</script>

<style lang="css" scoped>
  .mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;

}
</style>
