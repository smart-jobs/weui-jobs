import { MessageBox } from 'mint-ui';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;

export default {
  messageAlert(info) {
    let msg = '';
    console.log(info);
    if (isNullOrUndefined(info)) {
      return;
    } else {
      msg = info;
    }
    MessageBox({
      title: '提示',
      message: msg,
    });
  },
  isDateOff(dataDate, now) {
    dataDate = new Date(dataDate);
    return dataDate > now;
  },
  
};
