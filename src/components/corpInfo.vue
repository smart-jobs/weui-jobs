<template lang='html'>
  <div id="corpInfo">
    <!--招聘信息-->
    <mt-cell v-if="uri.includes('/jobinfoDetail')" class="width" title="企业名称" style="text-align:left;" @click.native="display()">
        <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{corpName||''}} </span>
    </mt-cell>
    <!--宣讲会显示-->
    <mt-cell v-else-if="uri.includes('/campusDetail')" class="width" title="企业名称" style="text-align:left;" @click.native="display()">
        <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{corpName||''}} </span>
    </mt-cell>
    <!--招聘会显示-->
    <div style="height:38px; line-height:38px; width:96%; margin:0 2%; border-bottom:2px solid #f4f4f4;" v-else  @click="display()">{{corpName}}</div>
    <mt-popup
        v-model="popupVisible"
        position="center"
        style="align:center; overflow-y:scroll;width:100%;height:100%;">
        <mt-header title="企业详情">
            <mt-button  class="bgnone"  slot="left" @click="popupVisible=false">返回</mt-button>
            <deliverResume v-if="checkDisplay('user')" slot="right"  :titleBtn="titleBtn" :userid="user.userid" :corpid="corpid" :origin="origin" :_tenant="corpInfo._tenant" :type="type" ></deliverResume>
        </mt-header>
        <!--企业详情部分-->
        <span id="corpInfo">

          <mt-cell title="企业名称" style="text-align:left;">
                <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{corpInfo.corpname}} </span>
          </mt-cell>

           <mt-cell title="法人" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.legalPerson"}|getName}} </span>
          </mt-cell>

          <mt-cell title="组织机构代码类型" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.corptype"}|getName}} </span>
          </mt-cell>

           <mt-cell title="组织机构代码" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.corpcode"}|getName}} </span>
          </mt-cell>

          <mt-cell title="企业规模" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.scale.name"}|getName}} </span>
          </mt-cell>

          <mt-cell title="企业行业" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.industry.name"}|getName}} </span>
          </mt-cell>
          <mt-cell title="企业性质" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.nature.name"}|getName}} </span>
          </mt-cell>
          <mt-cell title="企业地址" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.address"}|getName}} </span>
          </mt-cell>
          <mt-cell title="企业邮箱" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.email"}|getName}} </span>
          </mt-cell>
          <mt-cell title="联系电话" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.mobile"}|getName}} </span>
          </mt-cell>
          <mt-cell title="固定电话" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.phone"}|getName}} </span>
          </mt-cell>
          <mt-cell title="网址" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.url"}|getName}} </span>
          </mt-cell>
          <mt-cell title="固定电话" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"contact.phone"}|getName}} </span>
          </mt-cell>
          <mt-cell title="注册资金" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.registerMoney"}|getName}} </span>
          </mt-cell>
          <mt-cell title="注册时间" style="text-align:left;">
                <span style="color:black;"> {{{data:corpInfo,searchItem:"info.registerTime"}|getName}} </span>
          </mt-cell>
          <mt-cell title="企业详情" style="text-align:left; margin-bottom:15px !important;">
                <pre style="text-align:left;">{{corpInfo.description}} </pre>
          </mt-cell>
        </span>
        <!--企业招聘职位-->
        <span v-if="uri.includes('/jobfairDetail')">
          <showJobsListCard :list="jobInfoList.jobs" :needBtn="false" ></showJobsListCard>
        </span>
    </mt-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import showJobsListCard from './showJobsList-card.vue';
import deliverResume from '@/components/deliverResume.vue';
import methodsUtil from '@/util/methods-util';
export default {
  name: 'corpInfo',
  components: {
    showJobsListCard,
    deliverResume,
  },
  props: {
    corpName: { type: String, default: null }, //企业名称,显示用
    corpid: { type: String, default: null }, //企业id,query部分
    _tenant: { type: String, defalut: null }, //分站信息,query部分
    origin: { type: String, default: null }, //招聘会/招聘信息id,query部分
    type: { type: String, default: null }, //判断是招聘会还是招聘信息,0:招聘信息;1:招聘会
    titleBtn: { type: Boolean, defalut: true }, //企业详情页在标题框左侧显示投简历
  },
  computed: {
    ...mapState({
      user: state => state.publics.user,
      corpInfo: state => state.self.corpInfo,
      jobInfoList: state => state.self.jobInfoList,
    }),
  },
  data() {
    return {
      uri: window.location.pathname,
      popupVisible: false,
    };
  },
  methods: {
    ...mapActions(['corpInfos', 'jobInfoLists']),
    async display() {
      console.log(this.titleBtn);
      this.popupVisible = true;
      await this.corpInfos({ corpid: this.corpid, _tenant: this._tenant });
      if (this.fair_id != null) await this.jobInfoLists({ corpid: this.corpid, fair_id: this.origin });
    },
    //根据角色显示哪个功能按钮
    checkDisplay(type) {
      if (type === 'corp') {
        return methodsUtil.checkCorp({ role: _.get(this.user, 'role'), displayType: type });
      } else {
        return methodsUtil.checkCorp({ role: _.get(this.user, 'role'), displayType: type, userid: _.get(this.user, 'userid') });
      }
    },
  },
  filters: {
    getName(object) {
      const { data, searchItem } = object;
      if (searchItem === 'info.corptype') {
        return _.get(data, searchItem) === 0 ? '统一社会信用代码' : '单位组织机构代码';
      }
      return _.get(data, searchItem);
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

</style>
