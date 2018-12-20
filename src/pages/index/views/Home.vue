<template lang="html">
  <div id="Home">
      <mt-header title="智慧就业"></mt-header>

      <mt-swipe :auto="4000">
        <mt-swipe-item>
            <img style="width:100%; height:100%;"  src="http://static.bibibi.net/frontend/public/images/push/push_3.jpg">
        </mt-swipe-item>
      </mt-swipe>
      <newNavbar :titles="navbar" v-model="active"></newNavbar>
      <mt-tab-container v-model="active" style="width:100%; padding:0;">
        <!--主页-招聘会列表-->
          <mt-tab-container-item id="tab1" style="width:100%; padding:0;">
            <el-table
              label="招聘会"
              :data="jobfairList.data"
              style="width: 100%;">
              <el-table-column >
                <template slot-scope="scope">
                  <!-- <span> -->
                    <calendar :time="scope.row.date" class="cla" style="margin-top: 10px;"></calendar>
                    <ul @click="toDetail('jobfairDetail',scope.row)" style="float:left; width:53%; margin-right:2%;">
                        <li class="tit">{{ scope.row.subject }} </li>
                        <li class="txt">举办地址：{{ scope.row.address }}</li>
                        <li class="txt">举办日期：{{ scope.row.date }}</li>
                        <li class="txt" >分站信息：{{findUnit( scope.row.unit )}}</li>
                    </ul>
                    <!--style删掉就能看见按钮了,报名的判断少:isDateOff(scope.row.date)&&,先调样式不加-->
                    <mt-button 
                        type="primary" 
                        size='small' 
                        class="btnClass"
                        v-if='checkDisplay("user")'
                        @click='apply(scope.row._id)'> 
                        我要报名
                    </mt-button>
                    <div v-else-if='checkDisplay("corp")'>
                      <div v-if="pageCheckCorp(scope.row.unit)">
                        <addJobsPage btnTitle="申请加入" :fair_id="scope.row._id" ></addJobsPage>
                      </div>  
                    </div> 
                  <!-- </span> -->
                </template>
              </el-table-column>
            </el-table>
           <!-- <router-link :to="{path:'/'}"  v-if="jobfairList.total>limit"  class="moreA" > -->
                <p @click="toList('jobfairList')" class="moreA">查看更多</p>
            <!-- </router-link> -->
          </mt-tab-container-item>
          <!--主页-宣讲会列表-->
          <mt-tab-container-item id="tab2" style="width:100%; padding:0;">
            <el-table
              label="宣讲会"
              :data="campusList.data"
              style="width: 100%">
              <el-table-column>
              <template slot-scope="scope">
                <span>
                  <calendar :time="scope.row.date" class="cla" style="margin-top: 10px;"></calendar>
                  <ul @click="toDetail('campusDetail',scope.row)" style="float:left; width:73%; margin-right:3%;">
                    <li class="tit">{{ scope.row.subject }}</li>
                    <li class="txt">举办地址：{{ scope.row.address }}</li>
                    <li class="txt mb0">举办日期：{{ scope.row.date }}</li>
                    <li class="txt mb0">分站信息：{{ findUnit( scope.row.unit ) }}</li>
                  </ul>
                </span>
              </template>
              </el-table-column>
            </el-table>
            <!-- <router-link :to="{path:'/'}"  v-if="campusList.total>limit"  class="moreA" > -->
                <p @click="toList('campusList')" class="moreA">查看更多</p>
            <!-- </router-link> -->
          </mt-tab-container-item>
          <!--主页-招聘信息列表-->
          <mt-tab-container-item id="tab3" style="width:100% !important; padding:0 !important;">
            <el-table
                label="招聘信息"
                :data="jobinfoList.data"
                style="width: 100%">
                <el-table-column>
                <template slot-scope="scope">
                  <span>
                    <ul @click="toDetail('jobinfoDetail',scope.row)" style="float:left; width:78%; margin-right:2%;">
                      <li class="tit">{{ scope.row.title }}</li>
                      <li class="txtOne">需求人数：{{ scope.row.count }}</li>
                      <li class="txtOne">工作性质：{{{data:scope.row,searchItem:'nature.name'}|getName }}</li>
                      <li class="txtOne">薪资待遇：{{{data:scope.row,searchItem:'salary.name'}|getName }}</li>
                      <li class="txtOne">最低学历：{{{data:scope.row,searchItem:'xlreqs.name'}|getName }}</li>
                      <li class="txt mb0" style="float:left;">所在城市:{{ {data:scope.row,searchItem:'city.name'}|getName }}</li>
                      <li style="font-size:12px; color:#888;"> </li>
                    </ul>
                    <span v-if='isDateOff(scope.row.expired)&&checkDisplay("user")'>
                      <deliverResume :corpid="scope.row.corpid" :origin="scope.row._id" :_tenant="scope.row._tenant" :type="'0'"></deliverResume>
                    </span>
                  </span>
                </template>
                </el-table-column>
            </el-table>
            <!-- <router-link :to="{path:'/'}"  v-if="jobinfoList.total>limit"  class="moreA" > -->
                <p @click="toList('jobinfoList')" class="moreA">查看更多</p>
            <!-- </router-link> -->
          </mt-tab-container-item>

      </mt-tab-container>
      
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import newNavbar from '@/components/newNavbar.vue';
import calendar from '@/components/calendar.vue';
import addJobsPage from '@/components/addJobsPage.vue';
import deliverResume from '@/components/deliverResume.vue';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';

export default {
  name: 'Home',
  metaInfo: {
    title: '首页',
  },
  components: {
    newNavbar,
    calendar,
    addJobsPage,
    deliverResume,
  },
  data() {
    return {
      //首页列表变量
      jobfairList: [],
      campusList: [],
      jobinfoList: [],
      //列表选择表头
      navbar: ['招聘会', '宣讲会', '招聘信息'],
      active: 'tab1',
      listContext: [
        { prop: 'subject', label: '' },
        { prop: 'address', label: '举办地址' },
        { prop: 'date', label: '举办日期' },
        { prop: 'unit', label: '分站信息' },
      ],
      api: {
        jobfairList: '/weixin/api/jobs/jobfair/query_g',
        campusList: '/weixin/api/jobs/campus/query_g',
        jobinfoList: '/weixin/api/jobs/jobinfo/query_g',
      },
    };
  },
  async created() {
    await this.getData();
    if (_.get(this.user, 'role') === 'corp') {
      await this.getCorpInfo();
    }
  },
  computed: {
    ...mapState({
      unitList: state => state.publics.unitList,
      user: state => state.publics.user,
      corpInfo: state => state.publics.corpInfo,
      limit: state => state.self.limit,
    }),
  },
  methods: {
    //获取首页列表;学生申请门票
    ...mapActions(['loadIndexList', 'userApply', 'getCorpInfo', 'userApply', 'corpApply']),
    //获取首页的招聘会,宣讲会,招聘信息列表
    async getData() {
      const { jobfairList, campusList, jobinfoList } = await this.loadIndexList();
      this.$checkRes(jobfairList, () => {
        this.jobfairList = jobfairList;
      });
      this.$checkRes(campusList, () => {
        this.campusList = campusList;
      });
      this.$checkRes(jobinfoList, () => {
        this.jobinfoList = jobinfoList;
      });
    },
    //筛选分站名称
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
    //申请加入/我要门票
    async apply(fair_id) {
      let result = await this.userApply({ fair_id: fair_id });
      this.$checkRes(result, () => {});
    },
    //跳转详情页
    toDetail(type, row) {
      let url = `/${type}.html?id=${row._id}`;
      if (type === 'jobinfoDetail') url += `&corpid=${row.corpid}`;
      window.location.href = url;
    },
    //跳转列表页
    toList(type) {
      let url = `/indexList.html?type=${type}`;
      window.location.href = url;
    },
  },
};
</script>
<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
</style>
<style lang="css" scoped>
.mint-swipe {
  overflow: hidden;
  position: relative;
  height: 29vh;
}
.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.btnClass{
    float:left; 
    width:17%; 
    padding:0; 
    margin-right:0;
    position: absolute; 
    bottom: 29px;
    border-radius: 0;
  }
</style>
