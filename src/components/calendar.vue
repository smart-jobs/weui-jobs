<template lang="html">
  <div id="calendar">
    <div>
      <div class="claTop">{{ time | yearMonth }}</div>
      <div class="claCenter">{{ time | monthDay }}</div>
      <div class="calBottom">{{ time | weekDay }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  props: {
    time: { type: String },
  },
  filters: {
    yearMonth(date) {
      if (date) {
        const tokens = date.split('-');
        return `${tokens[0]}-${Number(tokens[1])}`;
      }
      return '';
    },
    monthDay(date) {
      if (date) {
        const tokens = date.split('-');
        return tokens[2] || '';
      }
      return '';
    },
    weekDay(date) {
      const time = new Date(date);
      const day = time.getDay();
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return days[day];
    },
  },
};
</script>

<style lang="css" scoped>
.cla {
  float: left;
  width: 20%;
  margin-right: 2%;
  margin-left: 1%;
  height: 70px;
  border: 1px solid #2577e3;
  border-top: none;
}
.claTop {
  width: 100%;
  height: 20px;
  line-height: 20px;
  background: #2577e3;
  font-size: 11px;

  color: #fff;
  font-weight: bold;
  text-align: center;
}
.claCenter {
  font-size: 20px;
  color: #000;
  height: 30px;
  line-height: 33px;
  text-align: center;
}
.calBottom {
  line-height: 20px;
  height: 20px;
  text-align: center;
  font-size: 14px;
}
</style>
