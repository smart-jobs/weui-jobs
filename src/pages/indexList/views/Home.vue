<template lang="html">
  <div id="Home">
    <mt-header title="智慧就业">
      <mt-button class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
    </mt-header>

    <list :type="type" :needBtn="true"> </list>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import list from '@/components/list.vue';
import methodsUtil from '@/util/methods-util';
import _ from 'lodash';
export default {
  name: 'Home',
  metaInfo: {
    title: '首页列表',
  },
  components: {
    list,
  },
  data() {
    return {};
  },
  async created() {
    console.log(this.$route);
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
    type: {
      get() {
        return _.get(methodsUtil.getParams(), 'type');
      },
    },
  },
  methods: {
    //获取首页列表;学生申请门票
    ...mapActions(['loadIndexList', 'userApply', 'getCorpInfo', 'userApply']),
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
      let url = `${type}.html?id=${row._id}`;
      if (type === 'jobinfoDetail') url += `&corpid=${row.corpid}`;
      window.location.href = url;
    },
    //(手指)向下拉,重载列表
    async loadTop() {
      this.skip = 0;
      await this.getData();
      this.$refs.loadmore.onTopLoaded();
    },
    //(手指)向上拉,继续读取数据
    async loadBottom() {
      this.skip += this.limit;
      await this.getData();
      this.$refs.loadmore.onBottomLoaded();
    },
    //判断是否可以继续读取数据
    canLoad(resultTotal) {
      if (this.resumeList.length == resultTotal) {
        this.resumeCanLoadMore = true;
      } else {
        this.resumeCanLoadMore = false;
      }
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

  .tit{
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .txt{

    font-size: 14px;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
