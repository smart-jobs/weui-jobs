<template lang='html'>
  <div id="CorpLetterDetail">
      <mt-header title="求职信详情">
            <mt-button   class="bgnone" slot="left" @click="$router.push({path: '/corpLetterList'})">返回</mt-button>
        </mt-header>
          <mt-cell id="nameN" :title="{data: info, searchItem: 'info.xm'}|getName" style="text-align:center;">
        </mt-cell>

        <mt-cell title="性别" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'info.xb'}|getName}} </span>
        </mt-cell>
        <mt-cell title="学历" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'info.xl'}|getName}} </span>
        </mt-cell>
        <mt-cell title="毕业学校" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'info.yxmc'}|getName}} </span>
        </mt-cell>
        <mt-cell title="专业名称" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'info.zymc'}|getName}} </span>
        </mt-cell>
        <mt-cell title="求职来源" style="text-align:left;">
              <span style="color:black;" v-if="info.type==0"> 招聘信息</span>
              <span style="color:black;" v-if="info.type==1"> 招聘会 </span>
        </mt-cell>
        <mt-cell title="联系方式" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'contact.mobile'}|getName}} </span>
        </mt-cell>
        <mt-cell title="电子邮箱" style="text-align:left;">
              <span style="color:black;"> {{{data: info, searchItem: 'contact.email'}|getName}} </span>
        </mt-cell>
       <mt-field label="自我介绍" id="neirong" style="text-align:left;" v-model="info.content" type="textarea" rows="5" disabled></mt-field>
        
        <mt-cell title="状态" style="text-align:left;">
              <span style="color:green;" v-if="info.status == '1'"> 已接受</span>
              <span style="color:red;" v-else-if="info.status == '2'"> 已拒绝</span>
              <span style="color:black;" v-else> 已接收</span>
        </mt-cell>

        <mt-cell id="huiFu" label="回复结果" v-if="info.status!='0'">
                <mt-radio 
                 id="yesN"
                v-model="info.status"
                :options="[{label:'接受',value:'1',disabled:true},{label:'拒绝',value:'2',disabled:true}]"
                >
                </mt-radio>
            </mt-cell>

            <mt-cell  id="huiFu"  label="回复结果" v-else>
                <mt-radio 
                id="yesN"
                v-model="form.status"
                :options="[{label:'接受',value:'1'},{label:'拒绝',value:'2'}]"
                >
                </mt-radio>
            </mt-cell>

            <mt-field  id="neirong" label="回复理由" v-if="info.status!='0'" v-model="info.reply" type="textarea" rows="5" disabled></mt-field>
            <mt-field  id="neirong"  label="回复理由" v-else v-model="form.reply" type="textarea" rows="5" ></mt-field>
            <mt-button type="primary" style="margin-top:30px !important; height:35px !important; line-height:35px !important; margin-bottom:30px !important;" v-if="info.status=='0'" size="large" @click.prevent="toLetterReply()">回复</mt-button>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Validator from 'async-validator';
import { MessageBox } from 'mint-ui';
export default {
  name: 'CorpLetterDetail',
  metaInfo: {
    title: '企业求职信',
  },
  components: {},
  data() {
    return {
      id: this.$route.query.id || '',
      info: {},
      form: {
        status: '',
        reply: '',
      },
      formValidator: new Validator({
        status: { type: 'string', required: true, message: '请选择回复结果' },
        reply: { type: 'string', required: true, message: '请填写回复理由' },
      }),
    };
  },
  computed: {
    ...mapState({
      detail: state => state.self.detail,
      user: state => state.publics.user,
    }),
  },
  async created() {
    const result = await this.loadDetail({ uri: 'corpLetterDetail', id: this.id });
    this.$checkRes(result, () => {
      this.$set(this, 'info', result);
    });
  },
  methods: {
    ...mapActions(['loadDetail', 'operateDetail']),
    toLetterReply() {
      this.formValidator.validate(this.form, (errors, fields) => {
        if (errors) {
          return this.handleErrors(errors, fields);
        }
        this.handleSuccess();
      });
    },
    //验证正确=>提交
    async handleSuccess() {
      let result = await this.operateDetail({ uri: 'corpLetterReply', data: this.form, corpid: this.user.corpid, id: this.id });
      this.$checkRes(result, () => {
        MessageBox.alert('求职信回复成功').then(() => {
          this.$router.push({ name: 'corpLetterList' });
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
  },
};
</script>

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
</style>
<style lang='css' scoped>

.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

</style>
