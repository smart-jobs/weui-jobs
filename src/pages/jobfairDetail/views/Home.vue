<template lang="html">
  <div id="Home">
      <mt-header title="招聘会详情">
            <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>    
        <mt-cell ref="title" id="title" class="width"  :title="detail.subject">
           
        </mt-cell>
        <mt-cell class="width" title="招聘会类型" style="text-align:left; ">
              <span style="color:black;  font-size:14px;"> {{detail.type}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办时间" style="text-align:left;">
              <span style="color:black;  font-size:14px;"> {{detail.date}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办城市" style="text-align:left;">
              <span style="color:black;  font-size:14px;"> {{{data:detail,searchItem:"city.name"}|getName}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办地址" style="text-align:left;">
              <span style="color:black;  font-size:14px;"> {{detail.address}} </span>
        </mt-cell>
        <mt-cell class="width" title="分校信息" style="text-align:left;">
               <span class="schoolCla">{{ findUnit( detail.unit ) }}</span>
        </mt-cell>
        <mt-cell id="nameN" class="width" title="" >
              <span class="spanCla">温馨提示：为防讯息临时变动,参会前可联系招聘会举办方确认。</span>
        </mt-cell>
         <mt-cell>
            <mt-button style="position: absolute !important; left: 42% !important;" type="primary" v-if='isDateOff(detail.date)&&checkDisplay("user")' @click="apply('user')">我要报名</mt-button>
            <addJobsPage btnTitle="申请加入" :fair_id="detail._id" v-if='isDateOff(detail.date)&&checkDisplay("corp")&&pageCheckCorp(detail.unit)'></addJobsPage>
        </mt-cell> 
        <newNavbar v-model="active" :titles="navbar"></newNavbar>
        <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab0" >
                <pre  style="text-align:left;">{{detail.content}}</pre>
            </mt-tab-container-item>

            <mt-tab-container-item id="tab1">
                <span v-for="(item,index) in corpList" :key="index" id="com">
                    <mt-cell :title="item.corpname"  is-link @click.native.prevent="change(item.corpid,detail._tenant,'jobfair')"></mt-cell>
                </span>
            </mt-tab-container-item>
        </mt-tab-container>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';
import newNavbar from '@/components/newNavbar.vue';
import addJobsPage from '@/components/addJobsPage.vue';
export default {
  name: 'Home',
  metaInfo: {
    title: '招聘会详情',
  },
  components: {
    newNavbar,
    addJobsPage,
  },
  data() {
    return {
      detail: {},
      corpList: [],
      active: 'tab0',
      navbar: ['招聘会详情', '参展企业'],
    };
  },
  created() {
    this.getData();
    if (_.get(this.user, 'role') === 'corp') {
      this.getCorpInfo();
    }
  },
  computed: {
    ...mapState({
      unitList: state => state.publics.unitList,
      user: state => state.publics.user,
      corpInfo: state => state.publics.corpInfo,
    }),
  },
  methods: {
    ...mapActions(['jobfairDetail', 'getCorpInfo']),
    //获取招聘会详情
    async getData() {
      let { jobfairDetail, jobfairCorpList } = await this.jobfairDetail();
      this.$checkRes(jobfairDetail, () => {
        this.detail = jobfairDetail;
      });
      this.$checkRes(jobfairCorpList, () => {
        this.corpList = jobfairCorpList;
      });
    },
    //筛选分站信息
    findUnit(unit) {
      let result;
      this.unitList.find(item => {
        if (item.value == unit) result = item.label;
      });
      return result;
    },
    //判断信息是否过期
    isDateOff(date) {
      let result = methodsUtil.isDateOff(date);
      return result;
    },
    //检查企业是否可以申请加入
    pageCheckCorp(unit) {
      return methodsUtil.checkCorp({ role: _.get(this.user, 'role'), unit: unit, selfUnit: _.get(this.user, 'unit'), status: _.get(this.corpInfo, 'status') });
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
};
</script>

<style lang="css" scoped>
</style>
