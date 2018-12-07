import { MessageBox } from 'mint-ui';
import { Util } from 'naf-core';

const { isNullOrUndefined } = Util;

export default {
  //是否提示信息
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
  //判断信息是否过期
  isDateOff(dataDate) {
    const now = new Date();
    dataDate = new Date(dataDate);
    return dataDate > now;
  },
  //判断企业是否可以执行此动作/显示
  checkCorp(data) {
    const { role, unit, selfUnit, status, displayType, userid } = data;
    if (!isNullOrUndefined(selfUnit) && !isNullOrUndefined(status)) {
      return role === 'corp' && selfUnit === unit && status === '0';
    } else if (!isNullOrUndefined(displayType)) {
      if(role==="corp"){
        return role === displayType;
      } else {
        return role === displayType && !isNullOrUndefined(userid);
      }
      
    }
  },
};
