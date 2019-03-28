<template lang="html">
  <div id="QrcodeCorpInfo">
     <mt-header title="企业详情">
        <mt-button class="bgnone" slot="left" @click="$router.go(-1)">返回</mt-button>
      </mt-header>

      <span id="corpInfo">
        <mt-cell title="企业名称" style="text-align:left;">
          <span style="color:black;font-size: 14px; padding: 10px 0; line-height: 20px;"> {{ corpInfo.corpname }} </span>
        </mt-cell>

        <mt-cell title="法人" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.legalPerson' } | getName }} </span>
        </mt-cell>

        <mt-cell title="组织机构代码类型" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.corptype' } | getName }} </span>
        </mt-cell>

        <mt-cell title="组织机构代码" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.corpcode' } | getName }} </span>
        </mt-cell>

        <mt-cell title="企业规模" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.scale.name' } | getName }} </span>
        </mt-cell>

        <mt-cell title="企业行业" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.industry.name' } | getName }} </span>
        </mt-cell>
        <mt-cell title="企业性质" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.nature.name' } | getName }} </span>
        </mt-cell>
        <mt-cell title="企业地址" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.address' } | getName }} </span>
        </mt-cell>
        <mt-cell title="企业邮箱" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.email' } | getName }} </span>
        </mt-cell>
        <mt-cell title="联系电话" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.mobile' } | getName }} </span>
        </mt-cell>
        <mt-cell title="固定电话" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.phone' } | getName }} </span>
        </mt-cell>
        <mt-cell title="网址" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.url' } | getName }} </span>
        </mt-cell>
        <mt-cell title="固定电话" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'contact.phone' } | getName }} </span>
        </mt-cell>
        <mt-cell title="注册资金" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.registerMoney' } | getName }} </span>
        </mt-cell>
        <mt-cell title="注册时间" style="text-align:left;">
          <span style="color:black;"> {{ { data: corpInfo, searchItem: 'info.registerTime' } | getName }} </span>
        </mt-cell>
        <mt-cell title="企业详情" style="text-align:left; margin-bottom:15px !important;">
          <pre style="text-align:left;">{{ corpInfo.description }} </pre>
        </mt-cell>
      </span>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import methodsUtil from '@/util/methods-util';
export default {
  name: 'QrcodeCorpInfo',
  components: {},
  data() {
    return {
      corpid: this.$route.query.corpid,
      tenant: this.$route.query._tenant,
      corpInfo: {},
    };
  },
  computed: {},
  async created() {
    await this.search();
  },
  methods: {
    ...mapActions(['corpInfos']),
    async search() {
      let result = await this.corpInfos({ corpid: this.corpid, _tenant: this.tenant });
      this.$checkRes(result, () => {
        this.$set(this, 'corpInfo', result);
      });
    },
  },
  filters: {
    getName(object) {
      const { data, searchItem } = object;
      if (searchItem === 'info.corptype') {
        return _.get(data, searchItem) === 0 ? '统一社会信用代码' : '单位组织机构代码';
      }
      return _.get(data, searchItem);
    },
  },
};
</script>

<style lang="css" scoped>

</style>
