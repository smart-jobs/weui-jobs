<template lang="html">
  <div id="corpInfo">
    <!--招聘信息-->
    <mt-cell v-if="uri.includes('jobinfoDetail')" class="width" title="企业名称" style="text-align:left;" @click.native="display()">
      <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{ corpName || '' }} </span>
    </mt-cell>
    <!--宣讲会显示-->
    <mt-cell v-else-if="uri.includes('campusDetail')" class="width" title="企业名称" style="text-align:left;" @click.native="display()">
      <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{ corpName || '' }} </span>
    </mt-cell>
    <!--招聘会显示-->
    <div style="height:38px; line-height:38px; width:96%; margin:0 2%; border-bottom:2px solid #f4f4f4;" v-else @click="display()">{{ corpName }}</div>
    <mt-popup v-model="popupVisible" position="center" style="align:center; overflow-y:scroll;width:100%;height:100%;">
      <mt-header title="企业详情">
        <mt-button class="bgnone" slot="left" @click="popupVisible = false">返回</mt-button>
        <deliverResume
          v-if="checkDisplay('user') && isDateOff(expired) && corpid !== null && online === 0"
          slot="right"
          :titleBtn="titleBtn"
          :userid="user.userid"
          :corpid="corpid"
          :origin="origin"
          :_tenant="corpInfo._tenant"
          :type="type"
        ></deliverResume>
      </mt-header>
      <!--企业详情部分-->
      <span id="corpInfo" v-if="corpid !== null">
        <mt-cell title="企业名称" style="text-align:left;">
          <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{ corpInfo.corpname }} </span>
        </mt-cell>
          <mt-cell title="法人" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.legalPerson' } | getName }} </span>
          </mt-cell>

          <mt-cell title="组织机构代码类型" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.corptype' } | getName }} </span>
          </mt-cell>

          <mt-cell title="组织机构代码" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.corpcode' } | getName }} </span>
          </mt-cell>

          <mt-cell title="企业规模" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.scale.name' } | getName }} </span>
          </mt-cell>

          <mt-cell title="企业行业" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.industry.name' } | getName }} </span>
          </mt-cell>
          <mt-cell title="企业性质" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.nature.name' } | getName }} </span>
          </mt-cell>
          <mt-cell title="企业地址" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.address' } | getName }} </span>
          </mt-cell>
          <mt-cell title="企业邮箱" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.email' } | getName }} </span>
          </mt-cell>
          <mt-cell title="联系电话" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.mobile' } | getName }} </span>
          </mt-cell>
          <mt-cell title="固定电话" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.phone' } | getName }} </span>
          </mt-cell>
          <mt-cell title="网址" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.url' } | getName }} </span>
          </mt-cell>
          <mt-cell title="固定电话" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.phone' } | getName }} </span>
          </mt-cell>
          <mt-cell title="注册资金" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.registerMoney' } | getName }} </span>
          </mt-cell>
          <mt-cell title="注册时间" style="text-align:left;">
            <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.registerTime' } | getName }} </span>
          </mt-cell>
        <mt-cell title="企业详情" style="text-align:left; margin-bottom:15px !important;">
          <pre style="text-align:left;">{{ corpInfo.description }} </pre>
        </mt-cell>
      </span>
      <span id="corpInfo" v-else>
        <mt-cell title="企业名称" style="text-align:left;">
          <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{ pageCorpInfo.corpname }} </span>
        </mt-cell>
        <mt-cell title="企业详情" style="text-align:left; margin-bottom:15px !important;">
          <pre style="text-align:left;">{{ pageCorpInfo.description }} </pre>
        </mt-cell>
      </span>
      <!--企业招聘会招聘职位-->
      <span v-if="uri.includes('jobfairDetail')">
        <showJobsListCard :list="jobsList" :needBtn="false"></showJobsListCard>
      </span>
      <!--企业招聘的所有职位-->
      <span v-if="uri.includes('jobinfoDetail')">
        <span v-for="(item, index) in corpJobInfoList" :key="index">
          <el-card class="box-card">
            <!--v-if="item.status == 1"实际使用需要判断-->
            <ul style="text-align:left; float:left; width:70%; padding-bottom: 10px; margin-right:10%;" @click="detail(item._id)">
              <li slot="header" class="clearfix">
                招聘职位:
                {{ item.title }}
              </li>
              <li class="text item">
                需求人数:
                {{ item.count }}
              </li>
            </ul>
          </el-card>
        </span>
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
    fair_id: { type: String, default: null }, //招聘会id
    expired: { type: String }, //过期日期
    id: { type: String, default: null }, //未注册企业查询信息用这个
    jobs: { defalut: null }, //未注册企业招聘的职位列表
    online: { defalut: null }, //是否允许投简历
  },
  computed: {
    ...mapState({
      user: state => state.publics.user,
      corpInfo: state => state.self.corpInfo,
      jobInfoList: state => state.self.jobInfoList,
      corpJobInfoList: state => state.self.corpJobInfoList,
    }),
  },
  data() {
    return {
      uri: window.location.pathname,
      popupVisible: false,
      jobsList: [],
      pageCorpInfo: {},
    };
  },
  methods: {
    ...mapActions(['corpInfos', 'jobInfoLists', 'getCorpJobInfoList', 'getNotRegistCorpInfo']),
    async display() {
      //控制显示,判断是宣讲会和招聘信息=>判断有没有corpid,没有corpid不打开,返回去
      if (this.uri.includes('jobinfoDetail') || this.uri.includes('campusDetail')) {
        if (this.corpid === null) return false;
        else this.popupVisible = true;
      } else this.popupVisible = true;
      //查询详情:如果不是宣讲会和招聘信息,而是招聘会,判断corpid是不是null,是的话说明是外来企业,用外来企业接口
      if (this.corpid === null) {
        let result = await this.getNotRegistCorpInfo({ id: this.id });
        console.log(result);
        this.$set(this, 'pageCorpInfo', result);
        this.$set(this, 'jobsList', this.jobs);
        return;
      } else {
        await this.corpInfos({ corpid: this.corpid, _tenant: this._tenant });
      }
      //查询下面的两种招聘列表,如果是招聘会到此处,说明一定是注册的企业,查询这个企业在这场招聘会招聘什么职位=>赋值=>显示
      if (this.fair_id != null && this.uri.includes('jobfairDetail')) {
        await this.jobInfoLists({ corpid: this.corpid, fair_id: this.origin });
        this.$set(this, 'jobsList', this.jobInfoList.jobs);
      } else if (this.uri.includes('jobinfoDetail')) {
        //如果是招聘信息,说明这个企业是注册的企业,那就查这个企业招聘了什么职位即可
        await this.getCorpJobInfoList({ corpid: this.corpid, _tenant: this._tenant });
      }
    },
    //根据角色显示哪个功能按钮
    checkDisplay(type) {
      if (type === 'corp') {
        return methodsUtil.checkCorp({ role: _.get(this.user, 'role'), displayType: type });
      } else {
        return methodsUtil.checkCorp({ role: _.get(this.user, 'role'), displayType: type, userid: _.get(this.user, 'userid') });
      }
    },
    //详情
    detail(id) {
      let url = `jobinfoDetail.html?id=${id}&corpid=${this.corpid}`;
      window.location.href = url;
    },
    //判断信息是否过期
    isDateOff(date) {
      let result = methodsUtil.isDateOff(date);
      return result;
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
<style lang="css" scoped>
.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
