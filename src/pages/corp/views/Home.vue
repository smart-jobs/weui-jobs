<template lang='html'>
  <div id="Home">
      <mt-header title="我    的"></mt-header>
      <span v-if="check()==='1'||check()==='2'">
        <a href="/weixin/ui/center/index.html">
            <mt-cell  id="nameM" title="您的企业还未审核,请完善企业信息"  style="background-color:red;color:yellow;" icon="field-warning"></mt-cell>
        </a>
      </span>
      <span v-else-if="check()=='3'">
          <a href="/weixin/ui/center/index.html">
              <mt-cell  id="nameM" title="企业审核失败"  style="background-color:red;color:yellow;" icon="field-warning"></mt-cell>
          </a>
      </span>
      <span v-else>
        <mt-cell id="nameM" title="修改申请参加的招聘会的职位信息" ></mt-cell><!--:to="{name:'wechatPersonalList',query:{type:'companyJobfairList'}}";:to="{name:'wechatPersonalList',query:{type:'campusList',id:$store.state.user.corpid}}";:to="{name:'wechatPersonalList',query:{type:'jobInfoList';:to="{name:'wechatPersonalList',query:{type:'corpLetterList'}}";:to="{path:'/QRcodePage',query:{title:'企业的二维码','info':$store.state.user.corpid}}"}}"-->
        <mt-cell id="nameN" title="企业宣讲会" ></mt-cell>
        <mt-cell id="nameN" title="企业的招聘信息" ></mt-cell>
        <mt-cell id="nameN" title="企业求职信" ></mt-cell>
        <mt-cell id="nameN" title="我的二维码" @click.native="toQrcode()"></mt-cell>
      </span>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
export default {
  name: 'Home',
  metaInfo: {
    title: '我的',
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      corpInfo: state => state.publics.corpInfo,
    }),
  },
  async created() {
    this.getCorpInfo();
  },
  methods: {
    ...mapActions(['getCorpInfo']),
    check() {
      return _.get(this.corpInfo, 'status');
    },
    //查看二维码
    toQrcode() {
      this.$router.push({ path: '/qrcode', query: { id: this.corpInfo.corpid } });
    },
  },
};
</script>

<style lang='css' scoped>
</style>
