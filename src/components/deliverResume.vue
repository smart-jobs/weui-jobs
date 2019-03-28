<template lang="html">
  <div id="deliverResume">
    <!--@click="deliver(scope.row._id,scope.row.corpid,'jobinfo',scope.row._tenant)"-->
    <mt-button v-if="titleBtn" class="bgnone" style="text-align:right !important;" @click="display()">投简历</mt-button>
    <mt-button v-if="uri.includes('index')" type="primary" class="btnClass" size="small" @click="display()">
      投简历
    </mt-button>
    <mt-button
      v-if="uri.includes('jobinfoDetail') && titleBtn == false"
      style="position: absolute ; left: 42% ; top: 5px; text-align: center !important; padding-left: 0 !important;"
      type="primary"
      @click="display()"
    >
      投简历
    </mt-button>

    <mt-popup v-model="popupVisible" position="center" :modal="false" style="align:center; overflow-y:scroll;width:100%;height:100%;">
      <mt-header title="选择简历模板">
        <mt-button class="bgnone" slot="left" @click="popupVisible = false">返回</mt-button>
        <mt-button class="bgnone" style="text-align:right !important;" slot="right" v-if="selectedId == ''" disabled>选择</mt-button>
        <mt-button class="bgnone" style="text-align:right !important;" slot="right" @click="toDeliver()" v-else>投简历</mt-button>
      </mt-header>

      <template>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="canLoadMore" :auto-fill="false" ref="loadmore">
          <div slot="top" class="mint-loadmore-top">
            <span style="padding: 7px 0; display: block; font-size: 14px;">刷新中...</span>
          </div>
          <el-table label="我的简历" highlight-current-row @current-change="select" :data="resumeList" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <ul>
                  <li class="tit" style="line-height:40px;">{{ scope.row.title }}</li>
                </ul>
              </template>
            </el-table-column>
            <template slot="empty">
              <ul>
                <!-- @click="$router.push({path:'/wechatMyInfo',query:{type:'resumeAdd'}})" -->
                <a href="user.html#/resumeAdd">
                  <li class="tit">
                    您没有简历,点击添加简历
                  </li>
                </a>
              </ul>
            </template>
          </el-table>
          <span v-if="canLoadMore" style="padding: 7px; display: block; font-size: 14px;">没有可加载的数据了</span>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span style="padding: 7px 0; display: block; font-size: 14px;" v-if="canLoadMore == false">正在加载...</span>
          </div>
        </mt-loadmore>
      </template>
    </mt-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'deliverResume',
  props: {
    origin: { type: String, default: null }, //来源id=>招聘会id/招聘信息id
    corpid: { type: String, default: null }, //企业id
    type: { type: String, defalut: '0' }, //类型=>0:招聘信息;1:招聘会
    _tenant: { type: String, defalut: null }, //分站信息,query部分
    titleBtn: { type: Boolean, defalut: false }, //企业详情页在标题框左侧显示投简历
  },
  data() {
    return {
      skip: 0,
      uri: window.location.pathname,
      popupVisible: false,
      canLoadMore: false,
      selectedId: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.publics.user,
      resumeList: state => state.publics.resumeList,
      limit: state => state.self.limit,
    }),
  },
  methods: {
    ...mapActions(['getResumeList', 'deliver']),
    //获取简历列表
    async getData() {
      console.log(this.titleBtn);
      await this.getResumeList({ skip: this.skip, limit: this.limit });
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
    //选择简历
    select(currentRow, oldCurrentRow) {
      this.selectedId = currentRow._id;
    },
    //投递简历
    async toDeliver() {
      if (this.corpid === null) {
        this.$message.error(`参数错误`);
        console.error(`corpid:${this.corpid}`);
        return;
      }
      const data = { corpid: this.corpid, resumeid: this.selectedId, type: this.type, origin: this.origin };
      let result = await this.deliver({ data: data, _tenant: this._tenant });
      this.$checkRes(result, () => {
        this.$message.success('投递简历成功');
        this.popupVisible = false;
      });
      this.selectedId = '';
    },
    //显示弹框内容
    async display() {
      this.popupVisible = true;
      await this.getData();
    },
  },
};
</script>

<style lang="css" scoped>
.btnClass{
    float:left;
    width:17%;
    padding:0;
    margin-right:0;
    position: absolute;
    bottom: 35px;
    border-radius: 0;
  }
  .mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}
</style>
