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
        <mt-cell id="nameM" title="修改招聘会的职位信息" @click.native="toList('corpJobfairList')"></mt-cell>
        <mt-cell id="nameN" title="企业宣讲会" @click.native="toList('corpCampusList')"></mt-cell>
        <mt-cell id="nameN" title="企业的招聘信息" @click.native="toList('corpJobinfoList')"></mt-cell>
        <mt-cell id="nameN" title="企业求职信" @click.native="toList('corpLetterList')"></mt-cell>
        <mt-cell id="nameN" title="企业二维码" @click.native="toQrcode()"></mt-cell>
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
    //查询列表+切换路由
    async toList(searchItem) {
      this.$router.push({ path: `/${searchItem}` });
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
#nameM{
    border-top: 2px solid #f4f4f4;
    margin-top: 50px;
}
</style>
