<template lang="html">
  <div id="Home">
    <mt-header :title="isDateOff(detail.date) ? '招聘会详情' : '招聘会详情(已过期)'">
      <mt-button class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
    </mt-header>
    <div>
      <p class="title">{{ detail.subject }}</p>
    </div>

    <!-- <mt-cell ref="title" id="title" class="width" :title="detail.subject"> </mt-cell> -->
    <!-- <mt-cell class="width" title="招聘会类型" style="text-align:left; ">
      <span style="color:black;  font-size:14px;"> {{ detail.type }} </span>
    </mt-cell> -->
    <mt-cell class="width" title="举办学校" style="text-align:left;">
      <span class="schoolCla">{{ findUnit(detail.unit) }}</span>
    </mt-cell>
    <mt-cell class="width" title="举办地址" style="text-align:left;">
      <span style="color:black;  font-size:14px;"> {{ detail.address }} </span>
    </mt-cell>
    <mt-cell class="width" title="举办时间" style="text-align:left;">
      <span style="color:black;  font-size:14px;"> {{ detail.date }} {{ detail.time }}</span>
    </mt-cell>
    <mt-cell id="nameSpan" class="width" title="">
      <span class="spanCla">温馨提示：为防讯息临时变动,参会前可联系招聘会举办方确认。</span>
    </mt-cell>
    <mt-cell style="height:60px;">
      <mt-button
        style="position: absolute !important; left: 42% !important;"
        type="primary"
        v-if="isDateOff(detail.date) && checkDisplay('user') && detail.external !== 1"
        @click="apply('user')"
        >我要报名</mt-button
      >
      <addJobsPage btnTitle="申请加入" :fair_id="detail._id" v-if="isDateOff(detail.date) && checkDisplay('corp') && pageCheckCorp(detail.unit) && detail.external !== 1"></addJobsPage>
    </mt-cell>
    <newNavbar v-model="active" :titles="navbar"></newNavbar>
    <mt-tab-container v-model="active">
      <mt-tab-container-item id="tab1">
        <div class="details" v-html="detail.content"></div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab2">
        <span v-for="(item, index) in corpList" :key="index" id="com">
          <corpInfo
            :fair_id="detail._id"
            :titleBtn="true"
            :corpName="item.corpname"
            :corpid="item.corpid"
            :_tenant="detail._tenant"
            :origin="detail._id"
            :type="'1'"
            :expired="detail.date"
            :id= "item.id"
            :jobs="item.jobs"
            :online="item.online"
          ></corpInfo>
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
import corpInfo from '@/components/corpInfo.vue';
import addJobsPage from '@/components/addJobsPage.vue';
export default {
  name: 'Home',
  metaInfo: {
    title: '招聘会详情',
  },
  components: {
    newNavbar,
    addJobsPage,
    corpInfo,
  },
  data() {
    return {
      active: 'tab1',
      navbar: ['招聘会详情', '参展企业'],
    };
  },
  async created() {
    await this.jobfairDetail();
    if (_.get(this.user, 'role') === 'corp') {
      await this.getCorpInfo();
    }
  },
  computed: {
    ...mapState({
      unitList: state => state.publics.unitList,
      user: state => state.publics.user,
      corpInfo: state => state.publics.corpInfo,
      detail: state => state.self.detail,
      corpList: state => state.self.corpList,
    }),
  },
  methods: {
    ...mapActions(['jobfairDetail', 'getCorpInfo', 'userApply']),
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
    //申请加入/我要门票
    async apply(fair_id) {
      let result = await this.userApply({ fair_id: this.detail._id });
      this.$checkRes(result, () => {
        this.$message.success('申请成功');
      });
    },
  },
};
</script>

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
@import '../../../style/jobFair.less';
</style>

<style lang="css" scoped>
.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.mint-cell-title {
  width: 80px !important;
  padding-left: 25px !important;
  -webkit-box-flex: 0 !important;
  -ms-flex: none !important;
  flex: none !important;
  text-align: left !important;
}
.title {
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
}
.details {
  padding: 10px;
}
</style>
