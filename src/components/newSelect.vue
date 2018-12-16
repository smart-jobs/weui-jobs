<template lang='html'>
  <div id="newSelect">
      <mt-cell :title='title' @click.native="popupVisible=true">
        <span style="font-size:14px;" :style="selectColor">{{name||'请选择分站'}}</span>
      </mt-cell>

      <mt-popup
          v-model="popupVisible"
          position="right"
          id="xingb"
          style="width:100%;height:100%;">
          <mt-index-list>
          <mt-header title="请选择发布分站" >
              <mt-button  class="bgnone" slot="left" @click="popupVisible=false">返回</mt-button>
              <mt-button  class="bgnone" slot="right" @click="choose()">选择</mt-button>
          </mt-header>
          <mt-radio
          id="xingbie"
          v-model="selected"
          :options="list">
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
export default {
  name: 'newSelect',
  props: {
    type: { type: String, default: '' },
    title: { type: String, default: '' },
    originalValue: {},
  },
  components: {},
  data() {
    return {
      name: null,
      selected: '',
      popupVisible: false,
      list: [],
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
  methods: {
    ...mapActions(['loadUnit']),
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
      }
    },
    //切换选中的值
    choose() {
      this.list.find(item => {
        if (item.value === this.selected) {
          this.$set(this, 'name', item.label);
        }
      });
      this.$emit('input', this.selected);
      this.popupVisible = false;
    },
    //显示原数据
    getOriginalData() {
      this.selected = this.originalValue;
      this.list.find(item => {
        if (item.value === this.originalValue) {
          this.$set(this, 'name', item.label);
          this.$set(this, 'selected', item.value);
        }
      });
    },
  },
};
</script>

<style lang='css' scoped>
</style>
