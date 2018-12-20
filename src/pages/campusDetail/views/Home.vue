<template lang="html">
  <div id="Home">
      <mt-header title="宣讲会详情">
            <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header> 
        <mt-cell  class="width" :title="detail.subject" id="title"></mt-cell>
        <corpInfo :titleBtn="false" :corpName="detail.corpname" :corpid="detail.corpid" :_tenant="detail._tenant" ></corpInfo>
        <mt-cell class="width" title="分站信息" style="text-align:left;">
              <span style="color:black;"> {{findUnit(detail.unit)}}</span>
        </mt-cell>
        <mt-cell class="width" title="举办时间" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.date}} {{detail.time}} </span>
        </mt-cell>
        <mt-cell class="width" title="联系电话" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.contact}} </span>
        </mt-cell>
        <mt-cell class="width" title="电子邮箱" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.email}} </span>
        </mt-cell>
        <mt-cell class="width" title="举办地址" style="text-align:left;">
              <span style="color:black; font-size:14px;"> {{detail.address}} </span>
        </mt-cell>
        <mt-cell id="nameSpan" class="width" title="" >
              <span class="spanCla">温馨提示：为防讯息临时变动,参会前可联系招聘会举办方确认。</span>
        </mt-cell>
        <newNavbar v-model="active" :titles="navbar"></newNavbar>
        <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab1" >
                <pre  style="text-align:left;">{{detail.content}}</pre>
            </mt-tab-container-item>

            <mt-tab-container-item id="tab2">
                <jobsList :list="detail.jobs" :needBtn="false"></jobsList>
            </mt-tab-container-item>
        </mt-tab-container>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import newNavbar from '@/components/newNavbar.vue';
import jobsList from '@/components/showJobsList-card.vue';
import corpInfo from '@/components/corpInfo.vue';
export default {
  name: 'Home',
  metaInfo: {
    title: '宣讲会详情',
  },
  components: {
    newNavbar,
    jobsList,
    corpInfo,
  },
  data() {
    return {
      active: 'tab1',
      navbar: ['宣讲会详情', '招聘职位'],
    };
  },
  async created() {
    await this.campusDetail();
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
    }),
  },
  methods: {
    ...mapActions(['campusDetail', 'getCorpInfo']),
    //筛选分站信息
    findUnit(unit) {
      let result;
      this.unitList.find(item => {
        if (item.value == unit) result = item.label;
      });
      return result;
    },
  },
};
</script>

<style lang="css" scoped>
</style>
<style lang="css" scoped>
.mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}

</style>
