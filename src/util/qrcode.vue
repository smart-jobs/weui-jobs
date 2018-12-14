<template lang='html'>
  <div id="qrcodes">
        <mt-header title="二维码">
            <mt-button  class="bgnone"  slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>
        <div id="qrcode"  style="position:absolute;top:30%;left:25%;"></div>
          <span v-if="user.role==='user'">
              <li class="txtQr" style="padding-top:7vh;">学生姓名：{{user.name||''}}</li>
              <li class="txtQr">门票类型：{{ ticketType }}</li>
          </span>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import QRCode from 'qrcodejs2';

export default {
  name: 'qrcodes',
  data() {
    return {
      id: this.$route.query.id || '',
      ticketType: this.$route.query.type && this.$route.query.type === '0' ? '普通票' : '受限票' || '',
      popupVisible: false,
    };
  },
  computed: {
    ...mapState({
      user: state => state.publics.user,
    }),
  },
  created() {
    this.$nextTick(() => {
      this.initQrcode();
    });
  },
  methods: {
    initQrcode() {
      if (!this.booForQrcode) {
        var qrcode = new QRCode('qrcode', {
          width: 150,
          height: 150,
          colorDark: '#123456',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.L,
        });
        qrcode.clear();
        qrcode.makeCode(this.id);
      }
    },
  },
};
</script>

<style lang='css' scoped>
.txtQr {
  font-size: 14px;
  text-align: center;
  min-height: 30px;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mint-header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #26a2ff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 16px;
  background: #2577e3;
  padding: 0;
  position: relative;
  text-align: center;
  white-space: nowrap;
}
</style>
