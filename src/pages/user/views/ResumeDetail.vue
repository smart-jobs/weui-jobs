<template lang='html'>
  <div id="ResumeDetail">
      <mt-header title="简历详情">
          <mt-button   class="bgnone" slot="left" @click="$router.push({ path:'/resumeList' })">返回</mt-button>
        </mt-header>
        <mt-field label="模板标题" placeholder="请输入模板标题" v-model="form.title"></mt-field>
        <mt-field label="学历"  v-model="form.info.xl" disabled></mt-field>
        <mt-field label="性别" id="sex" v-model="form.info.xb" disabled></mt-field>
        <mt-field label="毕业院校" v-model="form.info.yxmc" disabled></mt-field>
        <mt-field label="专业名称" v-model="form.info.zymc" disabled></mt-field>
        <mt-cell title="出生日期"  v-model="form.info.csrq" @click.native="openDate()">
            <span style="font-size:14px;color: black;">{{(form.info&&form.info.csrq)||'请选择出生日期'}}</span>
        </mt-cell>
        <mt-field label="联系电话" placeholder="请输入联系电话" v-model="form.contact.mobile"></mt-field>
        <mt-field label="电子邮箱" placeholder="请输入电子邮箱" v-model="form.contact.email"></mt-field>
        <mt-field label="自我介绍" placeholder="请输入自我介绍" id="neirong" v-model="form.content" type="textarea" rows="5"></mt-field>
        <mt-button type="primary" size="large" style="margin-top:30px !important; height:35px !important; line-height:35px;" @click.prevent="saveResume()">修改</mt-button>
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
import Validator from 'async-validator';
import _ from 'lodash';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
export default {
  name: 'ResumeDetail',
  metaInfo: {
    title: '简历详情',
  },
  components: {},
  data() {
    return {
      form: {
        title: '',
        info: {},
        contact: {},
        content: '',
      },
      id: this.$route.query.id || '',
      dateSelect: '',
      starttime: new Date('1990-01-01'),
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
    };
  },
  computed: {
    ...mapState({
      detail: state => state.self.detail,
      userInfo: state => state.self.userInfo,
      user: state => state.publics.user,
    }),
  },
  async created() {
    const result = await this.loadDetail({ uri: 'resumeDetail', id: this.id });
    this.$checkRes(result, () => {
      this.$set(this.form, 'info', result.info || {});
      this.$set(this.form, 'contact', result.contact || {});
      this.$set(this.form, 'content', result.content);
      this.$set(this.form, 'title', result.title);
    });
  },
  methods: {
    ...mapActions(['loadDetail', 'operateDetail']),
    //选择框的日期整理后赋给detail中
    selectDate(date) {
      let year = date.getYear() + 1900,
        month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let dateStr = year + '-' + month + '-' + day;
      this.$set(this.form.info, 'csrq', dateStr);
    },
    //选择日期组件开关
    openDate() {
      this.$refs.picker.open();
    },
    //修改简历
    saveResume() {
      this.resumeValidator.validate(this.detail, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess() {
      let result = await this.operateDetail({ uri: 'updateResume', data: this.form, userid: this.user.userid, id: this.id });
      this.$checkRes(result, () => {
        this.$message.success('修改简历成功');
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

<style lang='css' scoped>
    .mint-header{
      background-color: #2577e3;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
     
  }
</style>
