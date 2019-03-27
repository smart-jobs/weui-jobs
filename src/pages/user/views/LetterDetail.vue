<template lang="html">
  <div id="LetterDetail">
    <mt-header title="求职信详情">
      <mt-button class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
    </mt-header>
    <mt-cell id="nameN" :title="{ data: info, searchItem: 'info.xm' } | getName" style="text-align:center;"> </mt-cell>

    <mt-cell title="性别" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'info.xb' } | getName }} </span>
    </mt-cell>
    <mt-cell title="学历" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'info.xl' } | getName }} </span>
    </mt-cell>
    <mt-cell title="毕业学校" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'info.yxmc' } | getName }} </span>
    </mt-cell>
    <mt-cell title="专业名称" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'info.zymc' } | getName }} </span>
    </mt-cell>
    <mt-cell title="求职来源" style="text-align:left;">
      <span style="color:black;" v-if="info.type == 0"> 招聘信息</span>
      <span style="color:black;" v-if="info.type == 1"> 招聘会 </span>
    </mt-cell>
    <mt-cell title="联系方式" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'contact.mobile' } | getName }} </span>
    </mt-cell>
    <mt-cell title="电子邮箱" style="text-align:left;">
      <span style="color:black;"> {{ { data: info, searchItem: 'contact.email' } | getName }} </span>
    </mt-cell>
    <mt-field label="自我介绍" id="neirong" style="text-align:left;" v-model="info.content" type="textarea" rows="5" disabled></mt-field>
    <mt-cell title="状态" style="text-align:left;">
      <span style="color:green;" v-if="info.status == '1'"> 已接受</span>
      <span style="color:red;" v-else-if="info.status == '2'"> 已拒绝</span>
      <span style="color:black;" v-else> 已接收</span>
    </mt-cell>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'LetterDetail',
  metaInfo: {
    title: '求职信详情',
  },
  components: {},
  data() {
    return {
      info: {},
      id: this.$route.query.id,
    };
  },
  computed: {
    ...mapState({
      detail: state => state.self.detail,
    }),
  },
  async created() {
    const result = await this.loadDetail({ uri: 'letterDetail', id: this.id });
    this.$checkRes(result, () => {
      this.$set(this, 'info', result);
    });
  },
  methods: {
    ...mapActions(['loadDetail']),
  },
};
</script>

<style lang="css" scoped>
  .mint-header{
    background-color: #2577e3;
    height: 40px;
    line-height: 40px;
    font-size: 16px;

}
</style>
