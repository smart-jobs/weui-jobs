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
                        <!-- <li class="txt mb0">举办日期：{{ scope.row.date }}</li> -->
                        <li class="txt mb0">分站信息：{{school( scope.row.unit )}}</li>
                    </ul>
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
// import methodsUtil from "@/util/methods-util";
export default {
  name: "Home",
  metaInfo: {
    title: '首页',
  },
  components: {
    newNavbar, calendar
  },
  data() {
    return {
      jobfairList: [],
      campusList: [],
      jobinfoList: [],
      navbar: ["招聘会", "宣讲会", "招聘信息"],
      active: "tab0"
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState({
      "unitList": state=>state.publics.unitList
    })
  },
  methods: {
    ...mapActions(['loadIndexList']),
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
    school(unit) {
      let result;
      this.unitList.find((item)=>{
        if(item.value==unit) result=item.label
      })
      return result;
    },
  }
}
</script>

<style lang="css" scoped>
.mint-swipe {
  overflow: hidden;
  position: relative;
  height: 29vh;
}
</style>
