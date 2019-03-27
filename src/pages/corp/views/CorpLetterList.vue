<template lang="html">
  <div id="CorpLetterList">
    <mt-header title="企业求职信">
      <mt-button class="bgnone" slot="left" @click="$router.push({ path: '/' })">返回</mt-button>
    </mt-header>
    <newNavbar :titles="['招聘会求职信', '招聘信息求职信']" v-model="active"></newNavbar>
    <template>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="loadMore" :auto-fill="false" ref="loadmore">
        <div slot="top" class="mint-loadmore-top">
          <span style="padding: 7px 0; display: block; font-size: 14px;">刷新中...</span>
        </div>
        <mt-tab-container v-model="active">
          <mt-tab-container-item id="tab1">
            <el-table :data="fromJobfairList" style="width: 100%;">
              <el-table-column>
                <template slot-scope="scope">
                  <ul @click="toDetail(scope.row)" style="float:left; width:100%; ">
                    <li class="txtOne">姓名:{{ { data: scope.row, searchItem: 'info.xm' } | getName }}</li>
                    <li class="txtOne">性别:{{ { data: scope.row, searchItem: 'info.xb' } | getName }}</li>
                    <li class="txtOne">学历:{{ { data: scope.row, searchItem: 'info.xl' } | getName }}</li>
                    <li class="txtOne">毕业院校:{{ { data: scope.row, searchItem: 'info.yxmc' } | getName }}</li>
                    <li class="txtOne">专业:{{ { data: scope.row, searchItem: 'info.zymc' } | getName }}</li>
                    <li class="txtOne">状态:{{ scope.row.status == 0 ? '已接收' : scope.row.status == 1 ? '已接受' : '已拒绝' }}</li>
                  </ul>
                </template>
              </el-table-column>
            </el-table>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab2">
            <el-table :data="fromJobinfoList" style="width: 100%;">
              <el-table-column>
                <template slot-scope="scope">
                  <ul @click="toDetail(scope.row)" style="float:left; width:100%; ">
                    <li class="txtOne">姓名:{{ { data: scope.row, searchItem: 'info.xm' } | getName }}</li>
                    <li class="txtOne">性别:{{ { data: scope.row, searchItem: 'info.xb' } | getName }}</li>
                    <li class="txtOne">学历:{{ { data: scope.row, searchItem: 'info.xl' } | getName }}</li>
                    <li class="txtOne">毕业院校:{{ { data: scope.row, searchItem: 'info.yxmc' } | getName }}</li>
                    <li class="txtOne">专业:{{ { data: scope.row, searchItem: 'info.zymc' } | getName }}</li>
                    <li class="txtOne">状态:{{ scope.row.status == 0 ? '已接收' : scope.row.status == 1 ? '已接受' : '已拒绝' }}</li>
                  </ul>
                </template>
              </el-table-column>
            </el-table>
          </mt-tab-container-item>
        </mt-tab-container>
        <span style="padding: 7px 0; display: block; text-align:center; font-size: 14px;" v-if="loadMore">没有可加载的数据了</span>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span style="padding: 7px 0; display: block;  text-align:center;  font-size: 14px;" v-if="loadMore == false">正在加载...</span>
        </div>
      </mt-loadmore>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import newNavbar from '@/components/newNavbar.vue';
export default {
  name: 'CorpLetterList',
  metaInfo: {
    title: '企业求职信列表',
  },
  components: { newNavbar },
  data() {
    return {
      loadMore: false,
      fromJobfairList: [],
      fromJobfairSkip: 0,
      fromJobfairTotal: 0,
      fromJobinfoList: [],
      fromJobinfoSkip: 0,
      fromJobinfoTotal: 0,
      active: 'tab1',
    };
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
        return this.$route.name;
      },
    },
  },
  watch: {
    active: {
      async handler(newValue, oldValue) {
        this.canLoad();
      },
    },
  },
  created() {
    //默认进入读取两种类型的求职信
    this.firstInPage(1);
    this.firstInPage(0);
  },
  methods: {
    ...mapActions(['loadList']),
    async firstInPage(type) {
      let result;
      if (type === 1) {
        //招聘会求职信处理
        result = await this.loadList({ skip: this.fromJobfairSkip, uri: this.type, corpid: this.user.corpid, type: '1' });
        const { data, total } = result;
        this.fromJobfairList = data;
        this.fromJobfairTotal = total;
        this.canLoad();
      } else {
        //招聘信息求职信处理
        result = await this.loadList({ skip: this.fromJobinfoSkip, uri: this.type, corpid: this.user.corpid, type: '0' });
        const { data, total } = result;
        this.fromJobinfoList = data;
        this.fromJobinfoTotal = total;
      }
    },
    //(手指)向下拉,重载列表
    async loadTop() {
      let result;
      if (this.active === 'tab1') {
        this.fromJobfairSkip = 0;
        result = await this.loadList({ skip: this.fromJobfairSkip, uri: this.type, corpid: this.user.corpid, type: '1' });
      } else {
        this.fromJobinfoSkip = 0;
        result = await this.loadList({ skip: this.fromJobinfoSkip, uri: this.type, corpid: this.user.corpid, type: '0' });
      }
      this.arrangeData(result);
      this.canLoad();
      this.$refs.loadmore.onTopLoaded();
    },
    //(手指)向上拉,继续读取数据
    async loadBottom() {
      let result;
      if (this.active === 'tab1') {
        //当前标签是tab1=>招聘会求职信,所以type为1
        this.fromJobfairSkip += this.limit;
        result = await this.loadList({ skip: this.fromJobfairSkip, uri: this.type, corpid: this.user.corpid, type: '1' });
      } else {
        this.fromJobinfoSkip += this.limit;
        result = await this.loadList({ skip: this.fromJobinfoSkip, uri: this.type, corpid: this.user.corpid, type: '0' });
      }
      this.arrangeData(result);
      this.canLoad();
      this.$refs.loadmore.onBottomLoaded();
    },
    //判断是否可以继续读取数据
    canLoad() {
      if (this.active === 'tab1') {
        if (this.fromJobfairList.length >= this.fromJobfairTotal) {
          this.loadMore = true;
        } else {
          this.loadMore = false;
        }
      } else {
        if (this.fromJobinfoList.length >= this.fromJobinfoTotal) {
          this.loadMore = true;
        } else {
          this.loadMore = false;
        }
      }
    },
    //判断是哪个列表,然后将数据整合
    arrangeData(result) {
      console.log(result);
      const { data, total } = result;
      if (this.active === 'tab1') {
        //招聘会,再判断是刷新还是加载
        if (this.fromJobfairSkip === 0) {
          this.fromJobfairList = data;
        } else {
          data.forEach(item => {
            this.fromJobfairList.push(item);
          });
        }
        this.fromJobfairTotal = total;
      } else {
        if (this.fromJobinfoSkip === 0) {
          this.fromJobinfoList = data;
        } else {
          data.forEach(item => {
            this.fromJobinfoList.push(item);
          });
        }
        this.fromJobinfoTotal = total;
      }
    },
    //查看详情+审核
    toDetail(row) {
      this.$router.push({ path: '/corpLetterDetail', query: { id: row._id } });
    },
  },
};
</script>

<style scoped>
@import '../../../style/index.css';
@import '../../../style/common.css';
</style>
<style lang="css" scoped>

.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height:40px;
  font-size: 16px;
}
</style>
