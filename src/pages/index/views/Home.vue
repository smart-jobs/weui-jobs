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
          <mt-tab-container-item id="tab0" style="width:100%; padding:0;">
            <el-table
              label="招聘会"
              :data="jobfairList"
              style="width: 100%;">
              <el-table-column >
                <template slot-scope="scope">
                    <calendar :time="scope.row.date"></calendar>
                    <ul  style="float:left; width:53%; margin-right:2%;">
                        <li class="tit">{{ scope.row.subject }} </li>
                        <li class="txt">举办地址：{{ scope.row.address }}</li>
                        <li class="txt mb0">举办日期：{{ scope.row.date }}</li>
                        <li class="txt mb0" >分站信息：{{findUnit( scope.row.unit )}}</li>
                    </ul>
                    <!--style删掉就能看见按钮了,报名的判断少:&&isDateOff(scope.row.date),先调样式不加-->
                    <mt-button 
                        type="primary" 
                        size='small' 
                        class="btnClass"
                        v-if='checkDisplay("user")'
                        @click='apply(scope.row._id)'> 
                        我要报名
                    </mt-button>
                    <div v-else-if='checkDisplay("corp")'>
                      <div v-if="checkCorp(scope.row.unit)">
                        <addJobsPage btnTitle="申请加入" :fair_id="scope.row._id"></addJobsPage>
                      </div>  
                  </div> 
                </template>
              </el-table-column>
            </el-table>
          </mt-tab-container-item>

      </mt-tab-container>
      
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import newNavbar from "@/components/newNavbar.vue";
import calendar from "@/components/calendar.vue";
import addJobsPage from "@/components/addJobsPage.vue";
import methodsUtil from "@/util/methods-util";
import _ from "lodash";
export default {
  name: "Home",
  metaInfo: {
    title: '首页',
  },
  components: {
    newNavbar, calendar, addJobsPage
  },
  data() {
    return {
      //首页列表变量
      jobfairList: [],
      campusList: [],
      jobinfoList: [],
      //列表选择表头
      navbar: ["招聘会", "宣讲会", "招聘信息"],
      active: "tab0",
      
    };
  },
  created() {
    this.getData();
    if (_.get(this.user, "role") === "corp") {
      this.getCorpInfo()
    }
  },
  computed: {
    ...mapState({
      "unitList": state => state.publics.unitList,
      "user": state => state.publics.user,
      "corpInfo": state => state.publics.corpInfo
    })
  },
  methods: {
    //获取首页列表;学生申请门票
    ...mapActions(['loadIndexList',
      'userApply', 'getCorpInfo',
      'userApply', 'corpApply']),
    //获取首页的招聘会,宣讲会,招聘信息列表
    async getData() {
      const { jobfairList, campusList, jobinfoList } = await this.loadIndexList();
      this.$checkRes(jobfairList, () => {
        this.jobfairList = jobfairList.data
      })
      this.$checkRes(campusList, () => {
        this.campusList = campusList.data
      })
      this.$checkRes(jobinfoList, () => {
        this.jobinfoList = jobinfoList.data
      })
    },
    //筛选分站名称
    findUnit(unit) {
      let result;
      this.unitList.find((item) => {
        if (item.value == unit) result = item.label
      })
      return result;
    },
    //判断信息是否过期
    isDateOff(date) {
      let result = methodsUtil.isDateOff(date)
      return result
    },
    //检查企业是否可以申请加入
    checkCorp(unit) {
      return methodsUtil.checkCorp({ role: _.get(this.user, "role"), unit: unit, selfUnit: _.get(this.user, "unit"), status: _.get(this.corpInfo, "status") })
    },
    //根据角色显示哪个功能按钮
    checkDisplay(type) {
      if (type === "corp") {
        return methodsUtil.checkCorp({ role: _.get(this.user, "role"), displayType: type })
      } else {
        return methodsUtil.checkCorp({ role: _.get(this.user, "role"), displayType: type, userid: _.get(this.user, "userid") })
      }
    },
    //申请加入/我要门票
    async apply(fair_id) {
        let result=await this.userApply({ fair_id: fair_id})
        this.$checkRes(result,()=>{

        })
    },
    
  }
}
</script>
<style scoped>
@import "../../../style/index.css";
</style>
<style lang="css" scoped>
.mint-swipe {
  overflow: hidden;
  position: relative;
  height: 29vh;
}
.mint-header {
  background-color: #2577e3;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding: 0;
}
</style>
