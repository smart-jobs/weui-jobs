<template lang='html'>
  <div id="deliverResume">
      <!--@click="deliver(scope.row._id,scope.row.corpid,'jobinfo',scope.row._tenant)"-->
    <mt-button v-if="uri.includes('/index.html')" type="primary" size='small' @click="popupVisible=true">
        投简历
    </mt-button>

    <mt-button v-else style="position: absolute ; left: 42% ;" type="primary"  @click="popupVisible=true">
        投简历
    </mt-button>

    <mt-popup
        v-model="popupVisible"
        position="center"
        style="align:center; overflow-y:scroll;width:80%;height:75%;">
        <mt-header title="选择简历模板">
            <mt-button  class="bgnone"  slot="left" @click="popupVisible=false">返回</mt-button>
            <mt-button class="bgnone"   slot="right" v-if="selectedId==''" disabled>选择</mt-button>
            <mt-button  class="bgnone"  slot="right" @click="deliver()" v-else>投简历</mt-button>
        </mt-header>  

        <template>
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="canLoadMore" :auto-fill="false" ref="loadmore">
                <div slot="top" class="mint-loadmore-top">
                    <span style="padding: 7px 0; display: block; font-size: 14px;">刷新中...</span>
                </div>
                <el-table
                    label="我的简历"
                    highlight-current-row
                    @current-change="select"
                    :data="list"
                    style="width: 100%">
                    <el-table-column>
                    <template slot-scope="scope">
                        <ul>
                            <li class="tit">{{ scope.row.title }}</li>
                        </ul>
                    </template>
                    </el-table-column>
                    <template slot="empty">
                        <ul>
                            <li class="tit" @click="$router.push({path:'/wechatMyInfo',query:{type:'resumeAdd'}})">您没有简历,点击添加简历</li>
                        </ul>
                    </template>
                </el-table>
                <span v-if="canLoadMore" style="padding: 7px; display: block; font-size: 14px;">没有可加载的数据了</span>
                <div slot="bottom" class="mint-loadmore-bottom">
                    <span  style="padding: 7px 0; display: block; font-size: 14px;" v-if="canLoadMore==false">正在加载...</span>
                </div>
            </mt-loadmore>
        </template>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'deliverResume',
  props: {
    userid: { type: String, default: null }, //用户id
    origin: { type: String, default: null }, //来源id=>招聘会id/招聘信息id
    corpid: { type: String, default: null }, //企业id
    type: { type: String, defalut: '0' }, //类型=>0:招聘信息;1:招聘会
    _tenant: { type: String, defalut: null }, //分站信息,query部分
  },
  data() {
    return {
      list: [],
      skip: 0,
      limit: 10,
      uri: window.location.pathname,
      popupVisible: false,
      canLoadMore: false,
      selectedId: '',
      api: {
        resumeList: '/weixin/api/jobs/resume/list', //query:userid,skip,limit
        //query:userid,_tenant;     body:corpid,resumeid=>selectId,type?0:1,origin:jobfair/jobinfo-id
        deliver: '/weixin/api/jobs/letter/deliver',
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取简历列表
    async getData() {
      let result = await this.$axios.$get(this.api.resumeList, { userid: this.userid, skip: this.skip, limit: this.limit });
      this.$checkRes(result, () => {
        if (this.skip === 0) {
          this.list = result;
        } else {
          result.forEach(item => {
            this.list.push(item);
          });
        }
        //判断是否还可以读取数据
        // this.canLoad(result.total);
      });
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
    async deliver() {
      const data = { corpid: this.corpid, resumeid: this.selectedId, type: this.type, origin: this.origin };
      console.log(data);
      let result = await this.$axios.$post(this.api.deliver, data, { userid: this.userid, _tenant: this._tenant });
      this.$checkRes(result, () => {
        this.popupVisible = false;
      });
    },
  },
};
</script>

<style lang='css' scoped>
</style>
