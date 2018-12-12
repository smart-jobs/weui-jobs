<template lang='html'>
  <div id="list">
      <template>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="loadMore" :auto-fill="false" ref="loadmore">
            <el-table
              :data="list"
              style="width: 100%;">
              <el-table-column>
                <template slot-scope="scope">
                  <calendar v-if="needCalendar" :time="scope.row.date"></calendar>
                  <ul @click="toDetail(scope.row)" style="float:left; width:53%; margin-right:2%;">
                    <span v-for="(item, index) in  listContext" :key="index">
                      <li>
                        <listOptions :content="arrangeData({data:scope.row,optionTitle:item})" :selectClass="selectClass({data:scope.row,optionTitle:item})" ></listOptions>
                      </li>   
                    </span>
                  </ul>
                  <span v-if="needBtn"><!--判断是否需要按钮-->
                    <!--招聘会-->
                    <span v-if='selectBtn()==="jobfairList"'>
                      <mt-button type="primary" size='small' v-if='checkDisplay("user")' @click='apply(scope.row._id)'> 
                          我要报名
                      </mt-button>
                      <addJobsPage v-if='checkDisplay("corp")&&pageCheckCorp(scope.row.unit)' btnTitle="申请加入" :fair_id="scope.row._id"></addJobsPage>
                    </span>
                    <!--招聘信息-->
                    <deliverResume v-if='selectBtn()==="jobinfoList"&&isDateOff(scope.row.expired)&&checkDisplay("user")' :corpid="scope.row.corpid" :origin="scope.row._id" :_tenant="scope.row._tenant" :type="'0'"></deliverResume>
                    <!--学生简历=>删除-->
                    <!-- <mt-button v-if='selectBtn()==="resumeList"' type='danger' size='small' @click="toDeleteResume(scope.row._id)">删除</mt-button> -->
                    <!--入场券二维码-->
                    <qrcode v-if='selectBtn()==="ticketList"' :fair_id='scope.row.fair_id'></qrcode>
                  </span>
                </template>
              </el-table-column>
            </el-table>
        </mt-loadmore>
      </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import methodsUtil from '@/util/methods-util';
import calendar from '@/components/calendar.vue';
import addJobsPage from '@/components/addJobsPage.vue';
import qrcode from '@/components/qrcode.vue';
import listOptions from '@/components/listOptions.vue';
import deliverResume from '@/components/deliverResume.vue';
import { Util } from 'naf-core';
import * as optionTitles from '@/util/optionTitles';

const { isNullOrUndefined } = Util;
export default {
  name: 'list',
  components: {
    listOptions,
    calendar,
    deliverResume,
    qrcode,
    addJobsPage,
  },
  props: {
    needBtn: { type: Boolean, default: false },
    type: { type: String, default: '' },
  },
  data() {
    return {
      tableTitle: '',
      loadMore: false,
      skip: 0,
      listContext: [],
      needCalendar: true,
    };
  },
  computed: {
    ...mapState({
      unitList: state => state.publics.unitList,
      user: state => state.publics.user,
      corpInfo: state => state.publics.corpInfo,
      limit: state => state.self.limit,
      list: state => state.self.listForComponent,
      total: state => state.self.totalForComponent,
    }),
  },
  async created() {
    this.selcetOptionsTitle();
    await this.loadList({ skip: this.skip, type: this.type });
    this.canLoad();
    console.log(this.list);
  },
  methods: {
    ...mapActions(['loadList', 'userApply', 'getCorpInfo', 'userApply', 'corpApply', 'deleteResume']),
    //-----数据加载部分:-----
    //(手指)向下拉,重载列表
    async loadTop() {
      this.skip = 0;
      await this.loadList({ skip: this.skip, type: this.type });
      this.canLoad();
      this.$refs.loadmore.onTopLoaded();
    },
    //(手指)向上拉,继续读取数据
    async loadBottom() {
      this.skip += this.limit;
      await this.loadList({ skip: this.skip, type: this.type });
      this.canLoad();
      this.$refs.loadmore.onBottomLoaded();
    },
    //判断是否可以继续读取数据
    canLoad() {
      if (this.list.length >= this.total) {
        this.loadMore = true;
      } else {
        this.loadMore = false;
      }
    },
    //查看详情
    toDetail(row) {
      //首页的3个列表是location.herf;其他的跳转应该都是路由改变
      let routerPath = this.$route.path;
      let params = methodsUtil.getParams();
      if (isNullOrUndefined(routerPath)) {
        if (_.get(params, 'type') === 'jobfairList') {
          window.location.href = `/jobfairDetail.html?id=${row._id}`;
        } else if (_.get(params, 'type') === 'campusList') {
          window.location.href = `/campusDetail.html?id=${row._id}`;
        } else if (_.get(params, 'type') === 'jobinfoList') {
          window.location.href = `/jobinfoDetail.html?id=${row._id}&corpid=${row.corpid}`;
        } else {
          console.error('跳转出现错误,请调试list.vue组件');
        }
      } else {
        //切换路由,之后写
      }
    },
    //-----数据处理部分:-----
    //整理列表数据,显示的字符串
    arrangeData(datas) {
      const { data, optionTitle } = datas;
      let result = _.get(data, optionTitle.prop);
      if (optionTitle.prop === 'unit') {
        let unitName = this.findUnit(result);
        return `${optionTitle.label}:${unitName}`;
      } else if (optionTitle.prop === 'type') {
        let routerPath = this.$route.name;
        if (routerPath === 'letterList') {
          let text = result === 0 ? '招聘信息' : '招聘会';
          return `类型:${text}`;
        } else if (routerPath === 'ticketList') {
          let text = result === 0 ? '受限票' : '普通票';
          return `${text}`;
        }
      } else if (optionTitle.prop === 'status') {
        let text = result === 0 ? '已接收' : result === 1 ? '已接受' : '已拒绝';
        return `状态:${text}`;
      } else if (optionTitle.prop === 'origin') {
        let text = result === 0 ? '本校学生' : '校外学生';
        return `${text}`;
      } else if (optionTitle.label !== '') {
        return `${optionTitle.label}:${result}`;
      } else {
        return `${result}`;
      }
    },
    //选择列表文字样式
    selectClass(datas) {
      const { data, optionTitle } = datas;
      if (optionTitle.label !== '') {
        return 'txt';
      } else {
        return 'tit';
      }
    },
    //筛选分站名称
    findUnit(unit) {
      let result;
      this.unitList.find(item => {
        if (item.value == unit) result = item.label;
      });
      return result;
    },
    //-----按钮判断部分:-----
    //使用哪个按钮
    selectBtn() {
      //两部分判断,1)一部分是取出url的参数判断是:企业申请加入招聘会/学生参加招聘会,还是学生投简历
      //2)另一部分是url都是user,判断路由是:学生简历的删除,还是入场券的二维码
      let routerPath = this.$route.name;
      let params = methodsUtil.getParams();
      if (isNullOrUndefined(routerPath)) {
        //1)情况
        return params.type;
      } else {
        //2)情况
        return routerPath;
      }
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
    //删除简历
    async toDeleteResume(resumeid) {
      let result = await this.deleteResume(resumeid);
      this.$checkRes(result, () => {});
    },
    //-----选择输出字段------
    selcetOptionsTitle() {
      //将标头整理到文件中,引用文件=>判断=>赋值
      let param = methodsUtil.getParams();
      let routerPath = this.$route.name;
      if (param.type === 'jobfairList') {
        this.listContext = optionTitles.JOBFAIR_TITLE;
      } else if (param.type === 'campusList') {
        this.listContext = optionTitles.CAMPUS_TITLE;
      } else if (param.type === 'jobinfoList') {
        this.listContext = optionTitles.JOBINFO_TITLE;
        this.needCalendar = false;
      } else if (routerPath === 'resumeList') {
        this.listContext = optionTitles.RESUME_TITLE;
        this.needCalendar = false;
      } else if (routerPath === 'letterList') {
        this.listContext = optionTitles.LETTER_TITLE;
        this.needCalendar = false;
      } else if (routerPath === 'ticketList') {
        this.listContext = optionTitles.TICKET_TITLE;
      }
    },
  },
};
</script>

<style lang='css' scoped>
</style>
