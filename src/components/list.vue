<template lang="html">
  <div id="list">
    <template>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="loadMore" :auto-fill="false" ref="loadmore">
        <div slot="top" class="mint-loadmore-top">
          <span style="padding: 7px 0; display: block;text-align: center; font-size: 14px;">刷新中...</span>
        </div>
        <el-table :data="list" style="width: 100%;">
          <el-table-column>
            <template slot-scope="scope">
              <calendar v-if="needCalendar" :time="scope.row.date" class="cla" style="margin-top: 10px;"></calendar>
              <ul @click="toDetail(scope.row)" style="float:left;margin-right:2%;" :style="getUlWidth">
                <!--width:宣讲会73,招聘信息78,招聘会53-->
                <span v-for="(item, index) in listContext" :key="index">
                  <li>
                    <listOptions
                      :content="arrangeData({ data: scope.row, optionTitle: item })"
                      :selectClass="selectClass({ data: scope.row, optionTitle: item })"
                    ></listOptions>
                  </li>
                </span>
              </ul>
              <span v-if="needBtn"
                ><!--判断是否需要按钮-->
                <!--招聘会-->
                <span v-if="selectBtn() === 'jobfairList'">
                  <mt-button type="primary" size="small" class="btnClass" v-if="checkDisplay('user') && scope.row.external !==1" @click="apply(scope.row._id)">
                    我要报名
                  </mt-button>
                  <addJobsPage v-if='checkDisplay("corp")&&pageCheckCorp(scope.row.unit) && scope.row.external !==1' btnTitle="申请加入" :fair_id="scope.row._id"></addJobsPage>
                </span>
                <!--招聘信息-->
                <deliverResume
                  v-if="selectBtn() === 'jobinfoList' && isDateOff(scope.row.expired) && checkDisplay('user') && scope.row.external !==1 && scope.row.online === 0"
                  :corpid="scope.row.corpid"
                  :origin="scope.row._id"
                  :_tenant="scope.row._tenant"
                  :type="'0'"
                ></deliverResume>
                <!--学生简历=>删除-->
                <mt-button
                  v-if="selectBtn() === 'resumeList'"
                  type="danger"
                  style="bottom: 5px !important;"
                  class="btnClass"
                  size="small"
                  @click="toDeleteResume(scope.row._id)"
                  >删除</mt-button
                >
                <!--入场券二维码-->
                <mt-button v-if="selectBtn() === 'ticketList'" type="primary" class="btnClass" style="bottom: 30px;" size="small" @click="toQrcode(scope.row)">
                  二维码
                </mt-button>
                <!-- <qrcode v-if='selectBtn()==="ticketList"' :fair_id='scope.row.fair_id'></qrcode> -->
              </span>
            </template>
          </el-table-column>
        </el-table>
        <span style="padding: 7px 0; display: block; text-align: center; font-size: 14px;" v-if="loadMore">没有可加载的数据了</span>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span style="padding: 7px 0; display: block;text-align: center; font-size: 14px;" v-if="loadMore == false">正在加载...</span>
        </div>
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
import listOptions from '@/components/listOptions.vue';
import deliverResume from '@/components/deliverResume.vue';
import * as optionTitles from '@/util/optionTitles';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
export default {
  name: 'list',
  components: {
    listOptions,
    calendar,
    deliverResume,
    // addJobsPage,
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
    getUlWidth: {
      get() {
        let style = { width: '53%' };
        let routerPath = this.$route.name;
        let params = methodsUtil.getParams();
        if ((routerPath !== undefined && routerPath.includes('Jobfair')) || (params.type !== undefined && params.type.includes('jobfair'))) {
          return style;
        } else if ((routerPath !== undefined && routerPath.includes('Campus')) || (params.type !== undefined && params.type.includes('campus'))) {
          style = { width: '73%' };
          return style;
        } else if ((routerPath !== undefined && routerPath.includes('Jobinfo')) || (params.type !== undefined && params.type.includes('jobinfo'))) {
          style = { width: '78%' };
          return style;
        } else if (routerPath === 'resumeList') {
          style = { width: '78%' };
          return style;
        } else if (routerPath === 'letterList') {
          style = { width: '98%' };
          return style;
        } else {
          return style;
        }
      },
    },
  },
  async created() {
    this.selcetOptionsTitle();
    await this.getData();
    this.canLoad();
  },
  methods: {
    ...mapActions(['loadList', 'userApply', 'getCorpInfo', 'userApply', 'corpApply', 'deleteResume']),
    //-----数据加载部分:-----
    //根据加载列表不同,需要的参数不同,所以需要判断
    async getData() {
      let routerPath = this.$route.path;
      if (isNullOrUndefined(routerPath)) {
        await this.loadList({ skip: this.skip, uri: this.type });
      } else {
        if (this.user.role === 'corp') {
          await this.loadList({ skip: this.skip, uri: this.type, corpid: this.user.corpid });
        } else {
          await this.loadList({ skip: this.skip, uri: this.type, userid: this.user.userid });
        }
        this.canLoad();
      }
    },
    //(手指)向下拉,重载列表
    loadTop() {
      this.skip = 0;
      this.getData();
      this.canLoad();
      this.$refs.loadmore.onTopLoaded();
    },
    //(手指)向上拉,继续读取数据
    loadBottom() {
      this.skip += this.limit;
      this.getData();
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
          let text = result === '0' ? '招聘会' : '招聘信息';
          return `类型:${text}`;
        } else if (routerPath === 'ticketList') {
          let text = result === '0' ? '普通票' : '受限票';
          return `${text}`;
        }
      } else if (optionTitle.prop === 'status') {
        let routerPath = this.$route.name;
        if ((routerPath !== undefined && routerPath.includes('CampusList')) || (routerPath !== undefined && routerPath.includes('campusList'))) {
          let text = result === '0' ? '审核成功' : result === '1' ? '未审核' : '审核失败';
          return `审核状态:${text}`;
        } else if (routerPath === undefined) {
          return;
        } else {
          let text = result === '0' ? '已接收' : result === '1' ? '已接受' : '已拒绝';
          return `状态:${text}`;
        }
      } else if (optionTitle.prop === 'origin') {
        let text = result === '0' ? '本校学生' : '校外学生';
        return `${text}`;
      } else if (optionTitle.prop === 'date') {
        let timeResult = this.isDateOff(result) ? '未过期' : '已过期';
        return `状态:${timeResult}`;
      } else if (optionTitle.prop === 'expired') {
        let timeResult = this.isDateOff(result) ? '招聘中' : '已过期';
        return `状态:${timeResult}`;
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
        let routerPath = this.$route.name;
        let params = methodsUtil.getParams();
        if (routerPath === 'corpJobinfoList') {
          return 'txtOne';
        } else {
          return 'txt';
        }
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
      this.$checkRes(result, () => {
        this.$message.success('申请成功');
      });
    },
    //删除简历
    async toDeleteResume(resumeid) {
      console.log(resumeid, this.user.userid);
      let result = await this.deleteResume({ resumeid: resumeid, userid: this.user.userid });
      this.$checkRes(result, () => {
        this.$message.success('删除简历成功');
        this.getData();
      });
    },
    //查看二维码
    toQrcode(row) {
      this.$router.push({ path: '/qrcode', query: { id: row._id, type: row.type } });
    },
    //-----选择输出字段------
    selcetOptionsTitle() {
      //将标头整理到文件中,引用文件=>判断=>赋值
      let param = methodsUtil.getParams();
      let routerPath = this.$route.name;
      if (isNullOrUndefined(routerPath)) {
        switch (param.type) {
          case 'jobfairList':
            this.listContext = optionTitles.JOBFAIR_TITLE;
            break;
          case 'campusList':
            this.listContext = optionTitles.CAMPUS_TITLE;
            break;
          case 'jobinfoList':
            this.listContext = optionTitles.JOBINFO_TITLE;
            this.needCalendar = false;
            break;
          default:
            console.error('找不到对应的列名');
            break;
        }
      } else {
        switch (routerPath) {
          case 'resumeList':
            this.listContext = optionTitles.RESUME_TITLE;
            this.needCalendar = false;
            break;
          case 'letterList':
            this.listContext = optionTitles.LETTER_TITLE;
            this.needCalendar = false;
            break;
          case 'ticketList':
            this.listContext = optionTitles.TICKET_TITLE;
            break;
          case 'corpJobfairList':
            this.listContext = optionTitles.CORP_JOBFAIR;
            break;
          case 'corpCampusList':
            this.listContext = optionTitles.CAMPUS_TITLE;
            break;
          case 'corpJobinfoList':
            this.listContext = optionTitles.JOBINFO_TITLE;
            this.needCalendar = false;
            break;
          default:
            console.error('找不到对应的列名');
            break;
        }
      }
    },
    //查看详情
    toDetail(row) {
      //首页的3个列表是location.herf;其他的跳转应该都是路由改变
      //this.$emit('toDetail');
      let routerPath = this.$route.name;
      let params = methodsUtil.getParams();
      if (isNullOrUndefined(routerPath)) {
        if (_.get(params, 'type') === 'jobfairList') {
          window.location.href = `jobfairDetail.html?id=${row._id}`;
        } else if (_.get(params, 'type') === 'campusList') {
          window.location.href = `campusDetail.html?id=${row._id}`;
        } else if (_.get(params, 'type') === 'jobinfoList') {
          window.location.href = `jobinfoDetail.html?id=${row._id}&corpid=${row.corpid}`;
        } else {
          console.error('跳转出现错误,请调试list.vue组件-toDetail(row)-if部分');
        }
      } else {
        //切换路由,之后写
        //修改:可以根据当前路由名进行截串,取'List'前的字符串,然后使用字符串模板后面加上Detail
        if (routerPath.includes('resume')) {
          this.$router.push({ name: 'resumeDetail', query: { id: row._id } });
        } else if (routerPath.includes('letter')) {
          this.$router.push({ name: 'letterDetail', query: { id: row._id } });
        } else if (routerPath === 'corpJobfairList') {
          this.$router.push({ name: 'corpJobfairDetail', query: { id: row._id } });
        } else if (routerPath === 'corpCampusList') {
          this.$router.push({ name: 'corpCampusDetail', query: { id: row._id } });
        } else if (routerPath === 'corpJobinfoList') {
          this.$router.push({ name: 'corpJobinfoDetail', query: { id: row._id } });
        }
      }
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
.btnClass {
  float: left;
  width: 17%;
  padding: 0;
  margin-right: 0;
  position: absolute;
  bottom: 29px;
  border-radius: 0;
}
</style>
