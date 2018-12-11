<template lang="html">
  <div id="Home">
      <mt-header title="招聘信息详情">
            <mt-button   class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>    
        <mt-cell :title="detail.title"  class="width" id="title"></mt-cell>
        <corpInfo :titleBtn="true" :corpName="detail.corpname" :corpid="detail.corpid" :_tenant="detail._tenant" :origin="detail._id" :type="'0'"></corpInfo>
        <mt-cell class="width"  title="薪资待遇" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{{data:detail,searchItem:"salary.name"}|getName}} </span>
        </mt-cell>
        <mt-cell class="width"  title="招聘人数" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{detail.count}} </span>
        </mt-cell>
        <mt-cell class="width"  title="工作性质" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{{data:detail,searchItem:"nature.name"}|getName}} </span>
        </mt-cell>
        <mt-cell class="width"  title="工作类型" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{{data:detail,searchItem:"jobcat.name"}|getName}} </span>
        </mt-cell>
        <mt-cell class="width"  title="工作简述" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{detail.jobdesc}} </span>
        </mt-cell>
        <mt-cell class="width"  title="学历要求" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{{data:detail,searchItem:"xlreqs.name"}|getName}} </span>
        </mt-cell>
        <mt-cell class="width"  title="专业要求" style="text-align:left;">
              <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{detail.zyreqs}} </span>
        </mt-cell>
        <mt-cell class="width"  title="分站信息" style="text-align:left;">
              <span style="color:black;font-size: 14px;"> {{findUnit(detail.unit)}} </span>
        </mt-cell>
         <mt-cell>
              <deliverResume v-if='isDateOff(detail.expired)&&checkDisplay("user")' :userid="user.userid" :corpid="detail.corpid" :origin="detail._id" :_tenant="detail._tenant" :type="'0'"></deliverResume>
        </mt-cell> 
        <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab0" >
                <pre  style="text-align:left;">{{detail.content}}</pre>
            </mt-tab-container-item>
        </mt-tab-container>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import deliverResume from '@/components/deliverResume.vue';
import corpInfo from '@/components/corpInfo.vue';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';
export default {
  name: 'Home',
  metaInfo: {
    title: '招聘信息详情',
  },
  components: {
    deliverResume,
    corpInfo,
  },
  data() {
    return {
      active: 'tab0',
    };
  },
  async created() {
    await this.jobinfoDetail();
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
    ...mapActions(['jobinfoDetail', 'getCorpInfo']),
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
