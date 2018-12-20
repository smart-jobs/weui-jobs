<template lang='html'>
  <div id="newSelect">
      <mt-cell :title='title' @click.native="openPopup()">
        <span style="font-size:14px;" :style="selectColor">{{name||placeholder}}</span>
      </mt-cell>

      <mt-popup
          v-model="popupVisible"
          position="right"
          id="xingb"
          style="width:100%;height:100%;">
          <mt-index-list>
          <mt-header title="请选择" >
              <mt-button  class="bgnone" slot="left" @click="closePopup()">返回</mt-button>
              <mt-button  class="bgnone" style="text-align:right !important;" slot="right" @click="choose()">选择</mt-button>
          </mt-header>
          <mt-radio
          id="xingbie"
          v-model="selected"
          :options="list">
          </mt-radio>
          </mt-index-list>
      </mt-popup>

      <!--二级选择-->
      <mt-popup
          v-model="popupVisible2"
          position="right"
          id="xingb"
          style="width:100%;height:100%;">
          <mt-index-list>
          <mt-header title="请选择" >
              <mt-button  class="bgnone" slot="left" @click="popupVisible2=false">返回</mt-button>
              <mt-button  class="bgnone" slot="right" @click="chooseCity()">选择</mt-button>
          </mt-header>
          <mt-radio
          id="xingbie"
          v-model="citySelected"
          :options="cityList">
          </mt-radio>
          </mt-index-list>
      </mt-popup>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;
const noCity = ['110000', '120000', '310000', '500000', '710000', '810000', '820000']; //直辖市,自治区,特别行政区
export default {
  name: 'newSelect',
  props: {
    type: { type: String, default: '' },
    title: { type: String, default: '' },
    placeholder: { type: String },
    originalValue: {},
    canEdit: { type: Boolean, default: true }, //true可以编辑;false不可以编辑
    mode: { type: String, default: 'code' }, //code:只要码/both:全都要
  },
  components: {},
  data() {
    return {
      name: null,
      selected: '',
      popupVisible: false,
      popupVisible2: false,
      list: [],
      cityList: [],
      citySelected: '',
    };
  },
  computed: {
    ...mapState({
      unitList: state => state.publics.unitList,
      user: state => state.publics.user,
    }),
    selectColor: {
      get() {
        let style = {};
        if (!isNullOrUndefined(this.name)) {
          style = { color: 'black' };
        }
        return style;
      },
      set(value) {
        let style = { color: 'black' };
        return style;
      },
    },
  },
  async created() {
    await this.loadUnit();
    await this.getData();
  },
  watch: {
    originalValue: {
      handler(newValue, oldValue) {
        if (!isNullOrUndefined(this.originalValue)) {
          this.getOriginalData();
        }
      },
    },
  },
  methods: {
    ...mapActions(['loadUnit', 'loadDictionary']),
    async getData() {
      if (this.type === 'unit') {
        let result = [];
        this.user.units.forEach(item => {
          this.unitList.find(unitItem => {
            if (unitItem.value === item) {
              result.push(unitItem);
              return;
            }
          });
        });
        this.list = result;
        if (!isNullOrUndefined(this.originalValue)) {
          this.getOriginalData();
        }
      } else {
        let result;
        //城市单处理
        if (this.type === 'city') {
          result = await this.loadDictionary({ type: 'provice' });
        } else {
          result = await this.loadDictionary({ type: this.type });
        }
        this.$checkRes(result, () => {
          this.$set(this, 'list', result);
        });
      }
    },
    //切换选中的值
    async choose() {
      //城市单处理
      if (this.type === 'city') {
        let result;
        //查询是不是直辖市...或者是城市
        result = _.findIndex(noCity, item => {
          return item === this.selected;
        });
        //<0结果:不是直辖市之类的
        if (result < 0) {
          //继续查询
          result = await this.loadDictionary({ type: 'city', parent: this.selected });
          this.$set(this, 'cityList', result);
          this.popupVisible2 = true;
        } else {
          //是直辖市...,直接数据操作
          this.turnNewData();
        }
      } else {
        this.turnNewData();
      }
    },
    //显示原数据
    async getOriginalData() {
      if (typeof this.originalValue === 'object') {
        if (this.type === 'city') {
          let result;
          //查询是不是直辖市...或者是城市
          result = _.findIndex(noCity, item => {
            return item === this.originalValue.code;
          });
          if (result < 0) {
            result = await this.loadDictionary({ type: 'city', parent: this.originalValue.code });
            let provice = `${this.originalValue.code.substring(0, 2)}0000`;
            let proviceName = _.find(this.list, item => {
              return item.value === provice;
            }).label;
            this.$set(this, 'cityList', result);
            this.$set(this, 'selected', provice);
            this.$set(this, 'name', `${proviceName}-${this.originalValue.name}`);
            this.$set(this, 'citySelected', this.originalValue.code);
            return;
          } else {
            this.selected = this.originalValue.code;
          }
        } else {
          this.selected = this.originalValue.code;
        }
      } else {
        this.selected = this.originalValue;
      }
      this.list.find(item => {
        if (item.value === this.selected) {
          this.$set(this, 'name', item.label);
          this.$set(this, 'selected', item.value);
        }
      });
    },
    //打开弹框
    openPopup() {
      this.popupVisible = this.canEdit;
      if (this.type === 'city' && this.citySelected !== '') {
        this.popupVisible2 = this.canEdit;
      }
    },
    //关闭弹框
    closePopup() {
      this.popupVisible = false;
    },
    //处理数据
    turnNewData() {
      let choosed;
      this.list.find(item => {
        if (item.value === this.selected) {
          this.$set(this, 'name', item.label);
          choosed = item;
        }
      });
      if (this.mode === 'code') {
        this.$emit('input', choosed.value);
      } else {
        choosed = { name: choosed.label, code: choosed.value };
        this.$emit('input', choosed);
      }
      this.popupVisible = false;
    },
    //选择城市
    chooseCity() {
      let choosed;
      this.cityList.find(item => {
        if (item.value === this.citySelected) {
          this.$set(this, 'name', item.label);
          choosed = { name: item.label, code: item.value };
        }
      });
      this.$emit('input', choosed);
      this.popupVisible = false;
      this.popupVisible2 = false;
    },
  },
};
</script>
<style scoped>
@import '../style/index.css';
@import '../style/common.css';
@import '../style/jobFair.less';
</style>
<style lang='css' scoped>
.mint-header {
  background-color: #2577e3;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
